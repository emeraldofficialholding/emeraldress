import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { Product } from "@/hooks/useProducts";
import { ProductDetailClient } from "./product-detail-client";

export const revalidate = 60; // ISR 60s

interface PageProps {
  params: Promise<{ slug: string }>;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getProduct(slugOrId: string): Promise<Product | null> {
  const supabase = createSupabasePublicClient();
  // postgrest fa fail su .or(`id.eq.<non-uuid>`) perche' id e' uuid:
  // splittiamo la query in due passi e teniamo solo slug se non e' un UUID.
  const looksLikeUuid = UUID_RE.test(slugOrId);
  const query = supabase.from("products").select("*");
  const { data } = looksLikeUuid
    ? await query.or(`slug.eq.${slugOrId},id.eq.${slugOrId}`).maybeSingle()
    : await query.eq("slug", slugOrId).maybeSingle();
  if (!data) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = data as any;
  const rawImages = Array.isArray(p.images) ? p.images.flat(Infinity) : [];
  return {
    ...p,
    images: rawImages.filter((u: unknown): u is string => typeof u === "string"),
    sizes: Array.isArray(p.sizes) ? p.sizes : p.sizes ? [p.sizes] : [],
  } as Product;
}

export async function generateStaticParams() {
  try {
    const supabase = createSupabasePublicClient();
    const { data } = await supabase.from("products").select("slug, id");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data as any[]) ?? []).map((p) => ({ slug: (p.slug as string) ?? (p.id as string) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return { title: "Prodotto non trovato", robots: { index: false, follow: false } };
  }
  const image = product.images[0];
  const description =
    product.description ??
    `${product.name} — Abbigliamento sostenibile di lusso, manifattura italiana Emeraldress.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug ?? product.id}` },
    openGraph: {
      title: `${product.name} | Emeraldress`,
      description,
      url: `/product/${product.slug ?? product.id}`,
      type: "website",
      ...(image && { images: [{ url: image, width: 1200, height: 1600, alt: product.name }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Emeraldress`,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const productUrl = `https://www.emeraldress.com/product/${product.slug ?? product.id}`;
  const image = product.images[0] ?? "";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image,
    sku: product.id,
    brand: { "@type": "Brand", name: "Emeraldress" },
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: Number(product.price).toFixed(2),
      priceCurrency: "EUR",
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.emeraldress.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collezioni",
        item: "https://www.emeraldress.com/collezioni",
      },
      { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
