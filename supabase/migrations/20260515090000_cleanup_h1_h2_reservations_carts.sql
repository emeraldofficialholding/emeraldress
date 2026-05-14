-- Post-drop n8n cleanup fase 1 — bug bloccanti H1 e H2.
--
-- H1: WF5 Inventory chiamava ogni 5 min rpc/expire_old_reservations che non
--     esisteva → errore continuo. Ora creata la RPC che:
--     - marca 'expired' tutte le reservations 'active' con expires_at < now()
--     - hard delete reservations chiuse > 90 giorni (housekeeping)
--     Service_role only.
--
-- H2: WF6 Notifications save-cart chiamava upsert su tabella `carts` che non
--     esisteva → errore continuo. Schema creato per supportare:
--     - cart tracking (session_id UNIQUE, user_id opzionale)
--     - email recovery con tier dedup (last_emailed_tier)
--     - conversion tracking (converted_to_order_id FK orders)

-- ─── H1: expire_old_reservations ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.expire_old_reservations()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_expired_count int;
  v_deleted_old_count int;
BEGIN
  UPDATE public.reservations
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at < now();
  GET DIAGNOSTICS v_expired_count = ROW_COUNT;

  DELETE FROM public.reservations
  WHERE status IN ('expired', 'released', 'consumed')
    AND created_at < now() - interval '90 days';
  GET DIAGNOSTICS v_deleted_old_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'expired_count', v_expired_count,
    'deleted_old_count', v_deleted_old_count,
    'cleaned_at', now()
  );
END;
$$;

REVOKE ALL ON FUNCTION public.expire_old_reservations() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.expire_old_reservations() TO service_role;

-- ─── H2: tabella carts ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email text,
  customer_name text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric(10, 2) DEFAULT 0,
  currency text DEFAULT 'EUR',
  converted_to_order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  last_emailed_tier text,
  last_emailed_at timestamptz,
  user_agent text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS carts_user_id_idx ON public.carts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS carts_customer_email_idx ON public.carts(customer_email) WHERE customer_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS carts_updated_at_idx ON public.carts(updated_at DESC);
CREATE INDEX IF NOT EXISTS carts_not_converted_idx ON public.carts(updated_at DESC)
  WHERE converted_to_order_id IS NULL;

CREATE OR REPLACE FUNCTION public.carts_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS carts_set_updated_at ON public.carts;
CREATE TRIGGER carts_set_updated_at
  BEFORE UPDATE ON public.carts
  FOR EACH ROW
  EXECUTE FUNCTION public.carts_set_updated_at();

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own cart" ON public.carts;
CREATE POLICY "Users can view own cart"
  ON public.carts
  FOR SELECT
  USING (auth.uid() = user_id);
