import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  const location = useLocation();

  useEffect(() => {
    // Skip admin routes
    if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/login")) return;

    const visitorId = getVisitorId();
    supabase
      .from("site_analytics" as any)
      .insert({ page_path: location.pathname, visitor_id: visitorId } as any)
      .then();
  }, [location.pathname]);
}
