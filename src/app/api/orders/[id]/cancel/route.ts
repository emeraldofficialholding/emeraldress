import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createStripeRefund } from "@/lib/stripe-refund";
import {
  ADMIN_NOTIFICATION_EMAIL,
  brandLayout,
  sendBrandedEmail,
} from "@/lib/notification-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/orders/[id]/cancel
 *
 * Cancellazione ordine da parte del cliente.
 * Eligibility: status IN ('processing','pending') AND created_at > now() - 24h
 * Effetti atomici:
 *   1. Stripe refund (idempotency-key = refund_order_<id>)
 *   2. orders.status = 'cancelled'
 *   3. INSERT refunds row
 *   4. RPC release_reservations_for_session (libera stock)
 *   5. Email cliente + admin
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;

  // ── Auth ─────────────────────────────────────────────────────────────────
  const auth = await requireAuth();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const sb = createSupabaseAdminClient();

  // ── Carica ordine ────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: order, error: orderErr } = await (sb.from("orders") as any)
    .select(
      "id, user_id, customer_email, customer_name, status, total_amount, payment_id, created_at, idempotency_key",
    )
    .eq("id", orderId)
    .maybeSingle();
  if (orderErr || !order) {
    return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
  }

  // ── Authz: solo il proprietario (o admin) può cancellare ─────────────────
  const isOwner =
    order.user_id === auth.user.id ||
    (order.customer_email && auth.user.email === order.customer_email);
  if (!isOwner && auth.role !== "admin") {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
  }

  // ── Eligibility ──────────────────────────────────────────────────────────
  if (order.status === "cancelled") {
    return NextResponse.json(
      { error: "Ordine già cancellato" },
      { status: 409 },
    );
  }
  if (!["processing", "pending"].includes(order.status)) {
    return NextResponse.json(
      {
        error: `Ordine non cancellabile (stato: ${order.status}). Apri una richiesta di reso dopo la consegna.`,
      },
      { status: 409 },
    );
  }
  // Solo entro 24h dalla creazione (configurabile)
  const createdAt = new Date(order.created_at).getTime();
  const hoursElapsed = (Date.now() - createdAt) / 3600_000;
  if (hoursElapsed > 24 && auth.role !== "admin") {
    return NextResponse.json(
      {
        error:
          "Cancellazione disponibile entro 24h dall'ordine. Apri una richiesta di reso dopo la consegna.",
      },
      { status: 409 },
    );
  }

  // ── Stripe refund (idempotente) ──────────────────────────────────────────
  if (!order.payment_id) {
    return NextResponse.json(
      { error: "Payment ID Stripe mancante sull'ordine" },
      { status: 500 },
    );
  }
  const refund = await createStripeRefund({
    paymentIntentId: order.payment_id,
    idempotencyKey: `refund_order_${orderId}`,
    reason: "requested_by_customer",
    metadata: {
      order_id: orderId,
      order_number: (order as { order_number?: string }).order_number ?? "",
    },
  });
  if (!refund.ok) {
    return NextResponse.json(
      { error: `Errore Stripe refund: ${refund.error}` },
      { status: 500 },
    );
  }

  // ── DB updates (best-effort sequence, idempotency su orders.status) ──────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sbAny = sb as any;

  await sbAny
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .eq("status", order.status); // optimistic lock: cancella solo se non l'ha già fatto qualcun altro

  await sbAny.from("refunds").insert({
    order_id: orderId,
    stripe_refund_id: refund.refund_id,
    amount: refund.amount,
    currency: "EUR",
    reason: "customer_cancellation",
    status: "succeeded",
    is_partial: false,
  });

  // Rilascia reservations (per riportare stock)
  if (order.idempotency_key) {
    await sbAny.rpc("release_reservations_for_session", {
      p_stripe_session_id: order.idempotency_key,
    });
  }

  // ── Email cliente + admin ────────────────────────────────────────────────
  const customerEmail = order.customer_email;
  const orderNumberStr =
    (order as { order_number?: string }).order_number ?? orderId.slice(0, 8);

  if (customerEmail) {
    const customerHtml = brandLayout({
      preheader: `Ordine ${orderNumberStr} cancellato e rimborsato`,
      title: "Ordine cancellato",
      body: `
        <p>Ciao ${escapeHtml(order.customer_name ?? "")},</p>
        <p>L'ordine <strong>${escapeHtml(orderNumberStr)}</strong> è stato cancellato come da tua richiesta.</p>
        <p style="background-color:#f0fdf4;padding:16px;border-radius:8px;margin:20px 0;">
          <strong>Rimborso emesso:</strong> €${(refund.amount ?? 0).toFixed(2)}<br>
          Tempi di riaccredito: 5-10 giorni lavorativi sul metodo di pagamento utilizzato.
        </p>
        <p>Ci dispiace di non poterti consegnare questo capo. Resta in contatto: la prossima collezione è in arrivo.</p>
      `,
      ctaUrl: "https://www.emeraldress.com/collezioni",
      ctaLabel: "Esplora la collezione",
    });
    void sendBrandedEmail({
      templateName: "order_cancelled",
      subject: `Cancellazione ordine ${orderNumberStr} confermata`,
      html: customerHtml,
      recipients: [{ email: customerEmail, name: order.customer_name ?? "" }],
    });
  }

  // Email admin
  const adminHtml = brandLayout({
    title: `🟡 Ordine cancellato — ${orderNumberStr}`,
    body: `
      <p><strong>Cliente:</strong> ${escapeHtml(order.customer_name ?? "—")} (${escapeHtml(customerEmail ?? "—")})</p>
      <p><strong>Importo rimborsato:</strong> €${(refund.amount ?? 0).toFixed(2)}</p>
      <p><strong>Refund ID:</strong> ${escapeHtml(refund.refund_id ?? "")}</p>
      <p>Stock rilasciato automaticamente. Nessuna azione richiesta.</p>
    `,
  });
  void sendBrandedEmail({
    templateName: "admin_order_cancelled",
    subject: `🟡 Ordine cancellato: ${orderNumberStr}`,
    html: adminHtml,
    recipients: [{ email: ADMIN_NOTIFICATION_EMAIL }],
  });

  return NextResponse.json({
    ok: true,
    order_id: orderId,
    refund_id: refund.refund_id,
    refund_amount: refund.amount,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
