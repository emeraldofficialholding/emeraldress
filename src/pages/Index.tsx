import HeroSection from "@/components/HeroSection";
import EmeraldTouchSection from "@/components/EmeraldTouchSection";
import ClassicsSection from "@/components/ClassicsSection";
import ManifestoSection from "@/components/ManifestoSection";
import { MarqueeAnimation } from "@/components/ui/marquee-effect";

const Index = () => (
  <main>
    <HeroSection />
    <EmeraldTouchSection />
    <ClassicsSection />
    <ManifestoSection />

    <section>
      {/* Line 1: Dark Luxury */}
      <div className="bg-primary py-4">
        <MarqueeAnimation baseVelocity={1} direction="left">
          <span className="text-primary-foreground font-serif text-lg md:text-2xl tracking-widest">
            EMERALDRESS • MADE IN ITALY • LUSSO CONSAPEVOLE • FIBRA RIGENERATA •{" "}
          </span>
        </MarqueeAnimation>
      </div>

      {/* Line 2: Light Freshness */}
      <div className="bg-accent py-4">
        <MarqueeAnimation baseVelocity={1} direction="right">
          <span className="text-accent-foreground font-serif text-lg md:text-2xl tracking-widest">
            SOSTENIBILITÀ CERTIFICATA • ECONYL® TECHNOLOGY • SPEDIZIONI GREEN • OCEAN CLEANUP •{" "}
          </span>
        </MarqueeAnimation>
      </div>
    </section>
  </main>
);

export default Index;
