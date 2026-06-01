-- Foto-recensioni: aggiungiamo possibilità per i clienti di allegare fino a 3
-- foto alla propria recensione (es. capo indossato). Le foto vivono nel bucket
-- pubblico `review-photos` con cartella per user_id; le URL sono salvate nella
-- colonna `photo_urls` (text[]) della tabella reviews.

-- 1) Colonna photo_urls su reviews (max 3 foto)
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS photo_urls text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_photo_urls_max_3;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_photo_urls_max_3
  CHECK (array_length(photo_urls, 1) IS NULL OR array_length(photo_urls, 1) <= 3);

-- 2) Bucket Storage `review-photos` (pubblico in lettura).
--    file_size_limit: 5 MB; mime: solo image/*.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3) RLS policies su storage.objects per bucket review-photos.
--    Convenzione path: `{user_id}/{review_id}-{n}.webp`
--    - SELECT: pubblico (immagini visibili a tutti)
--    - INSERT: solo utente loggato e solo nella propria cartella
--    - DELETE: solo l'autore (cleanup) o service_role/admin
--    - UPDATE: non permesso a end-user
DROP POLICY IF EXISTS "review-photos public read" ON storage.objects;
CREATE POLICY "review-photos public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'review-photos');

DROP POLICY IF EXISTS "review-photos auth insert own" ON storage.objects;
CREATE POLICY "review-photos auth insert own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'review-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "review-photos auth delete own" ON storage.objects;
CREATE POLICY "review-photos auth delete own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'review-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4) Cleanup automatico: quando una review viene cancellata, eliminiamo anche
--    le foto dal bucket per evitare orphan files.
CREATE OR REPLACE FUNCTION public.cleanup_review_photos()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  v_url text;
  v_path text;
BEGIN
  IF OLD.photo_urls IS NULL OR array_length(OLD.photo_urls, 1) IS NULL THEN
    RETURN OLD;
  END IF;
  FOREACH v_url IN ARRAY OLD.photo_urls LOOP
    -- estrai il path dopo /review-photos/
    v_path := regexp_replace(v_url, '^.*/review-photos/', '');
    IF v_path != v_url AND v_path != '' THEN
      DELETE FROM storage.objects
      WHERE bucket_id = 'review-photos' AND name = v_path;
    END IF;
  END LOOP;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_cleanup_review_photos ON public.reviews;
CREATE TRIGGER trg_cleanup_review_photos
  BEFORE DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_review_photos();
