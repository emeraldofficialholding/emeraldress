# Emeraldress — Guida deploy Vercel kreare-web

Documento operativo per il go-live del nuovo sito Next.js. Ordine:
1. Applicare le 2 migration Supabase pendenti
2. Push del repo su GitHub
3. Import su Vercel kreare-web + env vars
4. Configurare Supabase Auth (redirect URLs + Google OAuth)
5. Configurare Supabase Auth Hook → n8n WF Welcome email
6. DNS cutover emeraldress.com
7. Smoke test post-deploy
8. Spegnere beta-gate per il go-live pubblico

---

## 1. Migrazioni Supabase pendenti

Da applicare in ordine via Supabase Studio (Dashboard → SQL Editor):

**Migration 1 — Slug + images sui 5 prodotti** ([file](supabase/migrations/20260512000000_add_product_slug_and_update_images.sql))

```sql
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text;
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

UPDATE public.products SET slug = 'classy-touch-coord',
  images = ARRAY['https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/Classy-Touch-Coord/Classy-Touch-Coord.webp']
  WHERE id = '5976bc2d-6a99-4779-b477-d0006ca5aa50';
UPDATE public.products SET slug = 'dress-charme-touch',
  images = ARRAY['https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/Dress-Charme-Touch/Dress-Charme-Touch.webp']
  WHERE id = '8040265e-86d3-45e2-af75-ad7f0bce8976';
UPDATE public.products SET slug = 'dress-touch',
  images = ARRAY['https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/Dress-Touch/Dress-Touch.webp']
  WHERE id = '2ca2c972-55ec-4ed6-a117-27755ed7d2ab';
UPDATE public.products SET slug = 'jump-touch',
  images = ARRAY['https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/Jump-Touch/Jump-Touch.webp']
  WHERE id = 'e09b32db-b767-4dac-a76c-2b95c5923062';
UPDATE public.products SET slug = 'white-touch-coord',
  images = ARRAY['https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/White-Touch-Coord/White-Touch-Coord.webp']
  WHERE id = '48a8199d-2681-481c-8b9d-a5ac69ffaf4a';

ALTER TABLE public.products ALTER COLUMN slug SET NOT NULL;
```

**Migration 2 — Colonna newsletter_opt_in su profiles** ([file](supabase/migrations/20260512000001_add_profiles_newsletter_opt_in.sql))

```sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS newsletter_opt_in boolean NOT NULL DEFAULT false;
```

Verifica post-esecuzione: `SELECT id, slug, name FROM products;` deve restituire 5 righe con slug NOT NULL.

---

## 2. Push GitHub

```bash
cd c:/Users/daian/emeraldress-2
# Crea repo nuovo su GitHub (account kreare-web): emeraldress-next
git remote add origin https://github.com/<org>/emeraldress-next.git
git branch -M main
git push -u origin main
```

---

## 3. Vercel kreare-web — Import & env vars

1. Login su Vercel con account **kreare-web** → "Add New" → "Project" → Import GitHub repo `emeraldress-next`
2. Framework preset: **Next.js** (auto-detected)
3. Build & Output Settings: lascia default (`pnpm build`, `.next/`)
4. **Environment Variables** (sezione Production + Preview):

```
NEXT_PUBLIC_SUPABASE_URL=https://jtmbnmpggzbucmgglisw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-da-Supabase-Studio-Settings-API>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-da-Supabase-Studio-Settings-API>

NEXT_PUBLIC_N8N_NEWSLETTER_URL=https://n8n.kreareweb.com/webhook/newsletter-register
NEXT_PUBLIC_N8N_SCANNER_URL=https://n8n.kreareweb.com/webhook/scanner-requests
NEXT_PUBLIC_N8N_RETURN_URL=https://n8n.kreareweb.com/webhook/return-request
NEXT_PUBLIC_N8N_EMAIL_URL=https://n8n.kreareweb.com/webhook/email-send
NEXT_PUBLIC_N8N_SHIPPING_URL=<URL se attivo, altrimenti vuoto>
NEXT_PUBLIC_N8N_STOCK_URL=<URL se attivo, altrimenti vuoto>

# Server-only (NON NEXT_PUBLIC_) — chiamati dai route handler API Next.js
N8N_ORDER_WEBHOOK_URL=https://n8n.kreareweb.com/webhook/emerald/order-confirmation
N8N_ABANDONED_WEBHOOK_URL=https://n8n.kreareweb.com/webhook/abandoned-recovery

NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

NEXT_PUBLIC_BETA_GATE=true       # LASCIARE TRUE finché non si è pronti per il go-live pubblico
NEXT_PUBLIC_SITE_URL=https://www.emeraldress.com
```

**IMPORTANTE:** `SUPABASE_SERVICE_ROLE_KEY` deve essere settata SOLO come server-only (NON come `NEXT_PUBLIC_`). Vercel UI: lascia il checkbox "Available in all environments" attivo ma NON marcare "Expose to browser".

5. Click "Deploy" → primo build dura ~3-5 minuti

---

## 4. Supabase Auth — Redirect URLs + Google OAuth

Supabase Dashboard → **Authentication** → **URL Configuration**:
- Site URL: `https://www.emeraldress.com`
- Additional Redirect URLs (uno per riga):
  ```
  https://www.emeraldress.com/auth/callback
  https://www.emeraldress.com/reset-password
  https://emeraldress-next-*.vercel.app/auth/callback
  https://emeraldress-next-*.vercel.app/reset-password
  http://localhost:3000/auth/callback
  http://localhost:3000/reset-password
  ```

