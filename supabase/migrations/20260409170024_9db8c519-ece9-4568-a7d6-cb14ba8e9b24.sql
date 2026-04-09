ALTER TABLE public.app_settings
ADD COLUMN IF NOT EXISTS seo_settings jsonb NOT NULL DEFAULT '{"meta_title":"","meta_description":"","og_image_url":""}'::jsonb;