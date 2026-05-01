
-- ============================================
-- 1. APP_SETTINGS: maintenance_mode
-- ============================================
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS maintenance_mode boolean NOT NULL DEFAULT false;

-- ============================================
-- 2. COLLECTIONS (nuova)
-- ============================================
CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collections are viewable by everyone"
  ON public.collections FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage collections"
  ON public.collections FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 3. PRODUCTS: nuove colonne
-- ============================================
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_new_arrival boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_by uuid,
  ADD COLUMN IF NOT EXISTS collection_id uuid REFERENCES public.collections(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_collection_id ON public.products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- ============================================
-- 4. ORDERS: RESET COMPLETO
-- ============================================
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  guest_email text,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  shipping_address jsonb,
  legacy_stripe_session_id text,
  payment_method text,
  payment_id text,
  causale text,
  metadata jsonb DEFAULT '{}'::jsonb,
  shippo_shipment_id text,
  shippo_rate_id text,
  shippo_label_url text,
  tracking_number text,
  tracking_url text,
  return_status text,
  return_label_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage orders"
  ON public.orders FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- ============================================
-- 5. ORDER_ITEMS (nuova)
-- ============================================
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  selected_size text NOT NULL,
  price_at_purchase numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage order items"
  ON public.order_items FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- ============================================
-- 6. PROFILES: rinomina phone, aggiungi email
-- ============================================
ALTER TABLE public.profiles RENAME COLUMN phone TO phone_number;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- ============================================
-- 7. REVIEWS: aggiungi user_id
-- ============================================
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS user_id uuid;
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);

-- ============================================
-- 8. SCANNER_REQUESTS: diagnosis_result -> jsonb, aggiungi user_id
-- ============================================
ALTER TABLE public.scanner_requests ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE public.scanner_requests
  ALTER COLUMN diagnosis_result TYPE jsonb
  USING CASE
    WHEN diagnosis_result IS NULL THEN NULL
    WHEN diagnosis_result::text ~ '^\s*[\{\[]' THEN diagnosis_result::jsonb
    ELSE jsonb_build_object('text', diagnosis_result)
  END;

-- ============================================
-- 9. SITE_ANALYTICS: event_type, visitor_id -> uuid
-- ============================================
ALTER TABLE public.site_analytics
  ADD COLUMN IF NOT EXISTS event_type text DEFAULT 'pageview';

ALTER TABLE public.site_analytics
  ALTER COLUMN visitor_id TYPE uuid
  USING CASE
    WHEN visitor_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      THEN visitor_id::uuid
    ELSE gen_random_uuid()
  END;

ALTER TABLE public.site_analytics
  ALTER COLUMN visitor_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_site_analytics_created_at ON public.site_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_analytics_event_type ON public.site_analytics(event_type);

-- ============================================
-- 10. SUBSCRIBERS: status, token, unique email
-- ============================================
ALTER TABLE public.subscribers
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'subscribed',
  ADD COLUMN IF NOT EXISTS token uuid NOT NULL DEFAULT gen_random_uuid();

-- Dedup email prima di mettere unique
DELETE FROM public.subscribers a USING public.subscribers b
  WHERE a.ctid < b.ctid AND lower(a.email) = lower(b.email);

ALTER TABLE public.subscribers
  ADD CONSTRAINT subscribers_email_key UNIQUE (email);

ALTER TABLE public.subscribers
  ADD CONSTRAINT subscribers_token_key UNIQUE (token);

-- ============================================
-- 11. MATERIAL_SCORE_CACHE (nuova)
-- ============================================
CREATE TABLE IF NOT EXISTS public.material_score_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_key text NOT NULL UNIQUE,
  original_material text NOT NULL,
  sustainability_score integer NOT NULL,
  diagnosis_result text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.material_score_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read material score cache"
  ON public.material_score_cache FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage material score cache"
  ON public.material_score_cache FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_material_score_cache_key ON public.material_score_cache(material_key);
