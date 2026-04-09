CREATE TABLE public.site_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  visitor_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page views"
  ON public.site_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read analytics"
  ON public.site_analytics FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_site_analytics_created_at ON public.site_analytics (created_at DESC);
CREATE INDEX idx_site_analytics_visitor_id ON public.site_analytics (visitor_id);