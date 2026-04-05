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
          "@type": "ClothingStore",
          "name": "Emeraldress",
          "url": "https://www.emeraldress.com",
          "logo": "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-icon-ed.svg",
          "description": "Brand italiano di moda luxury sostenibile con tessuti riciclati ECONYL® e manifattura artigianale.",
          "slogan": "Lusso Consapevole e Manifattura Italiana",
          "foundingDate": "2026",
          "areaServed": "IT",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IT",
            "addressRegion": "Sardegna"
          },
          "knowsAbout": ["moda sostenibile", "ECONYL", "luxury fashion", "manifattura italiana"],
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
