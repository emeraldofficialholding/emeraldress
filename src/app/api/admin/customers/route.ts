import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/customers
 *
 * Ritorna lista unificata di:
 * - Utenti registrati (auth.users + profiles join)
 * - Clienti guest (hanno ordini con guest_email/customer_email ma no user_id)
 *
 * Ogni record include aggregati ordini (count + total + last).
 * Ordinato per LTV decrescente.
 */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const sb = createSupabaseAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sbAny = sb as any;

  // 1. Tutti gli auth.users registrati (servizio admin Supabase)
  const { data: authData, error: authError } = await sbAny.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authUsers = (authData?.users ?? []) as any[];

  // 2. Profiles (full_name, phone, ecc.)
  const { data: profiles } = await sbAny.from("profiles").select("*");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileMap = new Map<string, any>(((profiles as any[]) ?? []).map((p) => [p.id, p]));

  // 3. Ordini per email (sia registrati che guest)
  const { data: orders } = await sbAny
    .from("orders")
    .select("id, user_id, customer_email, guest_email, total_amount, created_at, status");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ordersByEmail = new Map<string, any[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((orders as any[]) ?? []).forEach((o) => {
    const email = (o.customer_email ?? o.guest_email ?? "").toLowerCase();
    if (!email) return;
    if (!ordersByEmail.has(email)) ordersByEmail.set(email, []);
    ordersByEmail.get(email)!.push(o);
  });

  // 4. Aggrega per utente registrato
  type CustomerRow = {
    type: "registered" | "guest";
    id: string | null; // user_id se registrato, null se guest
    email: string;
    full_name: string | null;
    phone: string | null;
    created_at: string;
    email_confirmed: boolean;
    last_sign_in_at: string | null;
    newsletter_opt_in: boolean;
    order_count: number;
    total_spent: number;
    last_order_at: string | null;
    is_vip: boolean; // >= 500€
  };

  const out: CustomerRow[] = [];
  const seenEmails = new Set<string>();

  for (const u of authUsers) {
    const email = (u.email ?? "").toLowerCase();
    if (!email) continue;
    seenEmails.add(email);
    const profile = profileMap.get(u.id);
    const userOrders = ordersByEmail.get(email) ?? [];
    const totalSpent = userOrders.reduce((acc, o) => acc + Number(o.total_amount ?? 0), 0);
    const lastOrderAt =
      userOrders.length > 0
        ? userOrders.reduce(
            (latest, o) => (o.created_at > latest ? o.created_at : latest),
            userOrders[0].created_at,
          )
        : null;

    out.push({
      type: "registered",
      id: u.id,
      email,
      full_name:
        profile?.first_name && profile?.last_name
          ? `${profile.first_name} ${profile.last_name}`
          : (u.user_metadata?.full_name ?? null),
      phone: profile?.phone_number ?? null,
      created_at: u.created_at,
      email_confirmed: !!u.email_confirmed_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      newsletter_opt_in: profile?.newsletter_opt_in ?? false,
      order_count: userOrders.length,
      total_spent: Number(totalSpent.toFixed(2)),
      last_order_at: lastOrderAt,
      is_vip: totalSpent >= 500,
    });
  }

  // 5. Aggiungi guest (chi ha ordinato ma non si è mai registrato)
  for (const [email, userOrders] of ordersByEmail.entries()) {
    if (seenEmails.has(email)) continue;
    const totalSpent = userOrders.reduce((acc, o) => acc + Number(o.total_amount ?? 0), 0);
    const lastOrderAt = userOrders.reduce(
      (latest, o) => (o.created_at > latest ? o.created_at : latest),
      userOrders[0].created_at,
    );
    out.push({
      type: "guest",
      id: null,
      email,
      full_name: null,
      phone: null,
      created_at: userOrders.reduce(
        (earliest, o) => (o.created_at < earliest ? o.created_at : earliest),
        userOrders[0].created_at,
      ),
      email_confirmed: false,
      last_sign_in_at: null,
      newsletter_opt_in: false,
      order_count: userOrders.length,
      total_spent: Number(totalSpent.toFixed(2)),
      last_order_at: lastOrderAt,
      is_vip: totalSpent >= 500,
    });
  }

  // Sort: VIP first, poi total_spent desc, poi registered first
  out.sort((a, b) => {
    if (a.is_vip !== b.is_vip) return a.is_vip ? -1 : 1;
    if (b.total_spent !== a.total_spent) return b.total_spent - a.total_spent;
    if (a.type !== b.type) return a.type === "registered" ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return NextResponse.json({
    data: out,
    stats: {
      total: out.length,
      registered: out.filter((c) => c.type === "registered").length,
      guests: out.filter((c) => c.type === "guest").length,
      vip: out.filter((c) => c.is_vip).length,
      with_orders: out.filter((c) => c.order_count > 0).length,
    },
  });
}
