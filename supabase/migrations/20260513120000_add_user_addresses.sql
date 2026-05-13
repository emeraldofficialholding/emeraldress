-- Indirizzi salvati per utente (shipping/billing).
-- Relazione 1:N rispetto a auth.users, RLS per isolare per owner.
-- Trigger garantisce che esista un solo `is_default = true` per utente.

CREATE TABLE IF NOT EXISTS public.user_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  line1 text NOT NULL,
  line2 text,
  city text NOT NULL,
  postal_code text NOT NULL,
  state text,
  country text NOT NULL DEFAULT 'IT',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_addresses_user_id_idx
  ON public.user_addresses(user_id);

-- Garantisce al massimo un default per utente.
CREATE UNIQUE INDEX IF NOT EXISTS user_addresses_one_default_per_user
  ON public.user_addresses(user_id)
  WHERE is_default = true;

-- Trigger per aggiornare updated_at.
CREATE OR REPLACE FUNCTION public.user_addresses_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_addresses_set_updated_at ON public.user_addresses;
CREATE TRIGGER user_addresses_set_updated_at
  BEFORE UPDATE ON public.user_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.user_addresses_set_updated_at();

-- Quando si imposta un nuovo default, sbianca gli altri default dello stesso utente.
CREATE OR REPLACE FUNCTION public.user_addresses_enforce_single_default()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE public.user_addresses
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id <> NEW.id
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_addresses_enforce_single_default ON public.user_addresses;
CREATE TRIGGER user_addresses_enforce_single_default
  BEFORE INSERT OR UPDATE OF is_default ON public.user_addresses
  FOR EACH ROW
  WHEN (NEW.is_default = true)
  EXECUTE FUNCTION public.user_addresses_enforce_single_default();

-- RLS: ogni utente vede e modifica solo i propri indirizzi.
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own addresses" ON public.user_addresses;
CREATE POLICY "Users can view own addresses"
  ON public.user_addresses
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own addresses" ON public.user_addresses;
CREATE POLICY "Users can insert own addresses"
  ON public.user_addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own addresses" ON public.user_addresses;
CREATE POLICY "Users can update own addresses"
  ON public.user_addresses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own addresses" ON public.user_addresses;
CREATE POLICY "Users can delete own addresses"
  ON public.user_addresses
  FOR DELETE
  USING (auth.uid() = user_id);
