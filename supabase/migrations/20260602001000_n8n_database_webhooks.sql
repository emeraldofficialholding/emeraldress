-- Database Webhooks → n8n EMERALD-* workflow.
-- Triggers che chiamano n8n via extensions.net.http_post() (pg_net asincrono):
--   1) auth.users INSERT      → /webhook/emerald/welcome-email
--   2) public.reviews INSERT  → /webhook/emerald/review-pending-admin
--   3) public.reviews UPDATE  → /webhook/emerald/review-approved (solo quando is_approved passa false→true)
--
-- Gli http_post sono best-effort (timeout 2000ms, errori ignorati) cosi se n8n
-- e' giu' il INSERT/UPDATE principale non viene bloccato.

-- ── 1) Welcome email post-signup ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.notify_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_payload jsonb;
BEGIN
  -- Skip se manca l'email (signup OAuth puo' inviare prima della conferma)
  IF NEW.email IS NULL OR NEW.email = '' THEN
    RETURN NEW;
  END IF;

  v_payload := jsonb_build_object(
    'event', 'user.created',
    'user_id', NEW.id,
    'email', NEW.email,
    'created_at', NEW.created_at,
    'raw_user_meta_data', COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
    'provider', COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  );

  -- Best-effort: errore in n8n NON deve bloccare la creazione utente
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

DROP TRIGGER IF EXISTS trg_notify_welcome_email ON auth.users;
CREATE TRIGGER trg_notify_welcome_email
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_welcome_email();

-- ── 2) Notifica admin nuova review da moderare ───────────────────────────
CREATE OR REPLACE FUNCTION public.notify_review_pending_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_product_name text;
  v_payload jsonb;
BEGIN
  -- Solo per review create con is_approved=false (path standard).
  -- Se l'admin crea una review gia' approvata, skip.
  IF NEW.is_approved = true THEN
    RETURN NEW;
  END IF;

  SELECT name INTO v_product_name FROM public.products WHERE id = NEW.product_id;

  v_payload := jsonb_build_object(
    'event', 'review.pending',
    'review_id', NEW.id,
    'product_id', NEW.product_id,
    'product_name', COALESCE(v_product_name, 'Prodotto'),
    'customer_name', NEW.customer_name,
    'rating', NEW.rating,
    'comment', NEW.comment,
    'photo_urls', COALESCE(NEW.photo_urls, '{}'::text[]),
    'has_photos', COALESCE(array_length(NEW.photo_urls, 1), 0) > 0,
    'created_at', NEW.created_at,
    'admin_url', 'https://www.emeraldress.com/admin'
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

DROP TRIGGER IF EXISTS trg_notify_review_pending_admin ON public.reviews;
CREATE TRIGGER trg_notify_review_pending_admin
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_review_pending_admin();

-- ── 3) Notifica cliente quando review viene approvata ────────────────────
CREATE OR REPLACE FUNCTION public.notify_review_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_customer_email text;
  v_product_name text;
  v_product_slug text;
  v_payload jsonb;
BEGIN
  -- Solo quando passa false → true
  IF NOT (OLD.is_approved = false AND NEW.is_approved = true) THEN
    RETURN NEW;
  END IF;

  -- Lookup email cliente (la review non la salva direttamente)
  IF NEW.user_id IS NOT NULL THEN
    SELECT email INTO v_customer_email FROM auth.users WHERE id = NEW.user_id;
  END IF;

  -- Skip se non abbiamo email (review anonima da admin)
  IF v_customer_email IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT name, slug INTO v_product_name, v_product_slug FROM public.products WHERE id = NEW.product_id;

  v_payload := jsonb_build_object(
    'event', 'review.approved',
    'review_id', NEW.id,
    'product_id', NEW.product_id,
    'product_name', COALESCE(v_product_name, 'il tuo capo'),
    'product_url', 'https://www.emeraldress.com/product/' || COALESCE(v_product_slug, NEW.product_id::text),
    'customer_email', v_customer_email,
    'customer_name', NEW.customer_name,
    'rating', NEW.rating,
    'comment', NEW.comment,
    'photo_urls', COALESCE(NEW.photo_urls, '{}'::text[]),
    'created_at', NEW.created_at
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

DROP TRIGGER IF EXISTS trg_notify_review_approved ON public.reviews;
CREATE TRIGGER trg_notify_review_approved
  AFTER UPDATE OF is_approved ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_review_approved();
