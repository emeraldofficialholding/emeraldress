
CREATE TABLE public.app_settings (
  id integer PRIMARY KEY DEFAULT 1,
  page_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  page_images jsonb NOT NULL DEFAULT '{}'::jsonb,
  branding jsonb NOT NULL DEFAULT '{"primary_color":"#004d40","secondary_color":"#a7f3d0","accent_color":"#065f46"}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Ensure only one row
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage app_settings"
  ON public.app_settings
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Anyone can read settings (needed for public pages)
CREATE POLICY "Anyone can read app_settings"
  ON public.app_settings
  FOR SELECT
  TO public
  USING (true);

-- Insert default row
INSERT INTO public.app_settings (id) VALUES (1);

-- Create storage bucket for site assets if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('emerald-asset', 'emerald-asset', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for emerald-asset bucket
CREATE POLICY "Public read emerald-asset"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'emerald-asset');

-- Admins can upload to emerald-asset
CREATE POLICY "Admins upload emerald-asset"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'emerald-asset' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update emerald-asset
CREATE POLICY "Admins update emerald-asset"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'emerald-asset' AND public.has_role(auth.uid(), 'admin'));
