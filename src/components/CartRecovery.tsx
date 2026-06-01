"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

// Storage key allineato con CartContext (vedi src/contexts/CartContext.tsx).
const STORAGE_KEY = "emeraldress-cart-v1";

/**
 * Intercetta `?recover=<token>` nell'URL, fetcha il carrello salvato da
 * /api/cart-recovery, lo scrive in localStorage e ricarica la pagina cosi'
 * CartContext si re-idrata (apre il drawer al ritorno via `?cart=open`).
 *
 * Triggerato dal link nelle email di recupero abbandoni Stripe.
 */
export function CartRecovery() {
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("recover");
    if (!token) return;
    handled.current = true;

    (async () => {
      try {
        const res = await fetch(`/api/cart-recovery?token=${encodeURIComponent(token)}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          // Pulisce comunque il param dall'URL.
          cleanUrl();
          return;
        }
        const data = (await res.json()) as {
          converted?: boolean;
          items?: unknown[];
        };
        if (data.converted) {
          toast.info("Questo ordine è già stato completato. Esplora le nuove arrivate.");
          cleanUrl();
          return;
        }
        if (!Array.isArray(data.items) || data.items.length === 0) {
          toast.error("Il carrello recuperato è vuoto o non più disponibile.");
          cleanUrl();
          return;
        }
        // Riscriviamo localStorage: il provider del cart legge da li' al mount.
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.items));
        } catch {
          // quota / privacy mode
        }
        // Reload con il drawer auto-aperto via flag effimero.
        cleanUrl(true);
      } catch {
        cleanUrl();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function cleanUrl(openCart = false) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("recover");
  if (openCart) url.searchParams.set("cart", "open");
  window.history.replaceState({}, "", url.toString());
  if (openCart) {
    // Hard reload cosi' il cart context legge i nuovi item da localStorage
    // (lo state init avviene solo al mount).
    window.location.reload();
  }
}
