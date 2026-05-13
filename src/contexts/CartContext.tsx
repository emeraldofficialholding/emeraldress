"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  /** Stable cart line ID (productId + size) — usata come chiave React e per update/remove. */
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  /** Prezzo unitario in EUR (con eventuale sale_price gia' risolto). */
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  /** Aggiunge o incrementa (se stesso productId+size esiste). */
  addItem: (item: Omit<CartItem, "lineId" | "quantity">, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  /** Open state del drawer, gestito dal provider per essere triggerabile da ovunque. */
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "emeraldress-cart-v1";

const readLocal = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        typeof i === "object" &&
        i !== null &&
        typeof i.productId === "string" &&
        typeof i.size === "string" &&
        typeof i.quantity === "number" &&
        i.quantity > 0,
    );
  } catch {
    return [];
  }
};

const writeLocal = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
};

const makeLineId = (productId: string, size: string) => `${productId}::${size}`;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => readLocal());
  const [isOpen, setIsOpen] = useState(false);

  // Sync localStorage on changes
  useEffect(() => {
    writeLocal(items);
  }, [items]);

  // Cross-tab sync (se cambia in un'altra tab del browser)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readLocal());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback<CartContextValue["addItem"]>(
    (item, quantity = 1) => {
      const lineId = makeLineId(item.productId, item.size);
      setItems((prev) => {
        const existing = prev.find((p) => p.lineId === lineId);
        if (existing) {
          return prev.map((p) =>
            p.lineId === lineId ? { ...p, quantity: p.quantity + quantity } : p,
          );
        }
        return [...prev, { ...item, lineId, quantity }];
      });
    },
    [],
  );

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((p) => p.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((p) => p.lineId !== lineId);
      return prev.map((p) => (p.lineId === lineId ? { ...p, quantity } : p));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [items],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
