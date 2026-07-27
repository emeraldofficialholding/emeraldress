"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getEffectivePrice } from "@/lib/pricing";

export interface WishlistItem {
  id: string; // product_id
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
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};
const writeLocal = (items: WishlistItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = getSupabaseBrowserClient();
  const [items, setItems] = useState<WishlistItem[]>(() => readLocal());
  const [userId, setUserId] = useState<string | null>(null);
  const mergedRef = useRef(false);

  const fetchProductMeta = useCallback(
    async (productIds: string[]): Promise<WishlistItem[]> => {
      if (productIds.length === 0) return [];
      const { data } = await supabase
        .from("products")
        .select("id, name, price, sale_price, images")
        .in("id", productIds);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((data as any[]) ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        price: getEffectivePrice(p.price, p.sale_price),
        image: Array.isArray(p.images) && p.images[0] ? p.images[0] : "",
      }));
    },
    [supabase],
  );

  const loadFromDb = useCallback(
    async (uid: string) => {
      const { data } = await supabase.from("wishlists").select("product_id").eq("user_id", uid);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productIds = ((data as any[]) ?? []).map((r) => r.product_id);
      const meta = await fetchProductMeta(productIds);
      setItems(meta);
    },
    [supabase, fetchProductMeta],
  );

  const mergeLocalIntoDb = useCallback(
    async (uid: string) => {
      if (mergedRef.current) return;
      mergedRef.current = true;
      const local = readLocal();
      if (local.length > 0) {
        const rows = local.map((it) => ({ user_id: uid, product_id: it.id }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("wishlists") as any).upsert(rows, { onConflict: "user_id,product_id" });
        writeLocal([]);
      }
    },
    [supabase],
  );

  useEffect(() => {
    let active = true;
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;
      if (session?.user) {
        setUserId(session.user.id);
        await mergeLocalIntoDb(session.user.id);
        await loadFromDb(session.user.id);
      }
    };
    void init();
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
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, loadFromDb, mergeLocalIntoDb]);

  const addItem = useCallback(
    (item: WishlistItem) => {
      setItems((prev) => {
        if (prev.find((i) => i.id === item.id)) return prev;
        const next = [...prev, item];
        if (userId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          void (supabase.from("wishlists") as any)
            .insert({ user_id: userId, product_id: item.id })
            .then(({ error }: { error: { code?: string } | null }) => {
              if (error && error.code !== "23505") console.error(error);
            });
        } else {
          writeLocal(next);
        }
        return next;
      });
    },
    [supabase, userId],
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        if (userId) {
          void supabase
            .from("wishlists")
            .delete()
            .eq("user_id", userId)
            .eq("product_id", id)
            .then(({ error }) => {
              if (error) console.error(error);
            });
        } else {
          writeLocal(next);
        }
        return next;
      });
    },
    [supabase, userId],
  );

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
