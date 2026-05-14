import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/returns
 *
 * Lista resi per admin con join order/customer per UI gestionale.
 * Filtro opzionale via ?status=requested|approved|rejected|refunded.
 */
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  const sb = createSupabaseAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q = (sb as any).from("returns").select(
    `
      id, order_id, status, reason, customer_notes, admin_notes,
      estimated_refund, requested_at, approved_at, refunded_at,
      orders ( id, order_number, customer_email, customer_name, total_amount, payment_id ),
      return_items (
        id, order_item_id, product_id, quantity, reason, refund_amount,
        order_items ( product_name, size, unit_price )
      )
    `,
  );
  if (status) q = q.eq("status", status);
  q = q.order("requested_at", { ascending: false });

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}
