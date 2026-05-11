-- Fase 5: aggiunge colonna slug ai prodotti esistenti + aggiorna images con i nuovi
-- URL dal bucket `products` (5 capi finali Emerald Touch).
--
-- I 5 prodotti esistono già con UUID stabili — questo NON è un DELETE/INSERT.
-- Subscribers, orders, wishlists, reviews vengono lasciati intatti.

BEGIN;

-- 1. Aggiungi colonna slug (se non esiste già)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text;
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- 2. UPDATE slug + immagini sui 5 prodotti esistenti
UPDATE public.products
SET
  slug = 'classy-touch-coord',
  images = ARRAY['https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/Classy-Touch-Coord/Classy-Touch-Coord.webp']
WHERE id = '5976bc2d-6a99-4779-b477-d0006ca5aa50';

UPDATE public.products
SET
  slug = 'dress-charme-touch',
  images = ARRAY['https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/Dress-Charme-Touch/Dress-Charme-Touch.webp']
WHERE id = '8040265e-86d3-45e2-af75-ad7f0bce8976';

UPDATE public.products
SET
  slug = 'dress-touch',
  images = ARRAY['https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/Dress-Touch/Dress-Touch.webp']
WHERE id = '2ca2c972-55ec-4ed6-a117-27755ed7d2ab';

UPDATE public.products
SET
  slug = 'jump-touch',
  images = ARRAY['https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/Jump-Touch/Jump-Touch.webp']
WHERE id = 'e09b32db-b767-4dac-a76c-2b95c5923062';

UPDATE public.products
SET
  slug = 'white-touch-coord',
  images = ARRAY['https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/White-Touch-Coord/White-Touch-Coord.webp']
WHERE id = '48a8199d-2681-481c-8b9d-a5ac69ffaf4a';

-- 3. Verifica: tutti i 5 prodotti devono avere slug NOT NULL
DO $$
DECLARE
  null_slugs int;
BEGIN
  SELECT COUNT(*) INTO null_slugs FROM public.products WHERE slug IS NULL;
  IF null_slugs > 0 THEN
    RAISE NOTICE 'Attenzione: % prodotti senza slug (esistono righe extra non mappate)', null_slugs;
  END IF;
END$$;

-- 4. Rendi slug NOT NULL solo se tutti i 5 sono OK
-- (Se ci sono prodotti extra senza slug, questa istruzione fallirà — manualmente assegna slug)
-- ALTER TABLE public.products ALTER COLUMN slug SET NOT NULL;

COMMIT;
