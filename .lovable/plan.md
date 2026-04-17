
## Diagnosi: 404 su /admin (e altre route) dal browser

**Causa probabile**: Il file `vercel.json` esiste nel progetto, suggerendo deploy su Vercel. Ma anche su Lovable hosting il fallback SPA dovrebbe funzionare automaticamente. Devo verificare:

1. Il contenuto di `vercel.json` (potrebbe avere rewrites errati)
2. Come è configurato il routing in `App.tsx` (già visto: usa `BrowserRouter` ✅ e ha la route `/admin` ✅)
3. Se ci sono redirect particolari

Lascia verificare `vercel.json` per dare una risposta precisa.
