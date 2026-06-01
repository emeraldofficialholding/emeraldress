-- Sistema recupero carrelli abbandonati su Stripe.
-- Quando una checkout.session.expired arriva al webhook, salviamo una riga qui
-- con i dati customer + line items. Un nodo n8n schedulato +1h legge le righe
-- 'pending' e invia email di recupero, marcando 'sent'.

CREATE TABLE IF NOT EXISTS public.abandoned_checkouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text NOT NULL UNIQUE,
  email text,
  phone text,
  customer_name text,
  -- Items snapshot: [{product_id, name, slug, image, size, quantity, unit_price}]
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  amount_total integer,            -- in centesimi (come Stripe)
  currency text DEFAULT 'eur',
  locale text,
  expired_at timestamptz NOT NULL DEFAULT now(),
  -- Token opaco per il link di recupero (?recover=<token>).
  recovery_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  -- Stato pipeline email
  email_status text NOT NULL DEFAULT 'pending'
    CHECK (email_status IN ('pending', 'sent', 'skipped', 'failed', 'converted')),
  email_sent_at timestamptz,
  email_attempts integer NOT NULL DEFAULT 0,
  -- Conversion tracking: se l'utente torna e completa, popoliamo questo
  converted_to_order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  converted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS abandoned_checkouts_status_idx
  ON public.abandoned_checkouts(email_status, expired_at DESC)
  WHERE email_status = 'pending';

CREATE INDEX IF NOT EXISTS abandoned_checkouts_token_idx
  ON public.abandoned_checkouts(recovery_token);

CREATE INDEX IF NOT EXISTS abandoned_checkouts_email_idx
  ON public.abandoned_checkouts(email)
  WHERE email IS NOT NULL;

ALTER TABLE public.abandoned_checkouts ENABLE ROW LEVEL SECURITY;

-- Nessuna policy: service_role only (webhook + n8n).
-- Admin legge via service_role nei route handler API.

CREATE OR REPLACE FUNCTION public.touch_abandoned_checkouts_updated_at()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_abandoned_checkouts_touch ON public.abandoned_checkouts;
CREATE TRIGGER trg_abandoned_checkouts_touch
  BEFORE UPDATE ON public.abandoned_checkouts
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_abandoned_checkouts_updated_at();

-- RPC: marca un abbandono come convertito quando arriva un order con lo stesso
-- stripe_session_id. Chiamato dal webhook in handleCheckoutCompleted.
CREATE OR REPLACE FUNCTION public.mark_abandoned_converted(
  p_stripe_session_id text,
  p_order_id uuid
) RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.abandoned_checkouts
  SET email_status = 'converted',
      converted_to_order_id = p_order_id,
      converted_at = now()
  WHERE stripe_session_id = p_stripe_session_id
    AND email_status IN ('pending', 'sent');
$$;

REVOKE ALL ON FUNCTION public.mark_abandoned_converted(text, uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_abandoned_converted(text, uuid) TO service_role;

-- RPC: legge gli abbandoni 'pending' più vecchi di N minuti, da chiamare dal
-- node n8n Schedule. Restituisce subito le righe e contestualmente le marca
-- come 'sent' (atomico per evitare doppi invii). max_rows safety bound.
CREATE OR REPLACE FUNCTION public.claim_pending_abandoned(
  p_min_age_minutes int DEFAULT 60,
  p_max_rows int DEFAULT 50
) RETURNS SETOF public.abandoned_checkouts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH picked AS (
    SELECT id
    FROM public.abandoned_checkouts
    WHERE email_status = 'pending'
      AND email IS NOT NULL
      AND expired_at < now() - make_interval(mins => p_min_age_minutes)
    ORDER BY expired_at ASC
    LIMIT p_max_rows
    FOR UPDATE SKIP LOCKED
  )
  UPDATE public.abandoned_checkouts ac
  SET email_status = 'sent',
      email_sent_at = now(),
      email_attempts = email_attempts + 1
  FROM picked
  WHERE ac.id = picked.id
  RETURNING ac.*;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_pending_abandoned(int, int) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_pending_abandoned(int, int) TO service_role;
