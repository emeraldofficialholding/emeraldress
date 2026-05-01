-- Rinomina tabella per allinearsi al codice frontend
ALTER TABLE public.discount_codes RENAME TO coupons;

-- Rinomina colonne per allinearle al codice esistente in Admin.tsx
ALTER TABLE public.coupons RENAME COLUMN discount_value TO value;
ALTER TABLE public.coupons RENAME COLUMN max_uses TO usage_limit;
ALTER TABLE public.coupons RENAME COLUMN uses_count TO used_count;

-- Rinomina indici e policy/trigger di conseguenza
ALTER INDEX idx_discount_codes_code RENAME TO idx_coupons_code;
ALTER INDEX idx_discount_codes_active RENAME TO idx_coupons_active;

-- Drop vecchia policy e ricrea con nuovo nome
DROP POLICY IF EXISTS "Admins can manage discount codes" ON public.coupons;
CREATE POLICY "Admins can manage coupons"
ON public.coupons
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Rinomina trigger
ALTER TRIGGER update_discount_codes_updated_at ON public.coupons RENAME TO update_coupons_updated_at;