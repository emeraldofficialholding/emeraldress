/**
 * Sconto globale su tutto il catalogo (promo "-20% su tutti gli articoli").
 * Mettere a 0 per disattivare la promo: getEffectivePrice degrada a
 * min(sale_price, price), cioè il comportamento pre-promo.
 */
export const GLOBAL_DISCOUNT = 0.2;

/**
 * Prezzo effettivo di vendita: il più basso tra il sale_price per-prodotto
 * (se valido) e il prezzo di listino scontato del GLOBAL_DISCOUNT.
 * Arrotondato al centesimo, così frontend e checkout (unit_amount in cents)
 * producono sempre lo stesso importo.
 */
export function getEffectivePrice(
  price: number | string | null | undefined,
  salePrice?: number | string | null,
): number {
  const base = Number(price);
  if (!Number.isFinite(base) || base <= 0) return 0;
  const discounted = Math.round(base * (1 - GLOBAL_DISCOUNT) * 100) / 100;
  const sale = Number(salePrice);
  const saleValid = Number.isFinite(sale) && sale > 0 ? sale : Number.POSITIVE_INFINITY;
  return Math.min(saleValid, discounted);
}

/** True se il prezzo effettivo è sotto il listino (mostra il prezzo barrato). */
export function hasDiscount(
  price: number | string | null | undefined,
  salePrice?: number | string | null,
): boolean {
  const base = Number(price);
  return Number.isFinite(base) && base > 0 && getEffectivePrice(price, salePrice) < base;
}
