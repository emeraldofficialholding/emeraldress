-- Rate limiting + reservations atomiche per /api/checkout.
-- - api_rate_limits: tracking per (ip_hash, route) con cleanup opportunistico.
-- - check_rate_limit(): atomic count+insert; service_role only.
-- - reservations.stripe_session_id: link reservation ↔ Stripe session.
-- - reserve_cart(): lock prodotti FOR UPDATE, calcola available = stock - SUM(active reservations),
--   inserisce reservations o ritorna missing[]. Anti-oversell.
-- - link/consume/release_reservations_for_session(): wiring webhook.

-- ── Rate limiting ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id bigserial PRIMARY KEY,
  ip_hash text NOT NULL,
  route text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS api_rate_limits_lookup_idx
  ON public.api_rate_limits(ip_hash, route, created_at DESC);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
-- Nessuna policy: solo service_role accede.

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip_hash text,
  p_route text,
  p_window_seconds int,
  p_max_requests int
) RETURNS boolean
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_count int;
BEGIN
  IF random() < 0.01 THEN
    DELETE FROM public.api_rate_limits
    WHERE created_at < now() - interval '1 hour';
  END IF;

  SELECT count(*) INTO v_count
  FROM public.api_rate_limits
  WHERE ip_hash = p_ip_hash
    AND route = p_route
    AND created_at > now() - make_interval(secs => p_window_seconds);

  IF v_count >= p_max_requests THEN
    RETURN false;
  END IF;

  INSERT INTO public.api_rate_limits(ip_hash, route)
  VALUES (p_ip_hash, p_route);

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.check_rate_limit(text, text, int, int) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, int, int) TO service_role;

-- ── Reservations atomiche ───────────────────────────────────────────────
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

CREATE INDEX IF NOT EXISTS reservations_stripe_session_idx
  ON public.reservations(stripe_session_id) WHERE stripe_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS reservations_active_lookup_idx
  ON public.reservations(product_id, size, status, expires_at)
  WHERE status = 'active';

CREATE OR REPLACE FUNCTION public.reserve_cart(
  p_items jsonb,
  p_ttl_seconds int
) RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_item jsonb;
  v_product_id uuid;
  v_size text;
  v_qty int;
  v_stock int;
  v_reserved int;
  v_available int;
  v_reservation_id uuid;
  v_ids uuid[] := ARRAY[]::uuid[];
  v_missing jsonb := '[]'::jsonb;
  v_expires timestamptz := now() + make_interval(secs => p_ttl_seconds);
BEGIN
  PERFORM 1
  FROM public.products
  WHERE id IN (
    SELECT (elem->>'p')::uuid
    FROM jsonb_array_elements(p_items) AS elem
  )
  ORDER BY id
  FOR UPDATE;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_product_id := (v_item->>'p')::uuid;
    v_size := v_item->>'s';
    v_qty := (v_item->>'q')::int;

    SELECT COALESCE((stock_by_size->>v_size)::int, 0) INTO v_stock
    FROM public.products
    WHERE id = v_product_id;

    SELECT COALESCE(SUM(quantity), 0) INTO v_reserved
    FROM public.reservations
    WHERE product_id = v_product_id
      AND size = v_size
      AND status = 'active'
      AND expires_at > now();

    v_available := COALESCE(v_stock, 0) - COALESCE(v_reserved, 0);

    IF v_available < v_qty THEN
      v_missing := v_missing || jsonb_build_object(
        'p', v_product_id,
        's', v_size,
        'available', v_available,
        'requested', v_qty
      );
    END IF;
  END LOOP;

  IF jsonb_array_length(v_missing) > 0 THEN
    RETURN jsonb_build_object('ok', false, 'missing', v_missing);
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_product_id := (v_item->>'p')::uuid;
    v_size := v_item->>'s';
    v_qty := (v_item->>'q')::int;

    INSERT INTO public.reservations(product_id, size, quantity, status, expires_at)
    VALUES (v_product_id, v_size, v_qty, 'active', v_expires)
    RETURNING id INTO v_reservation_id;

    v_ids := v_ids || v_reservation_id;
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'reservation_ids', to_jsonb(v_ids));
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_cart(jsonb, int) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_cart(jsonb, int) TO service_role;

CREATE OR REPLACE FUNCTION public.link_reservations_to_session(
  p_reservation_ids uuid[],
  p_stripe_session_id text
) RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.reservations
  SET stripe_session_id = p_stripe_session_id
  WHERE id = ANY(p_reservation_ids);
END;
$$;

REVOKE ALL ON FUNCTION public.link_reservations_to_session(uuid[], text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.link_reservations_to_session(uuid[], text) TO service_role;

CREATE OR REPLACE FUNCTION public.consume_reservations_for_session(
  p_stripe_session_id text,
  p_order_id uuid
) RETURNS int
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_count int;
BEGIN
  UPDATE public.reservations
  SET status = 'consumed', order_id = p_order_id
  WHERE stripe_session_id = p_stripe_session_id
    AND status = 'active';
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_reservations_for_session(text, uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_reservations_for_session(text, uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.release_reservations_for_session(
  p_stripe_session_id text
) RETURNS int
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_count int;
BEGIN
  UPDATE public.reservations
  SET status = 'released'
  WHERE stripe_session_id = p_stripe_session_id
    AND status = 'active';
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.release_reservations_for_session(text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.release_reservations_for_session(text) TO service_role;
