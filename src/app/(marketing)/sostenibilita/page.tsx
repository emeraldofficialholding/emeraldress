import type { Metadata } from "next";
import { SostenibilitaClient } from "./sostenibilita-client";

const SUPABASE_ASSETS = "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset";
const DEFAULT_OG_IMAGE = `${SUPABASE_ASSETS}/logo/og-image.jpg`;

export const metadata: Metadata = {
  title: "Sostenibilità e Tessuti Innovativi",
  description:
    "Scopri ECONYL® e la fibra rigenerata Emeraldress: come reti da pesca e scarti tessili tornano filato luxury, riducendo drasticamente l'impatto ambientale.",
  alternates: {
    canonical: "/sostenibilita",
    languages: { "it-IT": "/sostenibilita", "x-default": "/sostenibilita" },
  },
  openGraph: {
    title: "Sostenibilità e Tessuti Innovativi | Emeraldress",
    description:
      "Fibra rigenerata ECONYL®, scomposizione molecolare e packaging riutilizzabile: il lusso responsabile di Emeraldress.",
    url: "/sostenibilita",
    type: "article",
    locale: "it_IT",
    siteName: "Emeraldress",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1216, height: 640, alt: "Emeraldress — Sostenibilità" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sostenibilità e Tessuti Innovativi | Emeraldress",
    description: "Fibra rigenerata ECONYL® e packaging riutilizzabile. Il lusso responsabile.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Sostenibilità e Tessuti Innovativi — Emeraldress",
  description:
    "La fibra rigenerata ECONYL® e il processo di trasformazione molecolare alla base della collezione Emerald Touch.",
  url: "https://www.emeraldress.com/sostenibilita",
  author: { "@type": "Organization", name: "Emeraldress" },
  publisher: {
    "@type": "Organization",
    name: "Emeraldress",
    logo: {
      "@type": "ImageObject",
      url: "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-icon-ed.svg",
    },
  },
};

export default function SostenibilitaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <SostenibilitaClient />
    </>
  );
}
