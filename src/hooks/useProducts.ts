"use client";

import { useQuery } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function normalizeProduct(p: Record<string, unknown>) {
  const rawImages = Array.isArray(p.images) ? (p.images as unknown[]).flat(Infinity) : [];
  const images = rawImages.filter((u): u is string => typeof u === "string");
  const sizes = Array.isArray(p.sizes) ? p.sizes : p.sizes ? [p.sizes] : [];
  return { ...p, images, sizes };
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  images: string[];
  sizes: string[] | null;
  fabric_details: string | null;
  shipping_info: string | null;
  stock: number;
  /** Stock per ogni taglia, es. `{"XS/S": 4, "S/M": 3, "M/L": 3}`. La colonna `stock` totale è auto-sincronizzata da trigger DB. */
  stock_by_size: Record<string, number>;
  created_at: string;
  slug?: string | null;
  stripe_payment_link?: string | null;
}

export const useProducts = (
  category?: string,
  options?: { initialData?: Product[] },
) =>
  useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      let query = supabase.from("products").select("*");
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return ((data as Record<string, unknown>[]) || []).map(normalizeProduct) as unknown as Product[];
    },
    initialData: options?.initialData,
    // Se passiamo initialData (da SSR), evitiamo refetch al mount: i dati
    // sono freschi appena renderizzati. Refetch automatico dopo 1 min.
    staleTime: options?.initialData ? 60_000 : 0,
  });

export const useProduct = (idOrSlug: string) =>
  useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return normalizeProduct(data as Record<string, unknown>) as unknown as Product;
    },
    enabled: !!idOrSlug,
  });
