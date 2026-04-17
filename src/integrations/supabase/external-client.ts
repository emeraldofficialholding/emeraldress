// EXTERNAL Supabase client — punta al progetto Supabase gestito direttamente
// dall'utente (jtmbnmpggzbucmgglisw), NON al progetto Lovable Cloud.
//
// IMPORTANTE: questo file è gestito a mano. Non viene rigenerato da Lovable.
// Il file `client.ts` qui accanto rimane auto-generato ma NON viene più
// importato da nessuna parte nel codice applicativo.
//
// Se cambi progetto Supabase, aggiorna URL + anon key qui sotto.
// Se lo schema del DB cambia, rigenera i tipi col CLI Supabase:
//   supabase gen types typescript --project-id jtmbnmpggzbucmgglisw > src/integrations/supabase/external-types.ts
// e poi sostituisci l'import `Database` qui sotto con `./external-types`.

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://jtmbnmpggzbucmgglisw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bWJubXBnZ3pidWNtZ2dsaXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NjM3MTAsImV4cCI6MjA4NTQzOTcxMH0.f4pXbQCwJyTOPF27BODKuTGo9grFOhTdXgXwqVl6jQk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
