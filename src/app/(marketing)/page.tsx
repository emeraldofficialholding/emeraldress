import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import HeroSection from "@/components/HeroSection";
import TrustMarquee from "@/components/TrustMarquee";
import EmeraldTouchSection from "@/components/EmeraldTouchSection";
import ClassicsSection from "@/components/ClassicsSection";
import ManifestoSection from "@/components/ManifestoSection";
import RelatedLinks from "@/components/RelatedLinks";

interface SeoSettings {
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
}

const defaultSeo: Required<SeoSettings> = {
  meta_title: "Emeraldress | Abbigliamento Sostenibile di Lusso e Fibra Riciclata",
  meta_description:
    "Scopri l'esclusiva collezione Emeraldress: abiti da sera e pret-a-porter realizzati in Italia con tessuti sostenibili rigenerati e design minimalista.",
  og_image_url: "",
};

async function getSeo(): Promise<Required<SeoSettings>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("app_settings")
      .select("seo_settings")
      .eq("id", 1)
      .maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = ((data as any)?.seo_settings ?? {}) as SeoSettings;
    return {
      meta_title: s.meta_title || defaultSeo.meta_title,
      meta_description: s.meta_description || defaultSeo.meta_description,
      og_image_url: s.og_image_url || defaultSeo.og_image_url,
    };
  } catch {
    return defaultSeo;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();
  return {
    title: seo.meta_title,
    description: seo.meta_description,
    alternates: { canonical: "/" },
    openGraph: {
      title: seo.meta_title,
      description: seo.meta_description,
      url: "/",
      type: "website",
      ...(seo.og_image_url && { images: [{ url: seo.og_image_url }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.meta_title,
      description: seo.meta_description,
      ...(seo.og_image_url && { images: [seo.og_image_url] }),
    },
  };
}

export const revalidate = 3600; // 1h ISR

export default async function HomePage() {
  const seo = await getSeo();
  const clothingStoreSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Emeraldress",
    url: "https://www.emeraldress.com",
    logo: "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-icon-ed.svg",
    description: seo.meta_description,
    slogan: "Lusso Consapevole e Manifattura Italiana",
    foundingDate: "2026",
    areaServed: "IT",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IT",
      addressRegion: "Sardegna",
    },
    knowsAbout: ["moda sostenibile", "ECONYL", "luxury fashion", "manifattura italiana"],
    brand: { "@type": "Brand", name: "Emeraldress" },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clothingStoreSchema) }}
      />
      <HeroSection />
      <TrustMarquee />
      <EmeraldTouchSection />
      <ClassicsSection />
      <ManifestoSection />
      <RelatedLinks
        title="Esplora il mondo Emeraldress"
        intro="Quattro porte d'ingresso al nostro universo: la collezione, la filosofia, la diagnostica del tessuto e la storia del brand."
        links={[
          { to: "/collezioni", label: "Collezioni", desc: "La selezione Emerald Touch, edizione limitata.", eyebrow: "Shop" },
          { to: "/sostenibilita", label: "Sostenibilità", desc: "La fibra rigenerata e il processo di trasformazione.", eyebrow: "Materia" },
          { to: "/emeraldscanner", label: "Emerald Scanner", desc: "Analizza un capo e scopri il suo impatto reale.", eyebrow: "Strumento" },
          { to: "/chisiamo", label: "Chi Siamo", desc: "Vision, mission e filiera 100% Made in Italy.", eyebrow: "Manifesto" },
        ]}
      />
    </main>
  );
}
