ALTER TABLE public.app_settings
ADD COLUMN promo_banner jsonb NOT NULL DEFAULT '{"is_active": false, "text": "", "link": "", "bg_color": "#065f46", "text_color": "#ffffff"}'::jsonb;