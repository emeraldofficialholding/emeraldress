import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Service-role Supabase client. BYPASSA le RLS.
 *
 * Importabile SOLO da Route Handlers, Server Actions o codice server-side
 * che richiede privilegi admin (es. cancellare un utente, mutare ordini,
 * inviare email transazionali). Il marker `server-only` fa fallire il build
 * se questo modulo finisce per sbaglio in un Client Component.
 *
 * Non instanziare globalmente: ogni invocazione crea un client nuovo, così
 * non c'è rischio di session leak tra richieste.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error("Supabase admin: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient<Database>(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
