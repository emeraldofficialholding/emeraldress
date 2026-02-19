import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import GemLoader from "@/components/GemLoader";

// Routes accessible to everyone (no auth required)
const PUBLIC_ROUTES = ["/coming-soon", "/login", "/admin"];

export default function GatekeeperRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "allowed" | "blocked">("loading");

  const isPublic = PUBLIC_ROUTES.some(
    (r) => location.pathname === r || location.pathname.startsWith(r + "/")
  );

  useEffect(() => {
    if (isPublic) {
      setStatus("allowed");
      return;
    }

    let isMounted = true;

    const checkAdminRole = async (userId: string): Promise<boolean> => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();
        if (error) return false;
        return !!data;
      } catch {
        return false;
      }
    };

    // Use onAuthStateChange as the single source of truth.
    // It fires immediately with INITIAL_SESSION, so no separate getSession() needed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (!session?.user) {
        setStatus("blocked");
        return;
      }

      const isAdmin = await checkAdminRole(session.user.id);
      if (isMounted) setStatus(isAdmin ? "allowed" : "blocked");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [location.pathname, isPublic]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#e4ffec] flex items-center justify-center">
        <GemLoader />
      </div>
    );
  }

  if (status === "blocked") {
    return <Navigate to="/coming-soon" replace />;
  }

  return <>{children}</>;
}

