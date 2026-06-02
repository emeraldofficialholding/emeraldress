# Workflow n8n Emeraldress

## 📍 Stato attuale (aggiornato 2 giugno 2026)

**Istanza n8n**: `https://n8n.kreareweb.com`  
**Credenziali condivise**: `EMERALDRESS` (Gmail OAuth2 + Supabase API)  
**Tag**: `EMERALD` (workflow attivi), `ARCHIVED` (legacy disattivati).

### Workflow attivi (9)

| # | Workflow | ID | Trigger | Scopo | Chiamato da |
|---|---|---|---|---|---|
| 1 | `EMERALD-Order-Confirmation` | `IE3k1dAi4iHa3Ke2` | webhook `/emerald/order-confirmation` | Email branded conferma ordine al cliente + alert admin | `src/app/api/webhooks/stripe/route.ts` (env `N8N_ORDER_WEBHOOK_URL`) |
| 2 | `EMERALD-Welcome-Email` | `FlPNFOzvccqaZKpu` | webhook `/emerald/welcome-email` | Email benvenuto post-signup | Database trigger `notify_welcome_email` su `auth.users` INSERT |
| 3 | `EMERALD-Review-Pending-Admin` | `d7RTly4XyRbFMcWf` | webhook `/emerald/review-pending-admin` | Alert admin nuova review da moderare | Database trigger `notify_review_pending_admin` su `public.reviews` INSERT |
| 4 | `EMERALD-Review-Approved` | `c3sJmLTEU4p4pf1G` | webhook `/emerald/review-approved` | Email cliente: la tua review è online | Database trigger `notify_review_approved` su `public.reviews` UPDATE (false→true) |
| 5 | `EMERALD-Abandoned-Recovery` | `offIyq9qDdNnyiw6` | webhook `/abandoned-recovery` | Email recovery carrello +1h dopo expired | `src/app/api/webhooks/stripe/route.ts` (env `N8N_ABANDONED_WEBHOOK_URL`) |
| 6 | `EMERALD-Email-Send` | `vog74Yn9758OdYYn` | webhook `/emerald/email-send-…` | Motore email transazionale generico | `src/lib/notification-email.ts` (env `NEXT_PUBLIC_N8N_EMAIL_URL`) |
| 7 | `EMERALD-Inventory` | `e8gYoWvRPto0xVnu` | 3 schedule (5m, 30m, 1h) + webhook `/emerald/stock-check` | Cleanup reservations, cancel pending orders, low stock alert | `admin-client.tsx` (env `NEXT_PUBLIC_N8N_STOCK_URL`) |
| 8 | `EMERALD-Notifications` | `exzcRkWgiy5J94ZH` | schedule cron `0 10 * * *` (Process Review Requests) | Manda "lasciaci una recensione" ai clienti N giorni dopo l'acquisto. Schedule "Abandoned Cart" 15min e webhook `/emerald/save-cart` sono **disabilitati** (sostituiti da Abandoned-Recovery) | nessuno |
| 9 | `EmeralDress Scanner` | `OJCYahdYYzSgfbbu` | webhook `/scanner-requests` | Tool Emerald Scanner (analisi capo) | `emerald-scanner-client.tsx` (env `NEXT_PUBLIC_N8N_SCANNER_URL`) |

### Workflow archiviati (tag `ARCHIVED`, disattivati)

| Workflow | ID | Motivo |
|---|---|---|
| `EMERALD-Checkout` | `RIal48c8gsIigekx` | Sostituito da `/api/checkout` + `/api/webhooks/stripe` lato Next.js |
| `Emerald - Create Order & Payment` | `5OXzp15LgkxfzsXp` | Legacy PayPal |
| `Emerald - Shipping Rates` | `Hdz26somscRgNeBH` | Legacy |
| `Emerald Payment` | `a5FWvNBtC0t6OkLg` | Legacy |
| `Emerald - PayPal Payment Confirmation` | `T8tkSfXslawbvMxx` | Legacy PayPal |

### Database trigger Supabase → n8n

Tre trigger `SECURITY DEFINER` chiamano n8n via `extensions.net.http_post()` (pg_net), best-effort con timeout 2000ms. Payload in **formato standard Supabase Database Webhook** (`{type, table, schema, record, old_record}`):

