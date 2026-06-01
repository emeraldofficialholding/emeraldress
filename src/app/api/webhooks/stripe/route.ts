import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
// I webhook NON devono essere cacheati ne' pre-renderizzati.
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const N8N_WEBHOOK_URL = process.env.N8N_ORDER_WEBHOOK_URL; // opzionale
// Webhook n8n separato per abbandoni Stripe (email di recupero a +1h).
const N8N_ABANDONED_WEBHOOK_URL = process.env.N8N_ABANDONED_WEBHOOK_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.emeraldress.com";
// Notifica admin nuovo ordine — entrambi opzionali, indipendenti.
const ADMIN_ORDER_WEBHOOK_URL = process.env.ADMIN_ORDER_WEBHOOK_URL; // Discord/Slack/Zapier/qualsiasi POST endpoint
const TELEGRAM_BOT_TOKEN = process.env.ADMIN_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.ADMIN_TELEGRAM_CHAT_ID;

type CompactCartItem = { p: string; s: string; q: number; a: number };

function reassembleCart(metadata: Record<string, string> | null): CompactCartItem[] {
  if (!metadata) return [];
  if (metadata.cart) {
    try {
      return JSON.parse(metadata.cart);
    } catch {
      return [];
    }
  }
  // chunked
  const chunkCount = Number(metadata.cart_chunks ?? 0);
  if (chunkCount > 0) {
    let joined = "";
    for (let i = 0; i < chunkCount; i++) {
      joined += metadata[`cart_${i}`] ?? "";
    }
    try {
      return JSON.parse(joined);
    } catch {
      return [];
    }
  }
  return [];
}

