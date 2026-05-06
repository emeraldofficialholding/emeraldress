-- 1. WISHLISTS
CREATE TABLE public.wishlists (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own wishlist"
  ON public.wishlists FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users insert own wishlist"
  ON public.wishlists FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own wishlist"
  ON public.wishlists FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins manage wishlists"
  ON public.wishlists FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. ORDERS guest-by-email
CREATE POLICY "Users view own guest orders by email"
  ON public.orders FOR SELECT TO authenticated
  USING (
    guest_email IS NOT NULL
    AND lower(guest_email) = lower((auth.jwt() ->> 'email'))
  );
CREATE POLICY "Users view own guest order items by email"
  ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.guest_email IS NOT NULL
      AND lower(o.guest_email) = lower((auth.jwt() ->> 'email'))
  ));

-- 3. SCANNER_REQUESTS
DROP POLICY IF EXISTS "Anyone can view their scanner requests" ON public.scanner_requests;
CREATE POLICY "Users view own scans"
  ON public.scanner_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Public view anonymous scans"
  ON public.scanner_requests FOR SELECT TO anon
  USING (user_id IS NULL);
CREATE POLICY "Admins manage scans"
  ON public.scanner_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX IF NOT EXISTS idx_scanner_requests_user ON public.scanner_requests(user_id);

-- 4. REVIEWS
CREATE POLICY "Users view own reviews"
  ON public.reviews FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

-- 5. STORAGE avatars policies (bucket emerald-asset)
CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'emerald-asset'
    AND (storage.foldername(name))[1] = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );
CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'emerald-asset'
    AND (storage.foldername(name))[1] = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );
CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'emerald-asset'
    AND (storage.foldername(name))[1] = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- 6. CRON pulizia analytics
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule(
  'cleanup_site_analytics',
  '0 3 * * *',
  $$ DELETE FROM public.site_analytics WHERE created_at < now() - interval '90 days' $$
);