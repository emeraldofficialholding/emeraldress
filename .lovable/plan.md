# Fix accesso Admin: "Account non autorizzato" + caricamento infinito

## Diagnosi

Dai log e dal network risulta che l'utente **è effettivamente admin** (la query `user_roles?role=eq.admin` ritorna `[{role:"admin"}]` con status 200). Il problema è quindi nel client, non nei dati.

Cause:

1. **`Promise.race` con timeout 4s troppo aggressivo** in `Admin.tsx` (`checkAdmin` linee 264–279 e `useEffect` linee 281–314). Quando la query `user_roles` impiega anche solo qualche istante in più (es. al primo caricamento del client Supabase, refresh token, throttling browser), la fallback resolve con `{data: null}` → l'app forza `setAuthState("not-admin")` mostrando il banner "Account non autorizzato".

2. **`onAuthStateChange` viene chiamato più volte** (`INITIAL_SESSION`, `SIGNED_IN`, `TOKEN_REFRESHED`, ecc.). Ogni evento ri-chiama `checkAdmin`. Se anche solo uno di questi hit la timeout-fallback, lo stato `admin` già impostato viene **retrocesso** a `not-admin` e parte il flash + loop visivo.

3. **GatekeeperRoute mostra lo stesso pattern** (timeout 4s su `getSession` e `user_roles`) — log: `gatekeeper:user_roles:timeout`. Stesso problema su altre pagine.

4. Dopo il login, il form rimane montato e mostra il warning rosso "non autorizzato" anche durante il riconoscimento del ruolo.

## Cosa cambiare

### 1) `src/pages/Admin.tsx` — auth flow robusto

- Rimuovere il `Promise.race(... 4s → {data:null})` dentro `checkAdmin`. Lasciare la query semplice con `await` e gestire `error` con un `console.warn`. **Non** retrocedere mai da `admin` a `not-admin` per un errore di rete: in caso di errore mantenere lo stato attuale (o `loading` se non ancora deciso).
- In `useEffect`, rimuovere la `Promise.race` su `getSession` e il `safety setTimeout` di 6s che forza `unauthenticated`. Sostituire con: `await supabase.auth.getSession()` semplice + `try/catch`.
- In `onAuthStateChange`:
  - Ignorare gli eventi `TOKEN_REFRESHED` e `USER_UPDATED` (non ri-controllare il ruolo: mantenere lo stato corrente).
  - Su `SIGNED_OUT` → `unauthenticated`.
  - Su `SIGNED_IN` / `INITIAL_SESSION` con sessione → `checkAdmin` (con setTimeout 0 per evitare deadlock SDK).
- Aggiungere un guard: se `authState === "admin"`, non degradare mai a `not-admin` salvo logout esplicito.
- Nel render del form di login, mostrare il banner "Account non autorizzato" **solo** se `authState === "not-admin"` AND non c'è una verifica in corso (già il caso, ma assicurarsi che dopo il submit del login si torni a `loading` finché non arriva la risposta del ruolo).

### 2) `src/components/GatekeeperRoute.tsx` — stessa logica

- Aumentare `GATE_TIMEOUT_MS` da 4000 a 10000 ms (margine reale per reti lente / cold start del client Supabase).
- Mantenere l'unico safety timer (rete morta), ma allinearlo a 12s e loggare chiaramente.
- Su errore della query `user_roles`: se l'utente ha sessione, **non** bloccare automaticamente; preferire `blocked` solo dopo il safety timer (oggi sostanzialmente già così, basta alzare i timeout).

### 3) Nessuna modifica a DB / RLS / config

Le policy `user_roles` e la funzione `has_role` sono già corrette. La query funziona, è solo il timeout client a essere troppo stretto.

## Risultato atteso

- Aprendo `/admin` da `/coming-soon`: login → auth listener → `checkAdmin` → `admin` stabile, dashboard caricata. Nessun flash di "Account non autorizzato".
- Nessuna regressione su altre rotte: il Gatekeeper continua a redirigere i non-admin a `/coming-soon`, solo con tempi più realistici.

## File toccati

- `src/pages/Admin.tsx` (solo blocco auth, ~50 righe)
- `src/components/GatekeeperRoute.tsx` (timeout values + lieve hardening)
