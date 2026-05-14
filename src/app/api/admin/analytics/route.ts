import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics?days=30
 *
 * Ritorna i KPI aggregati per la dashboard /admin → Analytics.
 * Solo utenti con ruolo `admin` (verificato via user_roles) possono accedere.
 */
export async function GET(request: NextRequest) {
  // 1. Auth check: utente loggato?
  const sbServer = await createSupabaseServerClient();
  const { data: { user } } = await sbServer.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Role check: utente è admin?
  const { data: roleRow } = await sbServer
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!roleRow) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3. Parametro periodo (default 30 giorni, max 365)
  const url = new URL(request.url);
  const daysParam = url.searchParams.get("days");
  const days = Math.max(7, Math.min(365, Number(daysParam) || 30));

  // 4. Chiama RPC con service_role
  const sbAdmin = createSupabaseAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (sbAdmin as any).rpc("admin_analytics_summary", {
    p_days_back: days,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, days });
}
