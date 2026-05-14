-- RPC aggregati per dashboard /admin → Analytics.
-- Ritorna un oggetto JSONB con KPIs + daily trend + top pages + funnel in 1 sola chiamata.
-- Esecuzione SECURITY DEFINER per leggere tabelle con RLS; chiamabile solo da service_role.

CREATE OR REPLACE FUNCTION public.admin_analytics_summary(
  p_days_back int DEFAULT 30
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := now();
  v_today timestamptz := date_trunc('day', v_now);
  v_7d timestamptz := v_now - interval '7 days';
  v_30d timestamptz := v_now - interval '30 days';
  v_period_start timestamptz := v_now - (p_days_back || ' days')::interval;
BEGIN
  RETURN jsonb_build_object(
    'visits_today', (SELECT count(*) FROM site_analytics WHERE created_at >= v_today),
    'visits_7d', (SELECT count(*) FROM site_analytics WHERE created_at >= v_7d),
    'visits_30d', (SELECT count(*) FROM site_analytics WHERE created_at >= v_30d),
    'visits_total', (SELECT count(*) FROM site_analytics),

    'unique_visitors_today', (SELECT count(DISTINCT visitor_id) FROM site_analytics WHERE created_at >= v_today),
    'unique_visitors_7d', (SELECT count(DISTINCT visitor_id) FROM site_analytics WHERE created_at >= v_7d),
    'unique_visitors_30d', (SELECT count(DISTINCT visitor_id) FROM site_analytics WHERE created_at >= v_30d),
    'unique_visitors_total', (SELECT count(DISTINCT visitor_id) FROM site_analytics),

    'orders_today', (SELECT count(*) FROM orders WHERE created_at >= v_today),
    'orders_7d', (SELECT count(*) FROM orders WHERE created_at >= v_7d),
    'orders_30d', (SELECT count(*) FROM orders WHERE created_at >= v_30d),
    'orders_total', (SELECT count(*) FROM orders),

    'revenue_today', (SELECT COALESCE(sum(total_amount), 0) FROM orders WHERE created_at >= v_today),
    'revenue_7d', (SELECT COALESCE(sum(total_amount), 0) FROM orders WHERE created_at >= v_7d),
    'revenue_30d', (SELECT COALESCE(sum(total_amount), 0) FROM orders WHERE created_at >= v_30d),
    'revenue_total', (SELECT COALESCE(sum(total_amount), 0) FROM orders),

    'daily_trend', COALESCE((
      SELECT jsonb_agg(d ORDER BY (d->>'date')::date)
      FROM (
        SELECT jsonb_build_object(
          'date', to_char(day, 'YYYY-MM-DD'),
          'visits', COALESCE(v.visits, 0),
          'unique_visitors', COALESCE(v.uniq, 0),
          'orders', COALESCE(o.orders, 0),
          'revenue', COALESCE(o.revenue, 0)::float
        ) AS d
        FROM generate_series(v_period_start::date, v_now::date, '1 day'::interval) AS day
        LEFT JOIN LATERAL (
          SELECT count(*) AS visits, count(DISTINCT visitor_id) AS uniq
          FROM site_analytics
          WHERE date_trunc('day', created_at) = day
        ) v ON true
        LEFT JOIN LATERAL (
          SELECT count(*) AS orders, COALESCE(sum(total_amount), 0) AS revenue
          FROM orders
          WHERE date_trunc('day', created_at) = day
        ) o ON true
      ) t
    ), '[]'::jsonb),

    'top_pages', COALESCE((
      SELECT jsonb_agg(p ORDER BY (p->>'views')::int DESC)
      FROM (
        SELECT jsonb_build_object(
          'page_path', page_path,
          'views', count(*)::int,
          'unique_visitors', count(DISTINCT visitor_id)::int
        ) AS p
        FROM site_analytics
        WHERE created_at >= v_30d AND page_path IS NOT NULL
        GROUP BY page_path
        ORDER BY count(*) DESC
        LIMIT 10
      ) t
    ), '[]'::jsonb),

    'funnel', jsonb_build_object(
      'total_visits', (SELECT count(*) FROM site_analytics WHERE created_at >= v_30d),
      'unique_visitors', (SELECT count(DISTINCT visitor_id) FROM site_analytics WHERE created_at >= v_30d),
      'pdp_visits', (SELECT count(*) FROM site_analytics WHERE created_at >= v_30d AND page_path LIKE '/product/%'),
      'collection_visits', (SELECT count(*) FROM site_analytics WHERE created_at >= v_30d AND page_path = '/collezioni'),
      'checkout_attempts', (SELECT count(*) FROM reservations WHERE created_at >= v_30d),
      'orders_completed', (SELECT count(*) FROM orders WHERE created_at >= v_30d)
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_analytics_summary(int) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_analytics_summary(int) TO service_role;
