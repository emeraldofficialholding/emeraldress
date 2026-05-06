
# Piano completamento e-commerce Emeraldress

Obiettivo: chiudere tutti i punti interni Supabase rimasti dal documento `automazioni-emeraldress.md`, allineare il frontend ai 6 workflow n8n già attivi, e creare la pagina `/reset-password`.

---

## STEP 1 — Migrazione SQL unica (database)

Una sola migration che fa tutto quanto serve lato schema/RLS/storage. SQL completo:

```sql
-- ─────────────────────────────────────────────────────────
-- 1. Tabella WISHLISTS (persistente, cross-device)
-- ─────────────────────────────────────────────────────────
CREATE TABLE public.wishlists (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own wishlist"
  ON public.wishlists FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own wishlist"
  ON public.wishlists FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own wishlist"
  ON public.wishlists FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage wishlists"
  ON public.wishlists FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ─────────────────────────────────────────────────────────
-- 2. ORDERS: lettura ordini guest via token email
-- ─────────────────────────────────────────────────────────
-- Politica già esistente: "Users can view their own orders" (auth.uid() = user_id).
-- Aggiungiamo: utente loggato che vede anche ordini effettuati come guest
-- usando la stessa email del proprio account.
CREATE POLICY "Users view own guest orders by email"
  ON public.orders FOR SELECT TO authenticated
  USING (
    guest_email IS NOT NULL
    AND lower(guest_email) = lower((auth.jwt() ->> 'email'))
  );

-- Stesso principio per gli order_items
CREATE POLICY "Users view own guest order items by email"
  ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.guest_email IS NOT NULL
      AND lower(o.guest_email) = lower((auth.jwt() ->> 'email'))
  ));

-- ─────────────────────────────────────────────────────────
-- 3. SCANNER_REQUESTS: link a user_id quando loggato
-- ─────────────────────────────────────────────────────────
-- La colonna user_id esiste già. Sostituiamo le policy aperte con
-- policy granulari + permessi admin.
DROP POLICY IF EXISTS "Anyone can view their scanner requests" ON public.scanner_requests;

CREATE POLICY "Users view own scans"
  ON public.scanner_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public view anonymous scans they just created"
  ON public.scanner_requests FOR SELECT TO anon
  USING (user_id IS NULL);  -- mantiene il flusso ospite scanner

CREATE POLICY "Admins manage scans"
  ON public.scanner_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_scanner_requests_user ON public.scanner_requests(user_id);

-- ─────────────────────────────────────────────────────────
-- 4. REVIEWS: link user_id, recensioni mie + moderazione
-- ─────────────────────────────────────────────────────────
CREATE POLICY "Users view own reviews"
  ON public.reviews FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

-- ─────────────────────────────────────────────────────────
-- 5. STORAGE: avatars dentro bucket emerald-asset
--    Path convenzione: emerald-asset/avatars/{user_id}/<file>
-- ─────────────────────────────────────────────────────────
CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'emerald-asset'
    AND (storage.foldername(name))[1] = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'emerald-asset'
    AND (storage.foldername(name))[1] = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'emerald-asset'
    AND (storage.foldername(name))[1] = 'avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- ─────────────────────────────────────────────────────────
-- 6. CRON pulizia site_analytics > 90 giorni
-- ─────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'cleanup_site_analytics',
  '0 3 * * *',      -- ogni notte alle 03:00
  $$ DELETE FROM public.site_analytics WHERE created_at < now() - interval '90 days' $$
);
```

> Nessun CHECK constraint con `now()`, nessun trigger su schemi riservati, niente DELETE su `auth.users`.

---

## STEP 2 — Pagina `/reset-password`

Creo `src/pages/ResetPassword.tsx` (rotta pubblica, fuori dal Gatekeeper, no Navbar/Footer come `/login`):

- Legge `type=recovery` dall'hash di Supabase, valida sessione di recovery.
- Form con due input: nuova password + conferma.
- Chiama `supabase.auth.updateUser({ password })`.
- Stesso look di `/login`: sfondo `#e4ffec`, particelle shimmer, titolo Playfair, bottone gradient emerald.
- Su successo: toast + redirect a `/login`.
- Helmet `noindex, nofollow`.

In `src/App.tsx`:
- Aggiungo `"/reset-password"` a `STANDALONE_ROUTES`.
- Registro la rotta `<Route path="/reset-password" element={<ResetPassword />} />`.

In `src/pages/Login.tsx`:
- Aggiungo link "Password dimenticata?" sotto il form di sign-in che apre piccolo dialog/expand con email → chiama:
  ```ts
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  ```

---

## STEP 3 — Adattamenti frontend ai 6 WF n8n

