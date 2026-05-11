import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Supabase client per Server Components, Server Actions e Route Handlers.
 * Legge/scrive cookie di sessione via `next/headers`. RLS è applicata
 * automaticamente in base al JWT contenuto nel cookie utente.
 *
 * NON usare per operazioni privilegiate (bypass RLS) → usa `@/lib/supabase/admin`.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chiamato da un Server Component: ignorato (il middleware refresha già la sessione).
          }
        },
      },
    },
  );
}
