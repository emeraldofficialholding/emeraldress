import type { Metadata } from "next";
import { SostenibilitaClient } from "./sostenibilita-client";

export const metadata: Metadata = {
  title: "Sostenibilità e Tessuti Innovativi",
  description:
    "Scopri i tessuti rigenerati e il ciclo virtuoso della moda sostenibile Emeraldress.",
  alternates: { canonical: "/sostenibilita" },
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
