import { getEffectivePrice, hasDiscount } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/**
 * "Francobollo" rosso sovrapposto all'immagine prodotto con la percentuale
 * di sconto reale (es. −20%). Non renderizza nulla se il prodotto non è scontato.
 * Va montato dentro un contenitore `relative`.
 */
export function DiscountBadge({
  price,
  salePrice,
  className,
}: {
  price: number | string | null | undefined;
  salePrice?: number | string | null;
  className?: string;
}) {
  if (!hasDiscount(price, salePrice)) return null;
  const percent = Math.round((1 - getEffectivePrice(price, salePrice) / Number(price)) * 100);
  return (
    <span
      className={cn(
        "absolute top-2 left-2 z-10 w-12 h-12 -rotate-12 rounded-full bg-red-600 text-white text-[11px] shadow-lg flex items-center justify-center pointer-events-none select-none",
        className,
      )}
      aria-label={`Sconto ${percent} percento`}
    >
      <span className="absolute inset-1 rounded-full border border-dashed border-white/70" aria-hidden />
      <span className="font-bold tracking-tight font-sans">−{percent}%</span>
    </span>
  );
}
