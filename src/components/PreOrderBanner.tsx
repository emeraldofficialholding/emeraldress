import { Truck } from "lucide-react";

/**
 * Striscia annuncio pre-order, fissata sopra la Navbar.
 * Altezza fissa: h-8 (32px) — sincronizzata con il `top-8` di Navbar e
 * con i padding-top delle pagine marketing.
 *
 * NON dismissibile (info di vendita critica).
 */
export function PreOrderBanner() {
  return (
    <div
      role="status"
      aria-label="Annuncio pre-order"
      className="fixed top-0 inset-x-0 z-[60] h-8 flex items-center justify-center px-3 text-emerald-50 select-none"
      style={{
        background:
          "linear-gradient(90deg, #052e1f 0%, #064e3b 50%, #047857 100%)",
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium">
        <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-90" strokeWidth={1.75} />
        <span className="font-semibold tracking-[0.25em]">Pre-order</span>
        <span className="opacity-70" aria-hidden>·</span>
        <span className="truncate">Spedizioni a partire da <span className="font-semibold">martedì 19</span></span>
      </div>
    </div>
  );
}