export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    // eslint-disable-next-line no-console
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET non configurato");
    return NextResponse.json({ error: "Webhook non configurato" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[stripe webhook] Firma invalida:", err);
    return NextResponse.json({ error: "Firma invalida" }, { status: 400 });
  }

  // Idempotenza: usiamo session.id come idempotency_key in orders.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await handleCheckoutCompleted(session);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[stripe webhook] handleCheckoutCompleted error:", e);
      // Restituiamo 500 cosi' Stripe ritenta
      return NextResponse.json({ error: "Errore handler" }, { status: 500 });
    }
  }

  // Sessione scaduta o cancellata: rilascia le reservation per liberare lo stock.
  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      const supabase = createSupabaseAdminClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).rpc("release_reservations_for_session", {
        p_stripe_session_id: session.id,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("[stripe webhook] release_reservations error:", e);
    }
    // Cattura abbandono per email di recupero. Best-effort: se fallisce,
    // l'evento principale (release stock) e' gia' andato a buon fine.
    if (event.type === "checkout.session.expired") {
      try {
        await handleAbandonedCheckout(session);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[stripe webhook] handleAbandonedCheckout error:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}

// ── Abbandono checkout ─────────────────────────────────────────────────────
// Si triggera su checkout.session.expired (default 24h dopo creazione su Stripe).
// Salva l'abbandono in abandoned_checkouts e notifica n8n per la sequenza email.
async function handleAbandonedCheckout(session: Stripe.Checkout.Session) {
  // Skip test sessions.
  if (session.metadata?.source === "checkout-test") return;

  const supabase = createSupabaseAdminClient();
  const stripe = getStripe();

  // Recupera dettagli completi (line items + customer details). customer_details
  // popolato solo se l'utente ha digitato email/phone su Stripe Hosted Checkout.
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price.product", "customer_details"],
  });

  const email = fullSession.customer_details?.email ?? fullSession.customer_email ?? null;
  // Senza email non possiamo mandare recovery: salviamo comunque per analytics
  // ma marchiamo 'skipped' cosi' n8n non lo prende.
  const emailStatus = email ? "pending" : "skipped";

  // Reconstruisce gli items da Stripe line_items (no fallback metadata: piu' affidabile).
  const lineItems = fullSession.line_items?.data ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = lineItems.map((li: any) => {
    const product = li.price?.product;
    const productMeta = (typeof product === "object" && product?.metadata) || {};
    const productId = productMeta.emeraldress_product_id ?? null;
    const size = productMeta.emeraldress_size ?? li.description ?? null;
    return {
      product_id: productId,
      name: typeof product === "object" ? product?.name : li.description,
      image: typeof product === "object" && Array.isArray(product?.images) ? product.images[0] ?? null : null,
      size,
      quantity: li.quantity ?? 1,
      unit_amount: li.price?.unit_amount ?? 0,
    };
  });

  // Lookup slug per i product_id (serve per il link di recovery cart)
  const productIds = items.map((i) => i.product_id).filter(Boolean) as string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: products } = productIds.length
    ? await supabase.from("products").select("id, slug, name").in("id", productIds)
    : { data: [] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slugMap = new Map<string, string>(((products as any[]) ?? []).map((p) => [p.id, p.slug ?? p.id]));
  const itemsEnriched = items.map((it) => ({
    ...it,
    slug: it.product_id ? slugMap.get(it.product_id) ?? null : null,
  }));

  // Upsert in abandoned_checkouts (ON CONFLICT su stripe_session_id NO-OP per idempotenza).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data: inserted, error: insErr } = await sb
    .from("abandoned_checkouts")
    .upsert(
      {
        stripe_session_id: session.id,
        email,
        phone: fullSession.customer_details?.phone ?? null,
        customer_name: fullSession.customer_details?.name ?? null,
        items: itemsEnriched,
        amount_total: fullSession.amount_total ?? null,
        currency: (fullSession.currency ?? "eur").toLowerCase(),
        locale: fullSession.locale ?? "it",
        email_status: emailStatus,
      },
      { onConflict: "stripe_session_id" },
    )
    .select("recovery_token")
    .single();

  if (insErr) {
    // eslint-disable-next-line no-console
    console.warn("[stripe webhook] abandoned upsert error:", insErr);
    return;
  }

  const recoveryToken = (inserted as { recovery_token?: string } | null)?.recovery_token;
  const recoveryUrl = recoveryToken
    ? `${SITE_URL}/?recover=${recoveryToken}`
    : `${SITE_URL}/collezioni`;

  // Notifica n8n: il workflow su n8n applica il delay (+1h) e invia email.
  if (N8N_ABANDONED_WEBHOOK_URL && email) {
    try {
      await fetch(N8N_ABANDONED_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "abandoned_checkout",
          stripe_session_id: session.id,
          recovery_token: recoveryToken,
          recovery_url: recoveryUrl,
          email,
          phone: fullSession.customer_details?.phone ?? null,
          customer_name: fullSession.customer_details?.name ?? null,
          locale: fullSession.locale ?? "it",
          currency: fullSession.currency ?? "eur",
          amount_total: fullSession.amount_total ?? null,
          items: itemsEnriched,
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("[stripe webhook] n8n abandoned notify failed:", e);
    }
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Ignoriamo sessioni non pagate (es. async payment in pending)
  if (session.payment_status !== "paid") return;

  // Sessioni test create da /api/checkout-test: NON creano ordini in DB.
  // Servono solo per verificare l'integrazione Stripe + arrivo dei soldi.
  if (session.metadata?.source === "checkout-test") {
    // eslint-disable-next-line no-console
    console.log("[stripe webhook] Test session paid (no order created):", session.id);
    return;
  }

  const supabase = createSupabaseAdminClient();

  // Check idempotenza (cast: idempotency_key non e' ancora nei types generati)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase.from("orders") as any)
    .select("id")
    .eq("idempotency_key", session.id)
    .maybeSingle();
  if (existing) return;

  const stripe = getStripe();
  // Recupera anche customer details + shipping
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items", "customer_details", "shipping_cost"],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = (fullSession.metadata ?? {}) as any;
  const cart = reassembleCart(meta);
  if (cart.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("[stripe webhook] Cart vuoto nei metadata", session.id);
  }

  const customer = fullSession.customer_details;
  const shipping = fullSession.collected_information?.shipping_details ?? null;
  const totalAmount = (fullSession.amount_total ?? 0) / 100;
  const subtotal = (fullSession.amount_subtotal ?? 0) / 100;
  const shippingCost =
    typeof fullSession.shipping_cost?.amount_total === "number"
      ? fullSession.shipping_cost.amount_total / 100
      : 0;

  // Carica i prodotti per arricchire order_items con product_id e prezzo coerente
  const productIds = Array.from(new Set(cart.map((c) => c.p)));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: products } = productIds.length
    ? await supabase.from("products").select("id, name, stock_by_size").in("id", productIds)
    : { data: [] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productMap = new Map<string, any>(((products as any[]) ?? []).map((p) => [p.id, p]));

  // Genera order_number progressivo (fallback su timestamp se manca trigger)
  const orderNumber = `EMD-${Date.now().toString(36).toUpperCase()}`;

  const orderInsert = {
    customer_email: customer?.email ?? fullSession.customer_email ?? null,
    customer_name: customer?.name ?? null,
    customer_phone: customer?.phone ?? null,
    guest_email: customer?.email ?? null,
    total_amount: totalAmount,
    subtotal,
    shipping_cost: shippingCost,
    currency: (fullSession.currency ?? "eur").toLowerCase(),
    locale: fullSession.locale ?? "it",
    status: "processing",
    payment_method: "stripe",
    payment_id: typeof fullSession.payment_intent === "string" ? fullSession.payment_intent : null,
    idempotency_key: session.id,
    order_number: orderNumber,
    shipping_address: shipping
      ? {
          name: shipping.name ?? null,
          address: shipping.address ?? null,
        }
      : null,
    billing_address: customer
      ? {
          name: customer.name ?? null,
          address: customer.address ?? null,
        }
      : null,
    metadata: {
      stripe_session_id: session.id,
      source: "cart-checkout-v1",
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: insertedOrder, error: insertOrderErr } = await (supabase.from("orders") as any)
    .insert(orderInsert)
    .select("id")
    .single();
  if (insertOrderErr || !insertedOrder) {
    throw insertOrderErr ?? new Error("Order insert failed");
  }
  const orderId = insertedOrder.id as string;

  // Consume le reservation legate a questa session (anti-oversell): atomicamente
  // marca le righe come 'consumed' e linka l'order_id.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc("consume_reservations_for_session", {
      p_stripe_session_id: session.id,
      p_order_id: orderId,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[stripe webhook] consume_reservations error (non-blocking):", e);
  }

  // Se questa sessione era stata salvata come abbandono (es. utente torna via
  // link recovery e completa) marchiamo l'abbandono come convertito.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc("mark_abandoned_converted", {
      p_stripe_session_id: session.id,
      p_order_id: orderId,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[stripe webhook] mark_abandoned_converted error (non-blocking):", e);
  }

  // order_items + decrement stock
  for (const line of cart) {
    const p = productMap.get(line.p);
    const unitPrice = line.a / 100;
    const lineTotal = unitPrice * line.q;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("order_items") as any).insert({
      order_id: orderId,
      product_id: line.p,
      quantity: line.q,
      selected_size: line.s,
      size: line.s,
      price_at_purchase: unitPrice,
      unit_price: unitPrice,
      product_name: p?.name?.trim?.() ?? null,
      line_subtotal: lineTotal,
      line_total: lineTotal,
    });

    // Decrement stock_by_size per la taglia. Trigger DB risincronizza `stock`.
    if (p) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentSbs = (p.stock_by_size ?? {}) as Record<string, number>;
      const newQty = Math.max(0, (Number(currentSbs[line.s] ?? 0) || 0) - line.q);
      const nextSbs = { ...currentSbs, [line.s]: newQty };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("products") as any)
        .update({ stock_by_size: nextSbs })
        .eq("id", line.p);
      // aggiorna mappa locale per multi-line dello stesso prodotto
      productMap.set(line.p, { ...p, stock_by_size: nextSbs });
    }
  }

  // Salva shipping address come user_address se l'utente è autenticato e non ne ha già uno.
  // Stripe hosted checkout non permette pre-fill, quindi il valore è gestionale (visibile in /profilo).
  const clientRefId = fullSession.client_reference_id;
  if (clientRefId && shipping?.address) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any;
      const { data: existingAddresses } = await sb
        .from("user_addresses")
        .select("id")
        .eq("user_id", clientRefId)
        .limit(1);
      if (!existingAddresses || existingAddresses.length === 0) {
        const addr = shipping.address;
        const nameParts = (shipping.name ?? customer?.name ?? "").trim().split(/\s+/);
        const firstName = nameParts[0] ?? "";
        const lastName = nameParts.slice(1).join(" ") || firstName;
        await sb.from("user_addresses").insert({
          user_id: clientRefId,
          first_name: firstName || "—",
          last_name: lastName || "—",
          phone: customer?.phone ?? null,
          line1: addr.line1 ?? "",
          line2: addr.line2 ?? null,
          city: addr.city ?? "",
          postal_code: addr.postal_code ?? "",
          state: addr.state ?? null,
          country: (addr.country ?? "IT").toUpperCase(),
          is_default: true,
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("[stripe webhook] save user_address failed:", e);
    }
  }

  // ── Payload ordine completo (usato per N8N orchestrator + admin + Telegram) ──
  const itemSummary = cart
    .map((line) => {
      const name = productMap.get(line.p)?.name?.trim?.() ?? "Prodotto";
      return `${line.q}× ${name} (${line.s})`;
    })
    .join(", ");

  const orderPayload = {
    event: "order.created",
    order_id: orderId,
    order_number: orderNumber,
    stripe_session_id: session.id,
    customer_email: orderInsert.customer_email,
    customer_name: orderInsert.customer_name,
    customer_phone: orderInsert.customer_phone,
    total_amount: totalAmount,
    subtotal,
    shipping_cost: shippingCost,
    currency: orderInsert.currency,
    locale: orderInsert.locale,
    items_count: cart.reduce((acc, l) => acc + l.q, 0),
    items_summary: itemSummary,
    items: cart.map((l) => ({
      product_id: l.p,
      product_name: productMap.get(l.p)?.name?.trim?.() ?? null,
      size: l.s,
      quantity: l.q,
      unit_price: l.a / 100,
      line_total: (l.a / 100) * l.q,
    })),
    shipping: shipping
      ? {
          name: shipping.name ?? null,
          address: shipping.address ?? null,
        }
      : null,
    billing: customer
      ? {
          name: customer.name ?? null,
          address: customer.address ?? null,
        }
      : null,
    shipping_country: shipping?.address?.country ?? null,
    source: "cart-checkout-v1",
  };

  // Alias retro-compat (alcuni consumer del vecchio adminPayload usano questi nomi)
  const adminPayload = orderPayload;

  // 1. Notifica n8n orchestrator (email cliente + email admin + trigger shipping)
  //    Best-effort: se n8n risponde 404 o timeout, il pagamento è già confermato
  //    e l'ordine in DB. L'admin riceverà comunque Telegram.
  if (N8N_WEBHOOK_URL) {
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("[stripe webhook] n8n notify failed:", e);
    }
  }

  // 2. Webhook admin generico (Discord/Slack/Zapier — separato da n8n orchestrator)
  if (ADMIN_ORDER_WEBHOOK_URL) {
    try {
      await fetch(ADMIN_ORDER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminPayload),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("[stripe webhook] admin webhook notify failed:", e);
    }
  }

  // 2. Telegram diretto (se bot configurato)
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const msg = [
        `🟢 *Nuovo ordine* \`${orderNumber}\``,
        ``,
        `💰 *€${totalAmount.toFixed(2)}* · ${adminPayload.items_count} ${adminPayload.items_count === 1 ? "capo" : "capi"}`,
        `👤 ${adminPayload.customer_name ?? "—"}`,
        `✉️ ${adminPayload.customer_email ?? "—"}`,
        adminPayload.shipping_country ? `🌍 ${adminPayload.shipping_country}` : "",
        ``,
        `🧾 ${itemSummary}`,
      ]
        .filter(Boolean)
        .join("\n");

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: msg,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("[stripe webhook] telegram notify failed:", e);
    }
  }
}
