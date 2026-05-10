## Problema

Su `emeraldress.com/admin` (deploy Vercel) appare il 404 nativo di Vercel, non la SPA. Due cause:

1. In `src/pages/ComingSoon.tsx` (riga 247) il bottone "Admin" punta a `href="/admin"`. Tu vuoi invece che porti a `/login` (chi non ha sessione vede il form, chi è admin viene reindirizzato).
2. Anche digitando direttamente `/admin` o `/login` su Vercel, il fallback SPA non sembra scattare in modo affidabile insieme a `cleanUrls: true` → il browser riceve il 404 di Vercel prima ancora che React Router possa gestire la rotta.

## Cosa farò

### 1. `src/pages/ComingSoon.tsx`
- Cambiare il bottone Admin: da `<a href="/admin">` a `<Link to="/login">` di `react-router-dom` (niente full reload, niente passaggio dal server).
- Etichetta invariata ("Admin" / "Accesso riservato"), solo destinazione.

### 2. `vercel.json`
- Rimuovere `"cleanUrls": true` (non serve a una SPA e può interferire con il rewrite catch-all).
- Sostituire la regex negativa attuale con il rewrite SPA standard:
  ```json
  "rewrites": [
    { "source": "/((?!.*\\.).*)", "destination": "/index.html" }
  ]
  ```
  Così ogni path senza estensione (es. `/admin`, `/login`, `/coming-soon`, `/profilo/abc`) viene servito da `index.html` e gestito da React Router. Asset statici (`.js`, `.css`, `.png`, `.xml`, `.txt`, `.ico`, ecc.) restano serviti normalmente. `sitemap.xml`, `robots.txt`, `sw.js`, `manifest.json`, favicon e `.well-known/*` continuano a funzionare perché hanno estensione.
- Headers e cache invariati.

### 3. Nessuna altra modifica
- `GatekeeperRoute` resta com'è (già con timeout di safety).
- `Login.tsx` già reindirizza l'utente in base al ruolo dopo il login (admin → `/admin`, altri → `/profilo`), quindi il flusso "/coming-soon → bottone Admin → /login → /admin" funzionerà end-to-end.

## Cosa mi serve da te

**Nulla.** Ho tutto quello che mi serve: codice, `vercel.json` e screenshot del 404. Posso procedere appena approvi il piano.

## Verifica post-deploy

Dopo il redeploy su Vercel, controlla:
- `emeraldress.com/coming-soon` → click "Admin" → arrivi su `/login` senza 404.
- `emeraldress.com/login` digitato a mano → si apre il form (no 404).
- `emeraldress.com/admin` digitato a mano da non loggato → React Router carica, GatekeeperRoute ti rimanda a `/coming-soon`.
- `emeraldress.com/sitemap.xml` e `/robots.txt` → continuano a rispondere correttamente.