Tutto il backend e-commerce (checkout, spedizione, resi, coupon, magazzino, comunicazioni) è già coperto dai workflow n8n. Servono solo piccoli allineamenti UI per consumare correttamente i dati che n8n scrive in Supabase.

### 3.1 `src/pages/Profilo.tsx` — sezione Ordini
- Estendere la SELECT a `tracking_number, tracking_url, return_status, status` (già scritti dai WF 2 e 3).
- Sostituire l'`alert()` su "Richiedi Reso" con call al webhook reso (pannello admin ha già la chiave; per il cliente passiamo da una funzione interna `request-return` che inoltra a n8n) — oppure, per mantenere semplicità, mostrare un form con motivo + selezione articoli che POST a un edge function `request-return` che inoltra all'webhook n8n del Modulo 3.
- Mostrare badge "In transito" con link `tracking_url` quando presente; "Consegnato" con data; "Reso in corso" se `return_status` valorizzato.

### 3.2 `src/pages/Profilo.tsx` — sezione Scansioni & Recensioni
- Filtrare per `user_id = auth.uid()` (oggi era pubblico).
- Al momento dell'inserimento (in `EmeraldScanner.tsx` e `ProductReviews.tsx`) popolare `user_id` con la sessione corrente se loggato.

### 3.3 Wishlist persistente
- Riscrivere `WishlistContext` per:
  - Se utente loggato → leggere/scrivere su tabella `wishlists`.
  - Se non loggato → continuare con localStorage.
  - Al login: merge automatico localStorage → DB (one-shot), poi pulizia localStorage.
- Sezione `/profilo` Wishlist legge da DB.

### 3.4 Avatar upload (Impostazioni)
- Cambia path upload a `avatars/{user_id}/{filename}` nel bucket `emerald-asset` (le nuove policy lo richiedono).

### 3.5 Coupon nel checkout
- Frontend coupon oggi è solo client. Aggiungiamo una piccola edge function `verify-coupon` (POST `{code, subtotal}`) che valida server-side contro la tabella `coupons` (data, usage_limit, used_count, valid_from/until). Restituisce `{valid, discount_type, value, message}`. Il componente checkout usa questa funzione prima di passare il codice a Stripe Payment Link.

### 3.6 Edge function `delete-account` (GDPR)
- Endpoint protetto da JWT utente: usa `service_role` per:
  1. anonimizzare `orders.guest_email` dell'utente (mantenere lo storico contabile);
  2. cancellare `profiles`, `wishlists`, `reviews`, `scanner_requests` dell'utente;
  3. `auth.admin.deleteUser(user.id)`.
- Bottone "Elimina account" in `Profilo → Impostazioni` con `AlertDialog` di conferma.

> Niente altro: i WF n8n già fanno email transazionali, fatture SDI, tracking, resi, restock, alert magazzino, abbandono carrello, richiesta recensione.

---

## STEP 4 — Ordine di esecuzione

1. **SQL Migration** (Step 1) — un'unica migration approvata e applicata.
2. **Pagina `/reset-password`** + link in `/login` (Step 2).
3. **Wishlist persistente** (3.3) — sblocca subito valore utente.
4. **Profilo: ordini con tracking + filtri user_id su scans/reviews** (3.1, 3.2).
5. **Avatar bucket policy + upload path** (3.4).
6. **Edge function `verify-coupon`** (3.5).
7. **Edge function `delete-account`** + UI (3.6).

---

## Dettagli tecnici (per il team)

- **Auth client**: `Profilo.tsx` e `Login.tsx` oggi importano da `@/integrations/supabase/external-client`. La memoria di progetto richiede l'uso esclusivo di `@/integrations/supabase/client`. Da valutare se uniformare in un secondo passaggio (non bloccante per questo piano).
- **Stripe**: nessuna nuova edge function lato Stripe perché il WF n8n del Modulo 1 gestisce già webhook, riconciliazione ordini e rimborsi.
- **Email**: nessuna edge function email, tutte le mail (auth, transazionali, marketing soft) restano gestite dai WF n8n via Gmail OAuth2 — coerente con la richiesta dell'utente.
- **Sicurezza**: tutte le nuove policy usano `auth.uid()` o `has_role()`. Nessuna RLS ricorsiva (le tabelle non si interrogano da sole).
- **Indici**: aggiunti dove utile (wishlists.user_id, scanner_requests.user_id, reviews.user_id+product_id) per evitare regressioni.
- **Cron `pg_cron`**: schedulato pulizia analytics; se l'estensione non è abilitata sul progetto, lo step `CREATE EXTENSION` la attiva.

Pronto a procedere all'implementazione step-by-step appena approvi.
