import type { Metadata } from "next";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import HeroSection from "@/components/HeroSection";
import TrustMarquee from "@/components/TrustMarquee";
import EmeraldTouchSection from "@/components/EmeraldTouchSection";
import ClassicsSection from "@/components/ClassicsSection";
import ManifestoSection from "@/components/ManifestoSection";
import RelatedLinks from "@/components/RelatedLinks";
import EmeraldCircleSection from "@/components/EmeraldCircleSection";

interface SeoSettings {
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
}

const SUPABASE_ASSETS = "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset";
const DEFAULT_OG_IMAGE = `${SUPABASE_ASSETS}/logo/og-image.jpg`;

const defaultSeo: Required<SeoSettings> = {
  meta_title: "Emeraldress | Abbigliamento Sostenibile di Lusso e Fibra Riciclata",
  meta_description:
    "Scopri l'esclusiva collezione Emeraldress: abiti da sera e pret-a-porter realizzati in Italia con tessuti sostenibili rigenerati e design minimalista.",
  og_image_url: DEFAULT_OG_IMAGE,
};

async function getSeo(): Promise<Required<SeoSettings>> {
  try {
    const supabase = createSupabasePublicClient();
    const { data } = await supabase
      .from("app_settings")
      .select("seo_settings")
      .eq("id", 1)
      .maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (data as any)?.seo_settings;
    const s = (raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}) as SeoSettings;
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
  const ogImage = seo.og_image_url || DEFAULT_OG_IMAGE;
  return {
    // `absolute` disattiva il template "%s | EMERALDRESS" del root layout
    // (il brand è già presente nel titolo configurato).
    title: { absolute: seo.meta_title },
    description: seo.meta_description,
    alternates: {
      canonical: "/",
      languages: { "it-IT": "/", "x-default": "/" },
    },
    openGraph: {
      title: seo.meta_title,
      description: seo.meta_description,
      url: "/",
      type: "website",
      locale: "it_IT",
      siteName: "Emeraldress",
      images: [{ url: ogImage, width: 1216, height: 640, alt: "Emeraldress — Lusso Sostenibile" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.meta_title,
      description: seo.meta_description,
      images: [ogImage],
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
          { to: "/chi-siamo", label: "Chi Siamo", desc: "Vision, mission e filiera 100% Made in Italy.", eyebrow: "Manifesto" },
        ]}
      />
      <EmeraldCircleSection />
    </main>
  );
}
