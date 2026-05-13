import "server-only";
import Stripe from "stripe";

/**
 * Stripe server-only client. Mai importare da un Client Component.
 * Richiede env `STRIPE_SECRET_KEY` (test o live).
 *
 * Webhook secret separato in `STRIPE_WEBHOOK_SECRET` (preso dal Dashboard Stripe
 * → Developers → Webhooks → endpoint → "Signing secret").
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY mancante nelle environment variables");
  }
  cached = new Stripe(key);
  return cached;
}
