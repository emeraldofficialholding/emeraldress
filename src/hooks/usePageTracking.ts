"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function getVisitorId(): string {
  const key = "emerald_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function usePageTracking() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return;

    const visitorId = getVisitorId();
    const supabase = getSupabaseBrowserClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("site_analytics") as any)
      .insert({
        page_path: pathname,
        visitor_id: visitorId,
      })
      // Log error in console invece di silenziare: ci permette di debuggare
      // problemi RLS / network. Non interrompe l'UX (insert è fire-and-forget).
      .then((res: { error: unknown }) => {
        if (res?.error) {
          // eslint-disable-next-line no-console
          console.warn("[pageTracking] insert failed:", res.error);
        }
      });
  }, [pathname]);
}
