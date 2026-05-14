import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  brandLayout,
  sendBrandedEmail,
} from "@/lib/notification-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ShippingActionBody {
  action: "update_tracking" | "mark_delivered";
  tracking_number?: string;
  tracking_url?: string;
  carrier?: string;
  notes?: string;
}

/**
 * POST /api/admin/orders/[id]/shipping
 *
 * Admin shipping operations:
 *   - update_tracking → set tracking_number + tracking_url, status=shipped, email cliente
 *   - mark_delivered  → set delivered_at, status=delivered, email cliente
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;

  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: ShippingActionBody;
  try {
    body = (await request.json()) as ShippingActionBody;
  } catch {
    return NextResponse.json({ error: "Body JSON invalido" }, { status: 400 });
  }
  if (!["update_tracking", "mark_delivered"].includes(body.action)) {
    return NextResponse.json({ error: "Action invalida" }, { status: 400 });
  }

  const sb = createSupabaseAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sbAny = sb as any;

  const { data: order } = await sbAny
    .from("orders")
    .select("id, order_number, customer_email, customer_name, status, tracking_number")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) {
    return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
  }
  const orderNumStr = order.order_number ?? orderId.slice(0, 8);

  // ═══ UPDATE TRACKING ═════════════════════════════════════════════════════
  if (body.action === "update_tracking") {
    if (!body.tracking_number || body.tracking_number.trim().length === 0) {
      return NextResponse.json(
        { error: "tracking_number obbligatorio" },
        { status: 400 },
      );
    }
    const trackingNum = body.tracking_number.trim();
    const trackingUrl = body.tracking_url?.trim() || null;

    await sbAny
      .from("orders")
      .update({
        tracking_number: trackingNum,
        tracking_url: trackingUrl,
        status: "shipped",
        shipped_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (order.customer_email) {
      const html = brandLayout({
        preheader: `Ordine ${orderNumStr} spedito`,
        title: "Il tuo ordine è in viaggio",
        body: `
          <p>Ciao ${escapeHtml(order.customer_name ?? "")},</p>
          <p>Il tuo ordine <strong>${escapeHtml(orderNumStr)}</strong> è stato spedito.</p>
          <p style="background-color:#f0fdf4;padding:16px;border-radius:8px;margin:20px 0;">
            <strong>Tracking:</strong> ${escapeHtml(trackingNum)}<br>
            ${body.carrier ? `<strong>Corriere:</strong> ${escapeHtml(body.carrier)}<br>` : ""}
            <strong>Consegna stimata:</strong> 3-5 giorni lavorativi
          </p>
          ${
            trackingUrl
              ? `<p style="text-align:center;margin:20px 0;"><a href="${escapeAttr(trackingUrl)}" style="display:inline-block;background-color:#064e3b;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;">Traccia spedizione</a></p>`
              : ""
          }
        `,
      });
      void sendBrandedEmail({
        templateName: "order_shipped",
        subject: `Ordine ${orderNumStr} spedito · tracking ${trackingNum}`,
        html,
        recipients: [{ email: order.customer_email, name: order.customer_name ?? "" }],
      });
    }
    return NextResponse.json({ ok: true, status: "shipped", tracking_number: trackingNum });
  }

  // ═══ MARK DELIVERED ══════════════════════════════════════════════════════
  if (body.action === "mark_delivered") {
    if (order.status !== "shipped") {
      return NextResponse.json(
        { error: `Ordine in stato ${order.status}: si può marcare consegnato solo se spedito` },
        { status: 409 },
      );
    }
    await sbAny
      .from("orders")
      .update({
        status: "delivered",
        delivered_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (order.customer_email) {
      const html = brandLayout({
        preheader: `Ordine ${orderNumStr} consegnato`,
        title: "Ordine consegnato 🌿",
        body: `
          <p>Ciao ${escapeHtml(order.customer_name ?? "")},</p>
          <p>Il tuo ordine <strong>${escapeHtml(orderNumStr)}</strong> è stato consegnato.</p>
          <p>Speriamo che ami i tuoi nuovi capi Emerald Touch quanto noi amiamo crearli.</p>
          <p style="background-color:#f0fdf4;padding:16px;border-radius:8px;margin:20px 0;font-size:13px;color:#6b7280;">
            <strong>Reso entro 30 giorni</strong><br>
            Se qualcosa non va, puoi richiedere un reso dalla tua area personale. Te lo organizziamo noi.
          </p>
        `,
        ctaUrl: "https://www.emeraldress.com/profilo",
        ctaLabel: "Vai al mio profilo",
      });
      void sendBrandedEmail({
        templateName: "order_delivered",
        subject: `Ordine ${orderNumStr} consegnato`,
        html,
        recipients: [{ email: order.customer_email, name: order.customer_name ?? "" }],
      });
    }
    return NextResponse.json({ ok: true, status: "delivered" });
  }

  return NextResponse.json({ error: "Unreachable" }, { status: 500 });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;");
}