| Trigger | Tabella | Evento | Funzione | URL n8n |
|---|---|---|---|---|
| `trg_notify_welcome_email` | `auth.users` | AFTER INSERT | `notify_welcome_email()` | `/webhook/emerald/welcome-email` |
| `trg_notify_review_pending_admin` | `public.reviews` | AFTER INSERT | `notify_review_pending_admin()` | `/webhook/emerald/review-pending-admin` |
| `trg_notify_review_approved` | `public.reviews` | AFTER UPDATE OF is_approved | `notify_review_approved()` | `/webhook/emerald/review-approved` |

Migration: [supabase/migrations/20260602001000_n8n_database_webhooks.sql](supabase/migrations/20260602001000_n8n_database_webhooks.sql) + [supabase/migrations/20260602002000_n8n_webhooks_standard_payload.sql](supabase/migrations/20260602002000_n8n_webhooks_standard_payload.sql).

### Env vars Vercel → n8n (mapping)

| Env var (Vercel) | Server/client | Workflow target |
|---|---|---|
| `N8N_ORDER_WEBHOOK_URL` | server | EMERALD-Order-Confirmation |
| `N8N_ABANDONED_WEBHOOK_URL` | server | EMERALD-Abandoned-Recovery |
| `NEXT_PUBLIC_N8N_EMAIL_URL` | client | EMERALD-Email-Send |
| `NEXT_PUBLIC_N8N_SCANNER_URL` | client | EmeralDress Scanner |
| `NEXT_PUBLIC_N8N_NEWSLETTER_URL` | client | (workflow esterno: Newsletter Subscriber Registration) |
| `NEXT_PUBLIC_N8N_STOCK_URL` | client | EMERALD-Inventory (`/emerald/stock-check`) |
| `NEXT_PUBLIC_N8N_RETURN_URL` | client | (workflow esterno) |

---

## 📜 Documentazione storica — pre-migrazione 14 maggio 2026

⚠️ La sezione sotto è il piano operativo originale per il go-live del 14 maggio 2026 con Stripe Payment Link statici. **Non riflette lo stato attuale** (oggi usiamo Stripe Hosted Checkout via API + webhook server-side). Mantenuta come archivio storico.

---

Documento operativo per il go-live del **14 maggio 2026 ore 18:00**.

I 6 moduli n8n esistenti (Checkout, Spedizioni, Resi, Coupon, Magazzino, Comunicazioni) coprono già tutto il flusso e-commerce. Mancano 3 workflow specifici + 3 invii email schedulati per il lancio.

---

## ⚡ IMPORTANTE — Modello pagamento: Stripe Payment Link (modalità ibrida per il lancio)

Per il 14 maggio il sito **continua a usare Stripe Payment Link statici** (i 5 URL `buy.stripe.com/...` già configurati nel campo `products.stripe_payment_link`). NON usiamo `Stripe Checkout Session API` per ora — migrazione post-launch.

### Cosa cambia per il WF1 (Checkout & Pagamenti)

Il sito **NON chiama** `POST /webhook/emerald/create-payment`. Quindi:

- ❌ Il WF1 NON riceve mai un POST iniziale con payload completo dal sito
- ✅ Il WF1 viene triggerato SOLO da Stripe webhook `checkout.session.completed` (e correlati)
- ✅ Tutti i dati cliente/indirizzo/email sono raccolti da Stripe sulla sua pagina checkout, propagati nel webhook payload
- ✅ La **size** del prodotto viene passata dal sito a Stripe via `client_reference_id` (vedi format sotto)
- ✅ Le **reservations pre-pagamento** NON ci sono (impossibile in Payment Link mode). `consume_order_stock` viene chiamato direttamente al webhook `checkout.session.completed`

### Format `client_reference_id` (passato dal sito a Stripe)

Il bottone "Acquista ora" su `/product/[slug]` redirige al Payment Link con:

```
?client_reference_id=pid_{product_id_senza_trattini}__size_{ENCODED}__idem_{12char}
```

Esempio reale:
```
pid_2ca2c97255ec4ed6a11727755ed7d2ab__size_S_M__idem_abc123def456
```

