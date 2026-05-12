import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Anon Supabase client SENZA cookies — sicuro per Server Components con `revalidate`.
 * Da usare SOLO per letture pubbliche (es. listing prodotti, sitemap): essendo
 * un client anon, le RLS si applicano normalmente come per un visitatore non
 * autenticato.
 *
 * Non opt-in a dynamic rendering (vs. `createSupabaseServerClient` che chiama
 * `cookies()`), quindi compatibile con ISR/SSG.
 */
export function createSupabasePublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
