import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import EmeraldTouchSection from "@/components/EmeraldTouchSection";
import ClassicsSection from "@/components/ClassicsSection";
import ManifestoSection from "@/components/ManifestoSection";
import TrustMarquee from "@/components/TrustMarquee";

const Index = () => {
  return (
    <main>
      <Helmet>
        <title>Emeraldress | Abbigliamento Sostenibile di Lusso e Fibra Riciclata</title>
        <meta name="description" content="Scopri l'esclusiva collezione Emeraldress: abiti da sera e pret-a-porter realizzati in Italia con tessuti sostenibili rigenerati e design minimalista." />
        <link rel="canonical" href="https://www.emeraldress.com/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Emeraldress",
          "url": "https://www.emeraldress.com",
          "logo": "https://www.emeraldress.com/logo-ed.png",
          "description": "Brand italiano di moda luxury sostenibile.",
          "brand": {
            "@type": "Brand",
            "name": "Emeraldress"
          },
          "sameAs": []
        })}</script>
      </Helmet>
      <HeroSection />
      <TrustMarquee />
      <EmeraldTouchSection />
      <ClassicsSection />
      <ManifestoSection />
    </main>
  );
};

export default Index;
