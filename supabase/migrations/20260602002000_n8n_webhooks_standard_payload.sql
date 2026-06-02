-- Aggiorna le 3 funzioni notify_* per emettere payload in formato standard
-- "Supabase Database Webhook" cosi sono compatibili coi workflow n8n esistenti
-- che gia' leggono body.record / body.old_record (EMERALD-Review-Pending-Admin,
-- EMERALD-Review-Approved).

CREATE OR REPLACE FUNCTION public.notify_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_payload jsonb;
BEGIN
  IF NEW.email IS NULL OR NEW.email = '' THEN
    RETURN NEW;
  END IF;
  v_payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'users',
    'schema', 'auth',
    'record', jsonb_build_object(
      'id', NEW.id,
      'email', NEW.email,
      'created_at', NEW.created_at,
      'raw_user_meta_data', COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      'raw_app_meta_data', COALESCE(NEW.raw_app_meta_data, '{}'::jsonb)
    ),
    'old_record', NULL
  );
  BEGIN
    PERFORM extensions.net.http_post(
      url := 'https://n8n.kreareweb.com/webhook/emerald/welcome-email',
      body := v_payload,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      timeout_milliseconds := 2000
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_welcome_email http_post failed: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_review_pending_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_payload jsonb;
BEGIN
  IF NEW.is_approved = true THEN
    RETURN NEW;
  END IF;
  v_payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'reviews',
    'schema', 'public',
    'record', to_jsonb(NEW),
    'old_record', NULL
  );
  BEGIN
    PERFORM extensions.net.http_post(
      url := 'https://n8n.kreareweb.com/webhook/emerald/review-pending-admin',
      body := v_payload,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      timeout_milliseconds := 2000
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_review_pending_admin http_post failed: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_review_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_payload jsonb;
BEGIN
  IF NOT (OLD.is_approved = false AND NEW.is_approved = true) THEN
    RETURN NEW;
  END IF;
  v_payload := jsonb_build_object(
    'type', 'UPDATE',
    'table', 'reviews',
    'schema', 'public',
    'record', to_jsonb(NEW),
    'old_record', to_jsonb(OLD)
  );
  BEGIN
    PERFORM extensions.net.http_post(
      url := 'https://n8n.kreareweb.com/webhook/emerald/review-approved',
      body := v_payload,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      timeout_milliseconds := 2000
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_review_approved http_post failed: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$;
