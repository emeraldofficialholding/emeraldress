import type { Metadata } from "next";
import { CollezioniClient } from "./collezioni-client";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { Product } from "@/hooks/useProducts";

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

// ISR: rigenera la pagina ogni 60 secondi, in modo che modifiche
// stock/prodotti dall'admin appaiano entro 1 minuto senza redeploy.
// In più ogni navigazione del cliente non rifa la query Supabase: serve
// l'HTML già-generato (super veloce, SEO-ok).
export const revalidate = 60;

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.emeraldress.com/" },
    { "@type": "ListItem", position: 2, name: "Collezioni", item: "https://www.emeraldress.com/collezioni" },
  ],
};

/**
 * Server Component: fa il fetch dei prodotti lato server con anon key + RLS
 * pubblica, e passa i dati come `initialProducts` al Client Component.
 *
 * Effetti:
 * - L'HTML iniziale contiene già i prodotti (no loader "Caricamento")
 * - Google/Meta/ChatGPT vedono il contenuto reale
 * - LCP migliorato (immagini prodotto già nell'HTML)
 * - Niente flash del loader al primo paint
 */
async function fetchInitialProducts(): Promise<Product[]> {
  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[collezioni SSR] fetch products error:", error);
      return [];
    }
    // Normalizzazione identica a useProducts.normalizeProduct
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data as Record<string, unknown>[]) ?? []).map((p: any) => {
      const rawImages = Array.isArray(p.images) ? (p.images as unknown[]).flat(Infinity) : [];
      const images = rawImages.filter((u): u is string => typeof u === "string");
      const sizes = Array.isArray(p.sizes) ? p.sizes : p.sizes ? [p.sizes] : [];
      return { ...p, images, sizes } as Product;
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[collezioni SSR] fetch exception:", e);
    return [];
  }
}

export default async function CollezioniPage() {
  const initialProducts = await fetchInitialProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CollezioniClient initialProducts={initialProducts} />
    </>
  );
}
