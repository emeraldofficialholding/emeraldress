import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabaseCustom";

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
  created_at: string;
}

export const useProducts = (category?: string) =>
  useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase.from("products").select("*");
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!id,
  });
