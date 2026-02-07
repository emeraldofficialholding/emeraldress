import { MarqueeAnimation } from "@/components/ui/marquee-effect";

const TrustMarquee = () => {
  return (
    <section className="w-full py-0 border-t border-emerald-100 my-0">
      {/* 1. BANDA SUPERIORE: Scura, va verso SINISTRA */}
      <div className="bg-emerald-900 text-white py-3 md:py-4">
        <MarqueeAnimation baseVelocity={0.5} direction="left">
          <span className="text-sm md:text-lg tracking-[0.2em] font-serif mr-4 md:mr-8">
            EMERALDRESS • MADE IN ITALY • LUSSO CONSAPEVOLE • FIBRA RIGENERATA • &nbsp;&nbsp;
          </span>
        </MarqueeAnimation>
      </div>

      {/* 2. BANDA INFERIORE: Chiara, va verso DESTRA */}
      <div className="bg-[#E4FFEC] text-emerald-950 py-3 md:py-4">
        <MarqueeAnimation baseVelocity={0.5} direction="right">
          <span className="text-sm md:text-lg tracking-[0.2em] font-serif mr-4 md:mr-8">
            SOSTENIBILITÀ CERTIFICATA • ECONYL® TECHNOLOGY • SPEDIZIONI GREEN • OCEAN CLEANUP • &nbsp;&nbsp;
          </span>
        </MarqueeAnimation>
      </div>
    </section>
  );
};

export default TrustMarquee;
