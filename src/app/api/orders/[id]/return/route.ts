import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  ADMIN_NOTIFICATION_EMAIL,
  brandLayout,
  sendBrandedEmail,
} from "@/lib/notification-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ReturnItemInput {
  order_item_id: string;
  quantity: number;
  reason?: string;
}

interface ReturnRequestBody {
  customer_notes?: string;
  items?: ReturnItemInput[]; // empty/omitted = full return (tutte le righe dell'ordine)
}

/**
 * POST /api/orders/[id]/return
 *
 * Richiesta reso da parte del cliente.
 * Eligibility: status='delivered' AND delivered_at > now() - 30 giorni AND no reso esistente.
 *
 * Effetti:
 *   1. INSERT returns con status='requested'
 *   2. INSERT return_items (quelli passati nel body, o tutti se omessi)
 *   3. UPDATE orders.return_status = 'requested'
 *   4. Email cliente "Richiesta ricevuta" + email admin "Nuova richiesta reso"
 *
 * NOTA: nessun refund automatico qui. L'admin deve approvare + completare
 * il reso, che triggera il rimborso Stripe via /api/admin/returns/[id]/complete.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;

  const auth = await requireAuth();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: ReturnRequestBody = {};
  try {
    body = (await request.json()) as ReturnRequestBody;
  } catch {
    // body opzionale, ok vuoto
  }

  const sb = createSupabaseAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sbAny = sb as any;

  // ── Carica ordine + items + eventuali resi esistenti ─────────────────────
  const { data: order } = await sbAny
    .from("orders")
    .select(
      "id, user_id, customer_email, customer_name, status, total_amount, delivered_at, return_status, order_number",
    )
    .eq("id", orderId)
    .maybeSingle();
  if (!order) {
    return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
  }

  const isOwner =
    order.user_id === auth.user.id ||
    (order.customer_email && auth.user.email === order.customer_email);
  if (!isOwner && auth.role !== "admin") {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
  }

  // ── Eligibility ──────────────────────────────────────────────────────────
  if (order.status !== "delivered") {
    return NextResponse.json(
      { error: "Reso disponibile solo dopo la consegna." },
      { status: 409 },
    );
  }
  if (order.return_status && order.return_status !== "rejected") {
    return NextResponse.json(
      { error: `Reso già in stato: ${order.return_status}` },
      { status: 409 },
    );
  }
  if (!order.delivered_at) {
    return NextResponse.json(
      { error: "Data di consegna mancante. Contatta il supporto." },
      { status: 409 },
    );
  }
  const daysSinceDelivery =
    (Date.now() - new Date(order.delivered_at).getTime()) / 86_400_000;
  if (daysSinceDelivery > 30) {
    return NextResponse.json(
      {
        error: "Il termine per il reso è 30 giorni dalla consegna.",
      },
      { status: 409 },
    );
  }

  // ── Carica order_items per validare quelli passati (o prenderli tutti) ───
  const { data: orderItems } = await sbAny
    .from("order_items")
    .select("id, product_id, quantity, selected_size, size, line_total, unit_price, product_name")
    .eq("order_id", orderId);

  if (!orderItems || orderItems.length === 0) {
    return NextResponse.json(
      { error: "Ordine senza articoli, impossibile generare reso" },
      { status: 500 },
    );
  }

  // Items da restituire: usa quelli del body se passati, altrimenti tutti
  type OrderItemRow = {
    id: string;
    product_id: string;
    quantity: number;
    selected_size: string;
    size: string;
    line_total: number;
    unit_price: number;
    product_name: string;
  };
  const items: OrderItemRow[] = orderItems as OrderItemRow[];

  type ReturnItemRow = {
    order_item_id: string;
    product_id: string;
    quantity: number;
    reason: string | null;
    refund_amount: number;
  };

  const itemsToReturn: ReturnItemRow[] =
    body.items && body.items.length > 0
      ? body.items
          .map((ri) => {
            const oi = items.find((it) => it.id === ri.order_item_id);
            if (!oi) return null;
            const qty = Math.min(Math.max(1, Math.floor(ri.quantity)), oi.quantity);
            return {
              order_item_id: oi.id,
              product_id: oi.product_id,
              quantity: qty,
              reason: ri.reason ?? null,
              refund_amount: Number(oi.unit_price) * qty,
            };
          })
          .filter((x): x is ReturnItemRow => x !== null)
      : items.map((oi) => ({
          order_item_id: oi.id,
          product_id: oi.product_id,
          quantity: oi.quantity,
          reason: null,
          refund_amount: Number(oi.line_total ?? oi.unit_price * oi.quantity),
        }));

  if (itemsToReturn.length === 0) {
    return NextResponse.json(
      { error: "Nessun articolo valido da restituire" },
      { status: 400 },
    );
  }

  const estimatedRefund = itemsToReturn.reduce(
    (acc, ri) => acc + Number(ri.refund_amount),
    0,
  );

  // ── INSERT return + return_items ─────────────────────────────────────────
  const { data: insertedReturn, error: insertErr } = await sbAny
    .from("returns")
    .insert({
      order_id: orderId,
      status: "requested",
      reason: body.customer_notes ?? null,
      customer_notes: body.customer_notes ?? null,
      estimated_refund: estimatedRefund,
      requested_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertErr || !insertedReturn) {
    return NextResponse.json(
      { error: insertErr?.message ?? "Errore creazione reso" },
      { status: 500 },
    );
  }
  const returnId = insertedReturn.id as string;

  await sbAny.from("return_items").insert(
    itemsToReturn.map((ri) => ({
      return_id: returnId,
      order_item_id: ri.order_item_id,
      product_id: ri.product_id,
      quantity: ri.quantity,
      reason: ri.reason,
      refund_amount: ri.refund_amount,
    })),
  );

  await sbAny
    .from("orders")
    .update({ return_status: "requested" })
    .eq("id", orderId);

  // ── Email cliente + admin ────────────────────────────────────────────────
  const orderNumStr = order.order_number ?? orderId.slice(0, 8);

  if (order.customer_email) {
    const customerHtml = brandLayout({
      preheader: `Richiesta reso ricevuta per ordine ${orderNumStr}`,
      title: "Richiesta di reso ricevuta",
      body: `
        <p>Ciao ${escapeHtml(order.customer_name ?? "")},</p>
        <p>Abbiamo ricevuto la tua richiesta di reso per l'ordine <strong>${escapeHtml(orderNumStr)}</strong>.</p>
        <p style="background-color:#f0fdf4;padding:16px;border-radius:8px;margin:20px 0;">
          <strong>Articoli:</strong> ${itemsToReturn.reduce((a, i) => a + i.quantity, 0)}<br>
          <strong>Rimborso stimato:</strong> €${estimatedRefund.toFixed(2)}
        </p>
        <p>Il nostro team la esaminerà entro 24h e ti invierà istruzioni dettagliate per la spedizione di reso.</p>
        <p style="color:#6b7280;font-size:13px;">Hai cambiato idea? Rispondi a questa email per annullare la richiesta.</p>
      `,
    });
    void sendBrandedEmail({
      templateName: "return_requested_customer",
      subject: `Richiesta reso ricevuta · ${orderNumStr}`,
      html: customerHtml,
      recipients: [
        { email: order.customer_email, name: order.customer_name ?? "" },
      ],
    });
  }

  const adminHtml = brandLayout({
    title: `🟠 Nuova richiesta reso — ${orderNumStr}`,
    body: `
      <p><strong>Cliente:</strong> ${escapeHtml(order.customer_name ?? "—")} (${escapeHtml(order.customer_email ?? "—")})</p>
      <p><strong>Articoli da rendere:</strong> ${itemsToReturn.reduce((a, i) => a + i.quantity, 0)}</p>
      <p><strong>Rimborso stimato:</strong> €${estimatedRefund.toFixed(2)}</p>
      ${body.customer_notes ? `<p><strong>Note cliente:</strong> ${escapeHtml(body.customer_notes)}</p>` : ""}
      <p style="margin-top:20px;">
        <a href="https://www.emeraldress.com/admin#returns" style="color:#059669;">→ Apri in admin per approvare/rifiutare</a>
      </p>
    `,
  });
  void sendBrandedEmail({
    templateName: "admin_return_requested",
    subject: `🟠 Reso da approvare: ${orderNumStr}`,
    html: adminHtml,
    recipients: [{ email: ADMIN_NOTIFICATION_EMAIL }],
  });

  return NextResponse.json({
    ok: true,
    return_id: returnId,
    order_id: orderId,
    estimated_refund: estimatedRefund,
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