Decodifica nel WF1:
- `pid_` → product_id Supabase (UUID senza trattini, va rincostruito: `2ca2c972-55ec-4ed6-a117-27755ed7d2ab`)
- `size_` → taglia con `/` sostituito da `_`. Decodifica: `XS_S` → `XS/S`, `S_M` → `S/M`, `M_L` → `M/L`
- `idem_` → primi 12 char di UUID generati dal sito (per idempotency dedup lato WF, evita doppio insert se Stripe ripete webhook)

### Logica WF1 in modalità Payment Link

```pseudocode
ON stripe webhook 'checkout.session.completed':
  parse session.client_reference_id → { product_id, size, idempotency_key }
  IF idempotency_key già visto in email_log o orders.metadata → return 200 (dedup)

  customer_email   = session.customer_details.email
  customer_name    = session.customer_details.name
  customer_phone   = session.customer_details.phone
  shipping_address = session.shipping_details.address
  billing_address  = session.customer_details.address
  amount_total     = session.amount_total / 100  -- centesimi → euro
  currency         = session.currency.toUpperCase()
  payment_intent   = session.payment_intent
  coupon_code      = session.metadata.coupon || session.total_details.breakdown.discounts[].discount.coupon.id || null

  -- 1. INSERT orders
  INSERT INTO orders (
    customer_email, customer_name, customer_phone,
    shipping_address, billing_address,
    locale: 'it', currency,
    total_amount: amount_total,
    status: 'paid',
    payment_id: payment_intent,
    payment_method: 'stripe_payment_link',
    coupon_code,
    idempotency_key,
    order_number: generate('EMR-YYYYMMDD-NNNN'),
    metadata: { stripe_session_id: session.id, client_reference_id: raw }
  ) RETURNING id;

  -- 2. INSERT order_items (singolo item per Payment Link)
  product = SELECT name, price, sku FROM products WHERE id = product_id;
  INSERT INTO order_items (
    order_id, product_id, size,
    quantity: 1,
    product_name: product.name,
    sku: product.sku,
    unit_price: product.price,
    selected_size: size,  -- legacy field, idem
    line_subtotal: product.price,
    line_total: product.price,
    price_at_purchase: product.price
  );

  -- 3. INSERT payments
  INSERT INTO payments (
    order_id, stripe_payment_intent_id: payment_intent,
    amount: amount_total, currency,
    payment_status: 'paid',
    payment_method: 'stripe_payment_link'
  );

  -- 4. Consume stock (RPC già pronta, decrementa stock_by_size[size])
  SELECT consume_order_stock(order_id);

  -- 5. Increment coupon usage se presente
  IF coupon_code IS NOT NULL:
    SELECT increment_coupon_usage(coupon_code);
    INSERT INTO coupon_usages (coupon_id: lookup, order_id, customer_email, discount_applied);

  -- 6. Email conferma cliente + alert admin (come Modulo 6)
  send_order_confirmed_email(customer_email, order_id);
  send_admin_alert_email(order_id);
  INSERT INTO email_log ...

  -- 7. Genera fattura SDI Aruba → INSERT invoices
  -- 8. Trigger Modulo 2 (Spedizioni) — passa order_id

  RETURN 200 OK;
```

### Cose che NON funzionano con Payment Link (rinunciamo per ora)

| Feature WF1 originale | Stato Payment Link | Post-launch |
|---|---|---|
| Reservations pre-pagamento (90 min hold stock) | ❌ Non possibile | ✅ con Checkout Session |
| Anti-frode pre-pagamento (mismatch paese carta/spedizione) | ⚠️ Solo via Stripe Radar built-in | ✅ con Checkout Session |
| Anti-duplicato ordine via idempotency_key | ✅ via `client_reference_id` idem suffix | ✅ |
| Multi-valuta dinamica | ⚠️ Solo se configurato sul Dashboard Stripe | ✅ |
| Validazione coupon real-time sul sito | ❌ Solo lato Stripe (Promotion Codes) | ✅ con custom checkout |
| Gift card application | ❌ Non possibile via Payment Link | ✅ |

### Per gestire coupon in Payment Link mode

Sul Stripe Dashboard: ogni Payment Link → "Add custom coupon" → crea **Stripe Promotion Codes**. Il cliente li inserisce sulla pagina Stripe. Quando il webhook arriva, leggi `session.total_details.breakdown.discounts` per estrarre il codice usato + applicare `increment_coupon_usage(code)` sul tuo `coupons` table.

---

---

## ⚙️ Setup comune a TUTTI i workflow

