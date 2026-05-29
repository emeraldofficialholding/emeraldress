import type { Metadata } from "next";
import { ChiSiamoClient } from "./chi-siamo-client";

const SUPABASE_ASSETS = "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset";
const DEFAULT_OG_IMAGE = `${SUPABASE_ASSETS}/logo/og-image.jpg`;

export const metadata: Metadata = {
  title: "Il Manifesto | L'Etica di Emeraldress",
  description:
    "Il manifesto Emeraldress: scopri la nostra visione di lusso consapevole, filiera etica e manifattura italiana dalla Costa Smeralda.",
  alternates: {
    canonical: "/chi-siamo",
    languages: { "it-IT": "/chi-siamo", "x-default": "/chi-siamo" },
  },
  openGraph: {
    title: "Chi Siamo | Emeraldress",
    description: "Vision, mission e filiera 100% Made in Italy del brand luxury sostenibile.",
    url: "/chi-siamo",
    type: "article",
    locale: "it_IT",
    siteName: "Emeraldress",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1216, height: 640, alt: "Emeraldress — Chi Siamo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chi Siamo | Emeraldress",
    description: "Vision, mission e filiera 100% Made in Italy.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Chi Siamo — Emeraldress",
  description:
    "Storia, vision, mission e filiera 100% Made in Italy di Emeraldress, brand di moda sostenibile dalla Costa Smeralda.",
  url: "https://www.emeraldress.com/chi-siamo",
  about: {
    "@type": "Organization",
    name: "Emeraldress",
    founder: { "@type": "Person", name: "Noemy Alba" },
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Porto Cervo",
        addressRegion: "Sardegna",
        addressCountry: "IT",
      },
    },
  },
};

export default function ChiSiamoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ChiSiamoClient />
    </>
  );
}
