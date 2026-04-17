import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/external-client";
import HeroSection from "@/components/HeroSection";
import EmeraldTouchSection from "@/components/EmeraldTouchSection";
import ClassicsSection from "@/components/ClassicsSection";
import ManifestoSection from "@/components/ManifestoSection";
import TrustMarquee from "@/components/TrustMarquee";

const defaultSeo = {
  meta_title: "Emeraldress | Abbigliamento Sostenibile di Lusso e Fibra Riciclata",
  meta_description: "Scopri l'esclusiva collezione Emeraldress: abiti da sera e pret-a-porter realizzati in Italia con tessuti sostenibili rigenerati e design minimalista.",
  og_image_url: "",
};

const Index = () => {
  const [seo, setSeo] = useState(defaultSeo);

  useEffect(() => {
    supabase
      .from("app_settings" as any)
      .select("seo_settings")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data && (data as any).seo_settings) {
          const s = (data as any).seo_settings;
          setSeo({
            meta_title: s.meta_title || defaultSeo.meta_title,
            meta_description: s.meta_description || defaultSeo.meta_description,
            og_image_url: s.og_image_url || "",
          });
        }
      });
  }, []);

  return (
    <main>
      <Helmet>
        <title>{seo.meta_title}</title>
        <meta name="description" content={seo.meta_description} />
        <link rel="canonical" href="https://www.emeraldress.com/" />
        {seo.og_image_url && <meta property="og:image" content={seo.og_image_url} />}
        <meta property="og:title" content={seo.meta_title} />
        <meta property="og:description" content={seo.meta_description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.emeraldress.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.meta_title} />
        <meta name="twitter:description" content={seo.meta_description} />
        {seo.og_image_url && <meta name="twitter:image" content={seo.og_image_url} />}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ClothingStore",
          "name": "Emeraldress",
          "url": "https://www.emeraldress.com",
          "logo": "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-icon-ed.svg",
          "description": seo.meta_description,
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
