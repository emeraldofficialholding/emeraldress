

L'utente ha un suo progetto Supabase (`jtmbnmpggzbucmgglisw`) e vuole spostare tutto lì, abbandonando Lovable Cloud (`qqamymdreqzxjfouaixk`).

**Realtà tecnica importante:**

1. **Lovable Cloud non si può "eliminare"** dal progetto: una volta abilitato resta. Quello che possiamo fare è **smettere di usarlo** e far puntare l'app al Supabase dell'utente.

2. **Problema critico col file `client.ts`**: è auto-generato e punta a `VITE_SUPABASE_URL` dal `.env`, anch'esso auto-gestito da Lovable Cloud. Non possiamo modificarli direttamente — ogni rigenerazione li sovrascriverebbe puntando di nuovo a `qqamymdreqzxjfouaixk`.

3. **Soluzione tecnica**: creare un client Supabase **alternativo** (`src/integrations/supabase/external-client.ts`) che punti hardcoded al progetto dell'utente, e sostituire tutti gli import in tutto il codebase.

**Cosa serve dall'utente prima di poter fare qualsiasi cosa:**

- L'**anon key** del suo Supabase `jtmbnmpggzbucmgglisw` (la vedo nel `.env` come `VITE_SUPABASE_ANON_KEY`, ma è la vecchia configurazione precedente all'attivazione di Lovable Cloud — devo verificare che sia ancora valida)
- Conferma che lo schema DB nel suo progetto sia **identico** (tabelle: `app_settings`, `email_templates`, `orders`, `products`, `profiles`, `reviews`, `scanner_requests`, `site_analytics`, `subscribers`, `user_roles`, enum `app_role`, funzioni `has_role`, `handle_new_user`)
- Conferma che abbia replicato: storage buckets (`scanner_uploads`, `product-images`, `emerald-asset`), RLS policies, edge functions (se ce ne sono), secrets, auth providers (Google OAuth)
- Vuole davvero **abbandonare i dati attuali** su Lovable Cloud o vuole prima migrarli?

## Piano proposto

### Fase 1 — Verifica e migrazione dati (PRIMA di switchare)
1. Esportare schema + dati da Lovable Cloud (`qqamymdreqzxjfouaixk`)
2. Importarli nel progetto utente (`jtmbnmpggzbucmgglisw`)
3. Replicare: storage buckets + file, RLS, functions, triggers, auth providers, secrets edge functions

⚠️ Questa fase la deve fare **manualmente l'utente** dalla dashboard Supabase — io non ho accesso al suo progetto esterno.

### Fase 2 — Switch del client (lato codice, posso fare io)
1. Creare `src/integrations/supabase/external-client.ts` con URL e anon key hardcoded del progetto utente
2. Creare `src/integrations/supabase/external-types.ts` con i tipi del progetto utente (l'utente li scarica con `supabase gen types`)
3. **Sostituire tutti gli import** `@/integrations/supabase/client` → `@/integrations/supabase/external-client` in ~20+ file (Login, Profilo, Admin, EmeraldScanner, GatekeeperRoute, Index, useProducts, hook tracking, contexts, ecc.)
4. Lasciare il file auto-generato `client.ts` intatto (non possiamo cancellarlo, ma diventa inutilizzato)

### Fase 3 — Conseguenze
- ❌ Le tool Lovable Cloud (`supabase--*`, migration tool, secrets, edge function deploy automatico) **smetteranno di funzionare** sul progetto utente: non ho permessi sul suo Supabase. Tutte le future modifiche DB/edge functions le dovrai fare tu dalla sua dashboard.
- ❌ Lovable AI Gateway (`LOVABLE_API_KEY`) non funziona dalle edge functions del suo progetto — dovrà usare le proprie API keys (OpenAI/Anthropic ecc.)
- ❌ `src/integrations/supabase/types.ts` continuerà a riflettere il DB di Lovable Cloud (non quello dell'utente) — dovrai mantenere a mano `external-types.ts`
- ✅ L'app funzionerà sul tuo Supabase

## Domande critiche prima di procedere

