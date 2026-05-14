import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthCheckResult =
  | { ok: true; user: { id: string; email: string | null }; role: "admin" | "user" }
  | { ok: false; status: 401 | 403; error: string };

/**
 * Verifica che il caller dell'API sia autenticato.
 * Ritorna user + ruolo, oppure errore con status code da rispondere.
 *
 * Uso in API route:
 *   const auth = await requireAuth();
 *   if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
 *   // qui auth.user e auth.role sono garantiti
 */
export async function requireAuth(): Promise<AuthCheckResult> {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, error: "Non autenticato" };
  }

  const { data: roleRow } = await sb
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  return {
    ok: true,
    user: { id: user.id, email: user.email ?? null },
    role: roleRow ? "admin" : "user",
  };
}

/**
 * Variante stretta: richiede ruolo admin. Altrimenti 401/403.
 */
export async function requireAdmin(): Promise<AuthCheckResult> {
  const auth = await requireAuth();
  if (!auth.ok) return auth;
  if (auth.role !== "admin") {
    return { ok: false, status: 403, error: "Solo admin" };
  }
  return auth;
}
