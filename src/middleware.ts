import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const BETA_GATE_ENABLED = process.env.NEXT_PUBLIC_BETA_GATE === "true";

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
  if (BETA_GATE_ENABLED) {
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
