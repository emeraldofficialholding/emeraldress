import type { Metadata } from "next";
import { CollezioniClient } from "./collezioni-client";

export const metadata: Metadata = {
  title: "Le Collezioni",
  description:
    "Esplora le collezioni Emeraldress: abbigliamento luxury sostenibile in fibra riciclata, manifattura italiana.",
  alternates: { canonical: "/collezioni" },
  openGraph: {
    title: "Le Collezioni | Emeraldress",
    description: "Abiti luxury italiani con tessuti sostenibili rigenerati. Scopri Emerald Touch.",
    url: "/collezioni",
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.emeraldress.com/" },
    { "@type": "ListItem", position: 2, name: "Collezioni", item: "https://www.emeraldress.com/collezioni" },
  ],
};

export default function CollezioniPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CollezioniClient />
    </>
  );
}
