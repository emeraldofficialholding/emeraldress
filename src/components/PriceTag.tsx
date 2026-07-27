import { getEffectivePrice, hasDiscount } from "@/lib/pricing";

/**
 * Prezzo con eventuale listino barrato. Se non c'è sconto mostra solo il prezzo.
 * `strikeClassName` permette varianti su sfondo scuro (es. text-white/50).
 */
export function PriceTag({
  price,
  salePrice,
  className = "",
  strikeClassName = "",
  discountClassName = "text-red-600",
}: {
  price: number | string;
  salePrice?: number | string | null;
  className?: string;
  strikeClassName?: string;
  discountClassName?: string;
}) {
  const effective = getEffectivePrice(price, salePrice);
  if (!hasDiscount(price, salePrice)) {
    return <span className={className}>€{effective.toFixed(2)}</span>;
  }
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <s className={`opacity-60 font-normal ${strikeClassName}`}>
        €{Number(price).toFixed(2)}
      </s>
      <span className={`font-medium ${discountClassName}`}>€{effective.toFixed(2)}</span>
    </span>
  );
}