### Credenziali Supabase

Tutti i WF che leggono/scrivono Supabase usano:

| Campo | Valore |
|---|---|
| **REST endpoint** | `https://jtmbnmpggzbucmgglisw.supabase.co/rest/v1/<table>` |
| **Auth admin endpoint** | `https://jtmbnmpggzbucmgglisw.supabase.co/auth/v1/admin/users/<user_id>` |
| **Headers** | `apikey: <SERVICE_ROLE_KEY>`<br>`Authorization: Bearer <SERVICE_ROLE_KEY>`<br>`Content-Type: application/json`<br>`Prefer: return=representation` (su INSERT/UPDATE per ricevere il record indietro) |
| **Service role key** | Supabase Dashboard → Project Settings → API → `service_role` (segna come credenziale n8n riutilizzabile, mai loggarla in console) |

### Credenziali invio email

Configura una credenziale n8n Brevo/Gmail/SMTP riutilizzabile. Mittente: `noreply@emeraldress.com` (o equivalente verified domain).

### Constanti URL

| Variabile | Valore |
|---|---|
| `SITE_URL` | `https://www.emeraldress.com` |
| `UNSUBSCRIBE_URL_TEMPLATE` | `https://www.emeraldress.com/unsubscribe?token={{subscribers.token}}` |
| `ADMIN_EMAIL` | `emeraldofficialholding@gmail.com` |

---

## ① WF Welcome Email — `welcome-email`

🎯 **Scopo**: quando un utente fa signup su `/login`, riceve mail di benvenuto.

### Trigger
**Supabase Auth Hook** "Send Email Hook"
- Configurare su: Supabase Dashboard → Auth → Hooks → Add new hook → tipo `Send Email`
- URL: `https://n8n.kreareweb.com/webhook/welcome-email`
- Method: `POST`
- Genera un secret in Supabase, salvalo come `X-Hook-Secret` header lato n8n per validare l'origine

### Input ricevuto da Supabase
```json
{
  "user": {
    "id": "uuid",
    "email": "nome@example.com",
    "created_at": "2026-05-14T18:05:00Z",
    "user_metadata": { "full_name": "Mario Rossi" }
  },
  "email_data": {
    "email_action_type": "signup",
    "token": "...",
    "redirect_to": "https://www.emeraldress.com/auth/callback",
    "site_url": "https://www.emeraldress.com"
  }
}
```

### Logica
1. **Validare `X-Hook-Secret`** == secret salvato (early return 401 se non match)
2. **Filtrare**: procedi SOLO se `email_data.email_action_type == "signup"` (ignora password recovery, email change, etc. — questi sono già gestiti nativamente da Supabase Auth)
3. Estrai `user.email` e `user.user_metadata.full_name` (può essere `null`)
4. **UPSERT in `subscribers`** (sotto)
5. **Invia mail** di benvenuto (HTML template) al cliente

### Operazioni DB

**UPSERT subscribers** (così il nuovo signup finisce anche nella lista newsletter se non già presente):

```http
POST https://jtmbnmpggzbucmgglisw.supabase.co/rest/v1/subscribers
Headers: apikey, Authorization (service_role), Prefer: resolution=merge-duplicates, return=representation, Content-Type
Body:
{
  "email": "{{ user.email }}",
  "name": "{{ user.user_metadata.full_name || user.email.split('@')[0] }}",
  "phone": "",
  "source": "signup",
  "status": "welcomed",
  "active": true
}
```

### Email da inviare
- **To**: `{{user.email}}`
- **Subject**: `Benvenuta in Emeraldress 🌿`
- **Body**: mantieni stile coerente con i template lancio (palette `#e4ffec`/`#064e3b`, logo esteso, footer con social + `{{unsubscribe_url}}`). Crea un nuovo template in `/admin → Email Templates` chiamato `Welcome Signup` quando avrai tempo, oppure usa template inline.

### Output webhook
- HTTP 200 (body vuoto) — richiesto entro 5s, altrimenti Supabase fa fallire il signup
- Best practice: rispondi 200 SUBITO, poi processa l'invio mail in coda asincrona (nodo Wait + Continue)

---

## ② WF Notifica review approvata → autore — `review-approved`

🎯 **Scopo**: quando l'admin approva una recensione in `/admin → Recensioni`, l'autore riceve mail "la tua recensione è online".

