import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/external-client";

export interface WishlistItem {
  id: string;        // product_id
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const STORAGE_KEY = "emeraldress-wishlist";

const readLocal = (): WishlistItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};
const writeLocal = (items: WishlistItem[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
};

const fetchProductMeta = async (productIds: string[]): Promise<WishlistItem[]> => {
  if (productIds.length === 0) return [];
  const { data } = await supabase
    .from("products")
    .select("id, name, price, sale_price, images")
    .in("id", productIds);
  return ((data as any[]) ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.sale_price ?? p.price ?? 0),
    image: Array.isArray(p.images) && p.images[0] ? p.images[0] : "",
  }));
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>(() => readLocal());
  const [userId, setUserId] = useState<string | null>(null);
  const mergedRef = useRef(false);

  // Load DB wishlist on auth + merge any local items
  const loadFromDb = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", uid);
    const productIds = ((data as any[]) ?? []).map((r) => r.product_id);
    const meta = await fetchProductMeta(productIds);
    setItems(meta);
  }, []);

  const mergeLocalIntoDb = useCallback(async (uid: string) => {
    if (mergedRef.current) return;
    mergedRef.current = true;
    const local = readLocal();
    if (local.length > 0) {
      const rows = local.map((it) => ({ user_id: uid, product_id: it.id }));
      await supabase.from("wishlists").upsert(rows, { onConflict: "user_id,product_id" } as any);
      writeLocal([]);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      if (session?.user) {
        setUserId(session.user.id);
        await mergeLocalIntoDb(session.user.id);
        await loadFromDb(session.user.id);
      }
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserId(session.user.id);
        await mergeLocalIntoDb(session.user.id);
        await loadFromDb(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUserId(null);
        mergedRef.current = false;
        setItems(readLocal());
      }
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [loadFromDb, mergeLocalIntoDb]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      const next = [...prev, item];
      if (userId) {
        supabase.from("wishlists")
          .insert({ user_id: userId, product_id: item.id })
          .then(({ error }) => { if (error && error.code !== "23505") console.error(error); });
      } else {
        writeLocal(next);
      }
      return next;
    });
  }, [userId]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      if (userId) {
        supabase.from("wishlists")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", id)
          .then(({ error }) => { if (error) console.error(error); });
      } else {
        writeLocal(next);
      }
      return next;
    });
  }, [userId]);

  const hasItem = useCallback((id: string) => items.some((i) => i.id === id), [items]);
  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, hasItem, totalItems }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
