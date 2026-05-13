"use client";

import { useCallback, useEffect, useState } from "react";

export interface RecentlyViewedSnapshot {
  id: string;
  slug: string | null;
  name: string;
  image: string;
  price: number;
  viewedAt: number;
}

const STORAGE_KEY = "emeraldress_recently_viewed";
const MAX_ITEMS = 8;
const UPDATE_EVENT = "emeraldress:recently-viewed-updated";

function readStorage(): RecentlyViewedSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is RecentlyViewedSnapshot =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.image === "string" &&
        typeof item.price === "number",
    );
  } catch {
    return [];
  }
}

function writeStorage(items: RecentlyViewedSnapshot[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  } catch {
    // Quota / privacy mode — ignore silently
  }
}

export function useRecentlyViewed(excludeId?: string) {
  const [products, setProducts] = useState<RecentlyViewedSnapshot[]>([]);

  useEffect(() => {
    // Hydrate da localStorage post-mount (SSR-safe).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProducts(readStorage());
    const sync = () => setProducts(readStorage());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync();
    };
    window.addEventListener(UPDATE_EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(UPDATE_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const addProduct = useCallback(
    (snapshot: Omit<RecentlyViewedSnapshot, "viewedAt">) => {
      const current = readStorage().filter((p) => p.id !== snapshot.id);
      const next = [{ ...snapshot, viewedAt: Date.now() }, ...current].slice(0, MAX_ITEMS);
      writeStorage(next);
    },
    [],
  );

  const removeProduct = useCallback((id: string) => {
    const next = readStorage().filter((p) => p.id !== id);
    writeStorage(next);
  }, []);

  const clear = useCallback(() => {
    writeStorage([]);
  }, []);

  const filtered = excludeId ? products.filter((p) => p.id !== excludeId) : products;

  return { products: filtered, addProduct, removeProduct, clear };
}
