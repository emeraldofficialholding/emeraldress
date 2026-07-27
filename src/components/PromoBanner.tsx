const TEXT = "SCONTI SU TUTTI GLI ARTICOLI −20%";

/**
 * Striscia promo fissa sopra la Navbar (che è shiftata a top-8).
 * Scorrimento infinito via CSS `.animate-marquee` (globals.css): il track
 * trasla di -50%, quindi il contenuto è duplicato esattamente 2 volte.
 */
export function PromoBanner() {
  return (
    <div
      role="status"
      aria-label="Promozione: sconti su tutti gli articoli meno venti percento"
      className="fixed top-0 inset-x-0 z-[60] h-8 overflow-hidden text-emerald-50 select-none"
      style={{ background: "linear-gradient(90deg, #052e1f 0%, #064e3b 50%, #047857 100%)" }}
    >
      <div className="animate-marquee motion-reduce:[animation:none] flex w-max h-8 items-center">
        {[0, 1].map((half) => (
          <div key={half} aria-hidden={half === 1} className="flex items-center shrink-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="flex items-center whitespace-nowrap px-5 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-medium font-sans"
              >
                {TEXT}
                <span className="ml-10 opacity-50" aria-hidden>
                  ◆
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
