-- PostgREST non sempre castava il parametro jsonb correttamente quando
-- supabase-js inviava un array JS nativo. Cambiamo la signature a `text`
-- e facciamo il cast a jsonb internamente. Il chiamante invia JSON.stringify().

DROP FUNCTION IF EXISTS public.reserve_cart(jsonb, int);

CREATE OR REPLACE FUNCTION public.reserve_cart(
  p_items text,
  p_ttl_seconds int
) RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_items jsonb := p_items::jsonb;
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
    FROM jsonb_array_elements(v_items) AS elem
  )
  ORDER BY id
  FOR UPDATE;

  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items) LOOP
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

  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items) LOOP
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

REVOKE ALL ON FUNCTION public.reserve_cart(text, int) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_cart(text, int) TO service_role;
