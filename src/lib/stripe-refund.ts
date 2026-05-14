import "server-only";

import { getStripe } from "@/lib/stripe";

export interface RefundResult {
  ok: boolean;
  refund_id?: string;
  amount?: number; // EUR
  status?: string;
  error?: string;
}

/**
 * Crea un rimborso Stripe **idempotente**. Anche con retry multipli, Stripe
 * non duplicherà il refund se l'idempotency-key è la stessa.
 *
 * @param paymentIntentId  Stripe Payment Intent ID dall'ordine (orders.payment_id)
 * @param amountCents      Importo in centesimi. Omettere per refund totale.
 * @param idempotencyKey   Chiave deterministica (es. `refund_order_${orderId}` o `refund_return_${returnId}`)
 * @param reason           Stripe accetta: 'duplicate' | 'fraudulent' | 'requested_by_customer'
 */
export async function createStripeRefund(opts: {
  paymentIntentId: string;
  amountCents?: number;
  idempotencyKey: string;
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
  metadata?: Record<string, string>;
}): Promise<RefundResult> {
  if (!opts.paymentIntentId) {
    return { ok: false, error: "Payment intent ID mancante" };
  }
  try {
    const stripe = getStripe();
    const refund = await stripe.refunds.create(
      {
        payment_intent: opts.paymentIntentId,
        ...(opts.amountCents ? { amount: opts.amountCents } : {}),
        reason: opts.reason ?? "requested_by_customer",
        metadata: opts.metadata,
      },
      {
        idempotencyKey: opts.idempotencyKey,
      },
    );
    return {
      ok: true,
      refund_id: refund.id,
      amount: refund.amount / 100,
      status: refund.status ?? undefined,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Errore Stripe refund",
    };
  }
}
