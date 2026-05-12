import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const SITE_URL = "https://www.emeraldress.com";

const STATIC_URLS: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
  { url: `${SITE_URL}/collezioni`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${SITE_URL}/sostenibilita`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${SITE_URL}/chi-siamo`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${SITE_URL}/emeraldscanner`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${SITE_URL}/resi`, changeFrequency: "yearly", priority: 0.4 },
  { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.4 },
  { url: `${SITE_URL}/termini`, changeFrequency: "yearly", priority: 0.4 },
];

export const revalidate = 3600; // 1h

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: products } = await supabase
      .from("products")
      .select("id, slug, created_at, status")
      .neq("status", "draft");

    const productEntries: MetadataRoute.Sitemap = ((products as Array<{
      id: string;
      slug: string | null;
      created_at: string;
      status: string;
    }>) ?? []).map((p) => ({
      url: `${SITE_URL}/product/${p.slug ?? p.id}`,
      lastModified: new Date(p.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...STATIC_URLS, ...productEntries];
  } catch {
    return STATIC_URLS;
  }
}
