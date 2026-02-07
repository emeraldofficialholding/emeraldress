import HeroSection from "@/components/HeroSection";
import EmeraldTouchSection from "@/components/EmeraldTouchSection";
import ClassicsSection from "@/components/ClassicsSection";
import ManifestoSection from "@/components/ManifestoSection";
// CORREZIONE: Importiamo il componente "default" (senza le parentesi graffe {})
import TrustMarquee from "@/components/TrustMarquee";

const Index = () => {
  return (
    <main>
      <HeroSection />
      <TrustMarquee />
      <EmeraldTouchSection />
      <ClassicsSection />
      <ManifestoSection />
    </main>
  );
};

export default Index;
