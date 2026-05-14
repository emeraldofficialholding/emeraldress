import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const BETA_GATE_FLAG = process.env.NEXT_PUBLIC_BETA_GATE === "true";

// Data ufficiale del drop: dopo questo istante il beta-gate si auto-disabilita
// anche se NEXT_PUBLIC_BETA_GATE è ancora "true". Sicurezza per dimenticanza
// di redeploy a ridosso del lancio.
// Anticipato di 2 min (17:58) per dare ai clienti già in attesa sulla coming-soon
// il tempo di refresh prima delle 18:00 ufficiali.
const DROP_AT_MS = new Date("2026-05-14T17:58:00+02:00").getTime();

// Path pubblici accessibili anche con beta-gate attivo.
const PUBLIC_BYPASS = ["/coming-soon", "/login", "/reset-password", "/auth", "/unsubscribe", "/api", "/checkout"];

const PROTECTED_PREFIX = {
  admin: "/admin",
  profilo: "/profilo",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Asset statici e immagini ottimizzate → pass-through.
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") // estensione (.png, .ico, .webp ecc.)
  ) {
    return NextResponse.next();
  }

  const { response, user, isAdmin } = await updateSupabaseSession(request);

  // 1. Gate /admin — richiede ruolo admin.
  if (pathname.startsWith(PROTECTED_PREFIX.admin)) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/profilo";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // 2. Gate /profilo — qualunque utente autenticato.
  if (pathname.startsWith(PROTECTED_PREFIX.profilo)) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // 3. Beta gate — solo admin entra; tutti gli altri → /coming-soon.
  // Auto-disabilita dopo l'istante del drop (failsafe se manca redeploy).
  const betaGateActive = BETA_GATE_FLAG && Date.now() < DROP_AT_MS;
  if (betaGateActive) {
    const isBypass = PUBLIC_BYPASS.some((prefix) => pathname.startsWith(prefix));
    if (!isBypass && !isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/coming-soon";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  // Esclude asset, immagini ottimizzate e Next internals.
  matcher: ["/((?!_next/static|_next/image|favicon).*)"],
};