### Trigger
**Supabase Database Webhook** su `public.reviews` UPDATE
- Supabase Dashboard → Database → Webhooks → Create new
- Table: `reviews`
- Events: ☑ **Update**
- URL: `https://n8n.kreareweb.com/webhook/review-approved`
- Method: `POST`

### Input ricevuto
```json
{
  "type": "UPDATE",
  "table": "reviews",
  "schema": "public",
  "record": {
    "id": "uuid",
    "product_id": "uuid",
    "user_id": "uuid_o_null",
    "customer_name": "Mario Rossi",
    "rating": 5,
    "comment": "...",
    "is_approved": true,
    "created_at": "..."
  },
  "old_record": {
    "is_approved": false,
    "...": "..."
  }
}
```

### Logica
1. **Filtro essenziale**: procedi SOLO se `old_record.is_approved === false` AND `record.is_approved === true` (transizione di approvazione, non altri UPDATE)
2. Se `record.user_id == null` (review da guest non loggato), **skip invio** (non hai email)
3. **Recupera profile autore**:
   ```http
   GET https://jtmbnmpggzbucmgglisw.supabase.co/rest/v1/profiles?id=eq.{{record.user_id}}&select=email,first_name
   ```
4. **Recupera prodotto** (per nome + URL):
   ```http
   GET https://jtmbnmpggzbucmgglisw.supabase.co/rest/v1/products?id=eq.{{record.product_id}}&select=name,slug
   ```
5. **Invia mail** all'autore

### Email da inviare
- **To**: `{{profile.email}}`
- **Subject**: `La tua recensione su {{product.name}} è online 🌿`
- **Body**: mantieni stile brand. Includi:
  - Saluto `Ciao {{profile.first_name || "te"}},`
  - "La tua recensione di **{{product.name}}** ({{record.rating}}/5 stelle) è stata pubblicata."
  - Link: `https://www.emeraldress.com/product/{{product.slug}}`
  - Footer con `{{unsubscribe_url}}`

### Operazioni DB
Nessuna scrittura. Solo letture.

### Output
HTTP 200

---

## ③ WF Notifica nuova review pending → admin — `review-pending-admin`

🎯 **Scopo**: quando un utente lascia una recensione su pagina prodotto, l'admin riceve mail per moderare.

### Trigger
**Supabase Database Webhook** su `public.reviews` INSERT
- Database → Webhooks → Create new
- Table: `reviews`
- Events: ☑ **Insert**
- URL: `https://n8n.kreareweb.com/webhook/review-pending-admin`
- Method: `POST`

### Input ricevuto
```json
{
  "type": "INSERT",
  "table": "reviews",
  "record": {
    "id": "uuid",
    "product_id": "uuid",
    "user_id": "uuid_o_null",
    "customer_name": "Mario Rossi",
    "rating": 5,
    "comment": "Capo bellissimo, fitting impeccabile.",
    "is_approved": false,
    "created_at": "..."
  }
}
```

### Logica
1. **Filtro**: procedi solo se `record.is_approved === false` (skip auto-approvate)
2. **Recupera prodotto**:
   ```http
   GET https://jtmbnmpggzbucmgglisw.supabase.co/rest/v1/products?id=eq.{{record.product_id}}&select=name,slug
   ```
3. **Invia mail all'admin**

### Email da inviare
- **To**: `emeraldofficialholding@gmail.com`
- **Subject**: `🆕 Nuova recensione da moderare — {{product.name}}`
- **Body**:
  ```
  Nuova recensione in attesa di approvazione.

  Prodotto: {{product.name}}
  Cliente: {{record.customer_name}}
  Rating: {{record.rating}}/5
  Commento: {{record.comment || "(nessun commento)"}}

  Vai al pannello: https://www.emeraldress.com/admin
  ```

### Operazioni DB
Nessuna scrittura (l'approvazione la fa manualmente l'admin in /admin).

### Output
HTTP 200

---

## 📧 Modulo 6 — Email lancio 14 maggio (già pronte in DB)

Le 3 email per la campagna lancio sono già salvate nella tabella `email_templates`. Il tuo agente n8n deve:

1. **Leggere il template HTML** da DB per ogni invio:
   ```http
   GET https://jtmbnmpggzbucmgglisw.supabase.co/rest/v1/email_templates?name=eq.<NOME>&select=subject,body_html
   ```

