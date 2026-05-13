import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Endpoint di TEST per verificare end-to-end che i pagamenti arrivino su Stripe.
 *
 * - Protetto da `TEST_CHECKOUT_TOKEN` env var (se manca → 404, l'endpoint
 *   non esiste pubblicamente).
 * - NON tocca prodotti, stock, reservations, rate limiting, ordini Supabase.
 * - Crea una Stripe Checkout Session da 10€ con card + Klarna e redirige
 *   direttamente all'URL ospitato di Stripe.
 *
 * Uso: `https://www.emeraldress.com/api/checkout-test?token=<TOKEN>`
 *
 * Importante: dopo il test, vai su Stripe Dashboard → Payments per verificare
 * il successo. Il webhook NON crea ordini in DB (questa session non è "cart"
 * source). Per rimborsare il pagamento test, usa il dashboard Stripe.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.emeraldress.com";

const TEST_TOKEN = process.env.TEST_CHECKOUT_TOKEN;

export async function GET(request: NextRequest) {
  // Se l'env non è configurata, l'endpoint non esiste (404).
  if (!TEST_TOKEN) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token || token !== TEST_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const amountCents = 1000; // €10.00 fissi

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "klarna"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amountCents,
            product_data: {
              name: "Emeraldress · Test pagamento",
              metadata: { source: "checkout-test" },
            },
          },
        },
      ],
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&test=1`,
      cancel_url: `${SITE_URL}/checkout/cancel?test=1`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["IT", "AT", "BE", "DE", "ES", "FR", "NL", "PT", "GB", "CH", "US"],
      },
      phone_number_collection: { enabled: true },
      locale: "it",
      // Marker per identificare la session come test nel dashboard Stripe
      // e nel webhook (verrà ignorato perché non ha `metadata.source = 'cart'`).
      metadata: {
        source: "checkout-test",
        test_amount_eur: "10.00",
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Sessione senza URL" }, { status: 500 });
    }

    // Redirect diretto al checkout Stripe.
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[/api/checkout-test] Stripe error:", e);
    const msg = e instanceof Error ? e.message : "Errore Stripe";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
