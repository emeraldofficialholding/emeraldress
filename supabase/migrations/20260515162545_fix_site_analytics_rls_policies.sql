-- Bug noto: INSERT su site_analytics da anon falliva con
-- "permission denied for function has_role".
-- Causa: la vecchia policy SELECT "Solo admin legge analytics" usava
-- EXISTS (SELECT FROM user_roles WHERE ...). user_roles ha RLS che chiama
-- has_role(), function SECURITY DEFINER non grantata ad anon → check chain
-- ricorsivo falliva. Risultato: dal 12 maggio nessuna visita registrata.
--
-- Fix:
-- 1. SELECT policy ristretta a `authenticated` (non più `public`), così anon
--    non scatena alcuna evaluation della policy.
-- 2. Usa direttamente has_role() come predicate invece di EXISTS subquery
--    (più rapido + no RLS chain ricorsiva su user_roles).
-- 3. INSERT policy semplificata: page_path NOT NULL + length check.

DROP POLICY IF EXISTS "Anyone can insert page views" ON public.site_analytics;
DROP POLICY IF EXISTS "Solo admin legge analytics" ON public.site_analytics;

CREATE POLICY "anyone_can_insert_pageviews"
  ON public.site_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    page_path IS NOT NULL
    AND char_length(page_path) BETWEEN 1 AND 500
  );

CREATE POLICY "only_admin_reads_analytics"
  ON public.site_analytics
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
