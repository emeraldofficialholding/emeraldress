Correggerò il blocco infinito intervenendo sui due punti che possono lasciare la UI in stato `loading` o mandare l’utente in un loop auth.

1. **Allineare il client backend usato dall’app**
   - Sostituire gli import da `@/integrations/supabase/external-client` con il client standard `@/integrations/supabase/client`, come richiesto dalla configurazione del progetto.
   - Questo evita sessioni/ruoli letti da un progetto diverso rispetto a quello atteso dall’app.

2. **Rendere `/admin` anti-loop**
   - In `Admin.tsx`, aggiungere una guardia di montaggio e uno stato di verifica stabile.
   - Separare chiaramente: `loading`, `unauthenticated`, `checking-role`, `not-admin`, `admin`.
   - Dopo login, se l’account è admin, portare subito lo stato a `admin`; se non lo è, mostrare l’avviso senza rientrare nel caricamento infinito.
   - Evitare che eventi auth ripetuti degradino un admin già verificato.

3. **Rendere il Gatekeeper non bloccante**
   - In `GatekeeperRoute.tsx`, mantenere `/admin`, `/login`, `/coming-soon` sempre accessibili senza role-check.
   - Per le pagine protette, se il controllo sessione/ruolo fallisce o scade, redirect pulito a `/coming-soon` invece di restare sul loader.

4. **Verifica mirata**
   - Controllare che `/admin` non resti più sul loader.
   - Controllare che un utente non loggato veda il form di accesso.
   - Controllare che il sito pubblico, se non admin, torni a `/coming-soon` senza caricamento infinito.