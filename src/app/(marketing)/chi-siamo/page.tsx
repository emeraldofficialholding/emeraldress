import type { Metadata } from "next";
import { ChiSiamoClient } from "./chi-siamo-client";

export const metadata: Metadata = {
  title: "Il Manifesto | L'Etica di Emeraldress",
  description:
    "Il manifesto Emeraldress: scopri la nostra visione di lusso consapevole, filiera etica e manifattura italiana.",
  alternates: { canonical: "/chi-siamo" },
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