2. **Recuperare la lista subscribers attivi**:
   ```http
   GET https://jtmbnmpggzbucmgglisw.supabase.co/rest/v1/subscribers?active=eq.true&select=email,name,token
   ```
   Risultato attuale: **85 subscribers attivi** pronti all'invio.

3. **Per ogni subscriber, sostituire i placeholder nel body_html**:
   - `{{unsubscribe_url}}` → `https://www.emeraldress.com/unsubscribe?token={{subscriber.token}}`
   - (eventuali altri placeholder che vorrai aggiungere ai template lato admin, es. `{{subscriber.name}}`)

4. **Inviare via Brevo/Gmail** con `From: noreply@emeraldress.com`

### Sequenza di invio consigliata

| # | Template `name` | Subject | Quando inviare |
|---|---|---|---|
| 1 | `Lancio 1 — Annuncio accesso anticipato` | Hai accesso anticipato. 14 maggio, ore 18:00. | **Oggi 12/05 oppure 13/05 ore 18:00** — anticipa, dà tempo alle persone di organizzarsi |
| 2 | `Lancio 2 — Tomorrow is the day` | Tomorrow is the day. | **13/05 ore 18:00** (T-24h dal drop) |
| 3 | `Lancio 3 — Priority access is live` | Your priority access is live. | **14/05 ore 18:00 SHARP** (momento esatto dell'apertura) — programmare con cron preciso |

⚠️ **Importante per Email 3**: in n8n usa Schedule Trigger con timezone `Europe/Rome` settato a `0 18 14 5 *` (minuto 0, ora 18, giorno 14, mese 5, qualsiasi giorno della settimana). Verifica che il workflow sia attivo da almeno qualche ora prima.

### Anti-spam
- Rate limit: max 10 email/secondo (limite Brevo standard)
- Log invii nella tabella `subscribers` aggiornando `status` da `welcomed` a `email_1_sent` / `email_2_sent` / `email_3_sent` per evitare doppi invii in caso di re-run

---

## 🔐 Sicurezza & buone pratiche

1. **MAI** loggare il `service_role` key nelle console n8n (usa solo nei nodi credential di n8n).
2. **Verifica `X-Hook-Secret`** in tutti i webhook Supabase Auth Hook (genera un secret random, salvalo in n8n env, confronta in early step).
3. **Idempotenza**: tutti i WF devono essere safe re-eseguibili. Usa UPSERT con `ON CONFLICT` e flag di stato per evitare azioni doppie.
4. **Timeout webhook Supabase Auth Hook = 5s**: rispondi 200 subito, processa async.
5. **`subscribers.token` (UUID)** è auto-generato e univoco per ogni iscritto. **MAI sovrascriverlo** sui record esistenti, altrimenti i link unsubscribe già inviati diventano invalidi.
6. **RLS già configurate** in modo che il `service_role` bypassi tutto, ma le chiamate `anon` siano filtrate. Non serve aggiungere policy.

---

## 📋 Tabella riepilogativa

| # | WF | URL n8n | Trigger | Quando crearlo |
|---|---|---|---|---|
| ① | Welcome email | `/webhook/welcome-email` | Supabase Auth Hook `signup` | Prima del 14/05 (utenti che firmano dopo apertura signup) |
| ② | Review approvata | `/webhook/review-approved` | DB webhook `reviews` UPDATE | Quando avrai tempo (non blocca lancio) |
| ③ | Nuova review admin | `/webhook/review-pending-admin` | DB webhook `reviews` INSERT | Quando avrai tempo |

Più i **3 invii email lancio** sotto Modulo 6 con scheduling.

---

## Test prima del 14 maggio

Per ogni WF, fai un test manuale con la tua email:

1. **Welcome**: signup di prova con un'email tua → verifica mail arrivata + record in `subscribers` con `source='signup'`
2. **Review approved**: inserisci manualmente una review come tuo user, poi approva dal pannello /admin → verifica mail
3. **Review pending admin**: idem, verifica mail all'admin
4. **Email lancio**: invia versione di test SOLO a te stesso (filtra `WHERE email = 'tua.email@...'` nel WF temporaneamente)

Dopo i test, rimuovi il filtro e attiva la schedulazione reale.
