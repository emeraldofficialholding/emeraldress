import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth callback per Supabase Auth (Google e altri provider).
 * Riceve `?code=...&next=/profilo` dal provider, scambia il code in sessione
 * via PKCE → setta i cookie httpOnly → redirige in base al ruolo utente.
 *
 * Configurare in Supabase Dashboard → Auth → URL Configuration:
 *   - Site URL: https://www.emeraldress.com
 *   - Redirect URLs: https://www.emeraldress.com/auth/callback,
 *                    https://*.vercel.app/auth/callback,
 *                    http://localhost:3000/auth/callback
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  // Sessione creata: determina il redirect finale in base al ruolo.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`);
  }

  if (nextParam && nextParam.startsWith("/")) {
    return NextResponse.redirect(`${origin}${nextParam}`);
  }

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  return NextResponse.redirect(`${origin}${roleRow ? "/admin" : "/profilo"}`);
}