**Google OAuth** (per il pulsante "Accedi con Google" su /login):
- Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client → Edit
- Authorized redirect URIs: aggiungere `https://jtmbnmpggzbucmgglisw.supabase.co/auth/v1/callback`
- Supabase Dashboard → Authentication → Providers → Google → abilitato + Client ID/Secret da Google Cloud

---

## 5. WF Welcome email (Supabase Auth Hook → n8n)

Da configurare lato Supabase + n8n (zero codice lato Next.js).

**Step A — Crea webhook n8n "welcome-email":**
- Workflow n8n con trigger `Webhook` su path `/webhook/welcome-email`
- Input atteso: `{ user_id, email, raw_user_meta_data }`
- Logica: invio email via Gmail/Brevo con template benvenuto (HTML da `src/data/emailTemplates.ts` riferimento)
- Output: 200 OK

**Step B — Supabase Auth Hook:**
- Supabase Dashboard → Authentication → Hooks → "Send Email Hook" (o "Custom Access Token" se serve metadata)
- Tipo: HTTPS
- URL: `https://n8n.kreareweb.com/webhook/welcome-email`
- HTTP method: POST
- Secret: generare uno random in Supabase, salvarlo come header `X-Hook-Secret` nel workflow n8n per verifica

**Test:** crea un utente via /login → signup; deve arrivare email di benvenuto entro pochi secondi.

---

## 6. DNS cutover emeraldress.com

1. **Pre-cutover (24h prima)**: abbassa TTL su record A/CNAME corrente a 300s (5min)
2. Vercel kreare-web → Project Settings → Domains → "Add" → `emeraldress.com` + `www.emeraldress.com` → segui le istruzioni DNS (di solito CNAME `www` → `cname.vercel-dns.com` + A `@` → `76.76.21.21` o ALIAS sul tuo provider)
3. Attendi propagazione (5-30 min)
4. Verifica `curl -I https://www.emeraldress.com` → header `server: Vercel`
5. **Vecchio Vercel (account sbagliato)**: lascia attivo per 48h come fallback. Poi cancella il project.

---

## 7. Smoke test post-deploy

Beta-gate ON, test con utente admin:

- [ ] `https://www.emeraldress.com/login` → form caricato, signup nuovo utente → mail benvenuto ricevuta
- [ ] Login con admin → redirect a `/admin`, pannello caricato (TipTap visibile sezione Email Templates)
- [ ] Login con non-admin → redirect a `/profilo`, 5 tabs (Ordini/Wishlist/Scans/Reviews/Settings)
- [ ] `/coming-soon` → form newsletter funziona (verifica subscriber arrivato in DB)
- [ ] `/product/dress-touch` → pagina prodotto carica, JSON-LD visibile in source, click su "Acquista ora" con taglia → redirect a Stripe Payment Link
- [ ] `/sitemap.xml` → contiene 9 statici + 5 prodotti
- [ ] `/robots.txt` → AI bots allowlist visibile
- [ ] `/emeraldscanner` → upload immagine + form → record in `scanner_requests` + webhook n8n triggerato
- [ ] `/unsubscribe?token=<token-test>` → disiscrizione funziona, subscriber `active=false`
- [ ] RLS smoke: come anon, `curl https://jtmbnmpggzbucmgglisw.supabase.co/rest/v1/profiles?select=*` → 0 righe (RLS blocca)
- [ ] Lighthouse mobile su home → Performance 80+, SEO 95+, Accessibility 90+

---

## 8. Go-live pubblico

Quando tutti i smoke test sono OK:

- Vercel kreare-web → Settings → Environment Variables → `NEXT_PUBLIC_BETA_GATE` → cambia a `false` → Redeploy
- Da quel momento il sito è aperto al pubblico, beta-gate disattivato, visitatori atterrano sulla home (`/`) non più su `/coming-soon`

---

## Tech debt noto (da fixare post-launch)

- **`as any` cast su client Supabase**: known issue di type inference in `@supabase/ssr` con `createBrowserClient<Database>`. Sicurezza preservata da RLS lato server. Tracking: aggiornare ssr quando viene rilasciata fix.
- **Middleware deprecation warning**: Next.js 16 ha rinominato `middleware.ts` → `proxy.ts`. Cambio in 30 secondi quando capita.
- **Edge function `sitemap` su Supabase**: rimpiazzata da `app/sitemap.ts`. Disabilitarla nel Dashboard dopo verifica deploy.
- **Service Worker**: rimosso (Vercel CDN sufficiente). Se l'utente ha la vecchia versione installata, il primo visit deregistrerà il SW vecchio.

## File chiave

- [middleware.ts](src/middleware.ts) — gate `/admin`/`/profilo` + beta-gate via `NEXT_PUBLIC_BETA_GATE`
- [next.config.ts](next.config.ts) — CSP + images.remotePatterns Supabase
- [src/lib/supabase/*.ts](src/lib/supabase/) — server/client/admin/middleware helpers
- [src/types/supabase.ts](src/types/supabase.ts) — types DB rigenerabili via MCP
- [.env.local.example](.env.local.example) — template env vars
