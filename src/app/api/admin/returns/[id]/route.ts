import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createStripeRefund } from "@/lib/stripe-refund";
import {
  brandLayout,
  sendBrandedEmail,
} from "@/lib/notification-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ReturnActionBody {
  action: "approve" | "reject" | "complete";
  admin_notes?: string;
  refund_amount?: number; // EUR — solo per complete, override stimato
}

/**
 * POST /api/admin/returns/[id]
 *
 * Azione admin sul reso:
 *   - approve  → returns.status = 'approved', email cliente con istruzioni
 *   - reject   → returns.status = 'rejected', email cliente motivazione
 *   - complete → Stripe refund idempotente + returns.status = 'refunded'
 *                + INSERT refunds + email cliente conferma rimborso
 *
 * Idempotency-key Stripe: refund_return_<returnId>
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: returnId } = await params;

  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: ReturnActionBody;
  try {
    body = (await request.json()) as ReturnActionBody;
  } catch {
    return NextResponse.json({ error: "Body JSON invalido" }, { status: 400 });
  }
  if (!["approve", "reject", "complete"].includes(body.action)) {
    return NextResponse.json({ error: "Action invalida" }, { status: 400 });
  }

  const sb = createSupabaseAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sbAny = sb as any;

  // Carica reso + ordine
  const { data: ret } = await sbAny
    .from("returns")
    .select(
      `id, order_id, status, estimated_refund, admin_notes,
       orders ( id, order_number, customer_email, customer_name, payment_id, total_amount )`,
    )
    .eq("id", returnId)
    .maybeSingle();
  if (!ret) {
    return NextResponse.json({ error: "Reso non trovato" }, { status: 404 });
  }

  const order = ret.orders;
  if (!order) {
    return NextResponse.json({ error: "Ordine collegato mancante" }, { status: 500 });
  }
  const orderNumStr = order.order_number ?? String(ret.order_id).slice(0, 8);

  // ═══ APPROVE ═════════════════════════════════════════════════════════════
  if (body.action === "approve") {
    if (ret.status !== "requested") {
      return NextResponse.json(
        { error: `Reso in stato ${ret.status}, non approvabile` },
        { status: 409 },
      );
    }
    await sbAny
      .from("returns")
      .update({
        status: "approved",
        admin_notes: body.admin_notes ?? null,
        approved_at: new Date().toISOString(),
      })
      .eq("id", returnId);

    await sbAny.from("orders").update({ return_status: "approved" }).eq("id", ret.order_id);

    if (order.customer_email) {
      const html = brandLayout({
        preheader: `Richiesta reso approvata per ordine ${orderNumStr}`,
        title: "Reso approvato",
        body: `
          <p>Ciao ${escapeHtml(order.customer_name ?? "")},</p>
          <p>La tua richiesta di reso per l'ordine <strong>${escapeHtml(orderNumStr)}</strong> è stata <strong style="color:#059669;">approvata</strong>.</p>
          <p style="background-color:#f0fdf4;padding:16px;border-radius:8px;margin:20px 0;">
            <strong>Prossimi passi:</strong><br>
            1. Riponi i capi nella confezione originale<br>
            2. Spediscili all'indirizzo: <em>Emeraldress, c/o Atelier — riceverai i dettagli via email separata</em><br>
            3. Conserva la ricevuta di spedizione
          </p>
          <p>Riceverai il rimborso entro 5-10 giorni lavorativi dalla ricezione dei capi.</p>
          ${body.admin_notes ? `<p style="color:#6b7280;"><strong>Note:</strong> ${escapeHtml(body.admin_notes)}</p>` : ""}
        `,
      });
      void sendBrandedEmail({
        templateName: "return_approved",
        subject: `Reso approvato · ${orderNumStr}`,
        html,
        recipients: [{ email: order.customer_email, name: order.customer_name ?? "" }],
      });
    }
    return NextResponse.json({ ok: true, status: "approved" });
  }

  // ═══ REJECT ══════════════════════════════════════════════════════════════
  if (body.action === "reject") {
    if (ret.status !== "requested") {
      return NextResponse.json(
        { error: `Reso in stato ${ret.status}, non rifiutabile` },
        { status: 409 },
      );
    }
    await sbAny
      .from("returns")
      .update({
        status: "rejected",
        admin_notes: body.admin_notes ?? null,
      })
      .eq("id", returnId);

    await sbAny.from("orders").update({ return_status: "rejected" }).eq("id", ret.order_id);

    if (order.customer_email) {
      const html = brandLayout({
        title: "Richiesta reso non accolta",
        body: `
          <p>Ciao ${escapeHtml(order.customer_name ?? "")},</p>
          <p>Dopo un'attenta valutazione, la richiesta di reso per l'ordine <strong>${escapeHtml(orderNumStr)}</strong> non è stata accolta.</p>
          ${body.admin_notes ? `<p style="background-color:#fef3c7;padding:16px;border-radius:8px;margin:20px 0;"><strong>Motivazione:</strong> ${escapeHtml(body.admin_notes)}</p>` : ""}
          <p>Per qualsiasi chiarimento, rispondi a questa email o scrivi a <a href="mailto:emeraldresshop@gmail.com" style="color:#059669;">emeraldresshop@gmail.com</a>.</p>
        `,
      });
      void sendBrandedEmail({
        templateName: "return_rejected",
        subject: `Reso non accolto · ${orderNumStr}`,
        html,
        recipients: [{ email: order.customer_email, name: order.customer_name ?? "" }],
      });
    }
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  // ═══ COMPLETE (refund) ════════════════════════════════════════════════════
  if (body.action === "complete") {
    if (ret.status !== "approved") {
      return NextResponse.json(
        { error: `Reso in stato ${ret.status}: completabile solo se approvato` },
        { status: 409 },
      );
    }
    if (!order.payment_id) {
      return NextResponse.json(
        { error: "Payment ID Stripe mancante sull'ordine" },
        { status: 500 },
      );
    }
    const refundAmountEur = Number(
      body.refund_amount ?? ret.estimated_refund ?? 0,
    );
    if (!Number.isFinite(refundAmountEur) || refundAmountEur <= 0) {
      return NextResponse.json(
        { error: "refund_amount invalido" },
        { status: 400 },
      );
    }

    const refund = await createStripeRefund({
      paymentIntentId: order.payment_id,
      amountCents: Math.round(refundAmountEur * 100),
      idempotencyKey: `refund_return_${returnId}`,
      reason: "requested_by_customer",
      metadata: {
        return_id: returnId,
        order_id: ret.order_id,
        order_number: orderNumStr,
      },
    });
    if (!refund.ok) {
      return NextResponse.json(
        { error: `Stripe refund fallito: ${refund.error}` },
        { status: 500 },
      );
    }

    // DB updates
    await sbAny
      .from("returns")
      .update({
        status: "refunded",
        refunded_at: new Date().toISOString(),
        admin_notes: body.admin_notes ?? ret.admin_notes,
      })
      .eq("id", returnId);

    await sbAny.from("refunds").insert({
      order_id: ret.order_id,
      stripe_refund_id: refund.refund_id,
      amount: refund.amount,
      currency: "EUR",
      reason: "customer_return",
      status: "succeeded",
      is_partial: refundAmountEur < Number(order.total_amount),
    });

    await sbAny.from("orders").update({ return_status: "refunded" }).eq("id", ret.order_id);

    if (order.customer_email) {
      const html = brandLayout({
        preheader: `Rimborso emesso di €${(refund.amount ?? 0).toFixed(2)} per ordine ${orderNumStr}`,
        title: "Rimborso emesso",
        body: `
          <p>Ciao ${escapeHtml(order.customer_name ?? "")},</p>
          <p>Abbiamo ricevuto i tuoi capi e processato il rimborso per l'ordine <strong>${escapeHtml(orderNumStr)}</strong>.</p>
          <p style="background-color:#f0fdf4;padding:16px;border-radius:8px;margin:20px 0;font-size:18px;">
            <strong>€${(refund.amount ?? 0).toFixed(2)}</strong> rimborsati
          </p>
          <p>Tempi di riaccredito: 5-10 giorni lavorativi sul metodo di pagamento utilizzato.</p>
          <p style="color:#6b7280;font-size:13px;">Riferimento Stripe: ${escapeHtml(refund.refund_id ?? "")}</p>
        `,
        ctaUrl: "https://www.emeraldress.com/collezioni",
        ctaLabel: "Torna alla collezione",
      });
      void sendBrandedEmail({
        templateName: "return_refunded",
        subject: `Rimborso emesso · €${(refund.amount ?? 0).toFixed(2)}`,
        html,
        recipients: [{ email: order.customer_email, name: order.customer_name ?? "" }],
      });
    }

    return NextResponse.json({
      ok: true,
      status: "refunded",
      refund_id: refund.refund_id,
      refund_amount: refund.amount,
    });
  }

  return NextResponse.json({ error: "Unreachable" }, { status: 500 });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
