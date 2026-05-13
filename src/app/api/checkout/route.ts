import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CartLineRequest {
  productId: string;
  size: string;
  quantity: number;
}

interface CheckoutPayload {
  items: CartLineRequest[];
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.emeraldress.com";

export async function POST(request: NextRequest) {
  let body: CheckoutPayload;
  try {
    body = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json({ error: "Body JSON non valido" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Carrello vuoto" }, { status: 400 });
  }
  if (items.length > 20) {
    return NextResponse.json({ error: "Troppi articoli (max 20)" }, { status: 400 });
  }

  // Sanity sui campi
  for (const i of items) {
    if (
      typeof i.productId !== "string" ||
      typeof i.size !== "string" ||
      typeof i.quantity !== "number" ||
      !Number.isInteger(i.quantity) ||
      i.quantity < 1 ||
      i.quantity > 10
    ) {
      return NextResponse.json({ error: "Item invalido" }, { status: 400 });
    }
  }

  // Fetch prezzi/stock dal DB (anon client, RLS pubblica)
  const supabase = createSupabasePublicClient();
  const productIds = Array.from(new Set(items.map((i) => i.productId)));
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, slug, price, sale_price, images, stock_by_size, status")
    .in("id", productIds);

  if (error) {
    return NextResponse.json({ error: "Errore lettura prodotti" }, { status: 500 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const byId = new Map<string, any>(((products as any[]) ?? []).map((p) => [p.id, p]));

  type LineItem = {
    productId: string;
    productName: string;
    size: string;
    unitAmountCents: number;
    quantity: number;
    image: string | null;
  };
  const validated: LineItem[] = [];

  // Aggrega qty per (productId, size) per validare contro lo stock totale per taglia
  const totalsByLine = new Map<string, number>();
  for (const i of items) {
    const k = `${i.productId}::${i.size}`;
    totalsByLine.set(k, (totalsByLine.get(k) ?? 0) + i.quantity);
  }

  for (const i of items) {
    const p = byId.get(i.productId);
    if (!p || p.status !== "active") {
      return NextResponse.json(
        { error: `Prodotto non disponibile: ${i.productId}` },
        { status: 400 },
      );
    }
    const unitPrice = Number(p.sale_price ?? p.price);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      return NextResponse.json({ error: "Prezzo prodotto non valido" }, { status: 400 });
    }

    const stockBySize = (p.stock_by_size ?? {}) as Record<string, number>;
    const stockForSize = Number(stockBySize[i.size] ?? 0);
    const requested = totalsByLine.get(`${i.productId}::${i.size}`) ?? i.quantity;
    if (requested > stockForSize) {
      return NextResponse.json(
        {
          error: `Stock insufficiente per ${p.name?.trim?.() ?? "il prodotto"} taglia ${i.size} (disponibili: ${stockForSize})`,
        },
        { status: 400 },
      );
    }

    const firstImage =
      Array.isArray(p.images) && typeof p.images[0] === "string" ? (p.images[0] as string) : null;

    validated.push({
      productId: p.id,
      productName: String(p.name ?? "Prodotto").trim(),
      size: i.size,
      unitAmountCents: Math.round(unitPrice * 100),
      quantity: i.quantity,
      image: firstImage,
    });
  }

  // Build Stripe line_items
  const line_items = validated.map((v) => ({
    quantity: v.quantity,
    price_data: {
      currency: "eur",
      unit_amount: v.unitAmountCents,
      product_data: {
        name: `${v.productName} — Taglia ${v.size}`,
        ...(v.image ? { images: [v.image] } : {}),
        // metadata custom per il webhook → orders_items
        metadata: {
          emeraldress_product_id: v.productId,
          emeraldress_size: v.size,
        },
      },
    },
  }));

  // Metadata session-level: serializziamo l'intero cart compatto per il webhook.
  // Stripe metadata: max 500 chars per value, 50 keys. Comprimiamo aggressivamente.
  const compactCart = validated.map((v) => ({
    p: v.productId,
    s: v.size,
    q: v.quantity,
    a: v.unitAmountCents,
  }));
  const cartJson = JSON.stringify(compactCart);
  // Split su piu' chiavi se troppo lungo
  const metadata: Record<string, string> = {
    source: "cart",
    items_count: String(validated.reduce((acc, v) => acc + v.quantity, 0)),
  };
  if (cartJson.length <= 480) {
    metadata.cart = cartJson;
  } else {
    // chunk in cart_0..cart_n da 480 char ciascuno
    for (let idx = 0, off = 0; off < cartJson.length; idx++, off += 480) {
      metadata[`cart_${idx}`] = cartJson.slice(off, off + 480);
    }
    metadata.cart_chunks = String(Math.ceil(cartJson.length / 480));
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/cancel`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["IT", "AT", "BE", "DE", "ES", "FR", "NL", "PT", "GB", "CH", "US"],
      },
      phone_number_collection: { enabled: true },
      locale: "it",
      // Spedizione: gratuita >= 200 EUR, altrimenti standard 9.90
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "eur" },
            display_name: "Spedizione gratuita (ordini ≥ €200)",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 990, currency: "eur" },
            display_name: "Spedizione standard",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      allow_promotion_codes: true,
      metadata,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Sessione senza URL" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[/api/checkout] Stripe error:", e);
    const msg = e instanceof Error ? e.message : "Errore Stripe";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
