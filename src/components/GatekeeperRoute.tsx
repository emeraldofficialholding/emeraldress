import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/supabaseCustom";
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
    // Public routes always allowed — no check needed
    if (isPublic) {
      setStatus("allowed");
      return;
    }

    let isMounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

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

    const initialize = async () => {
      try {
        // 1. Get current session first
        const { data: { session } } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (!session?.user) {
          setStatus("blocked");
          return;
        }

        // 2. Verify admin role server-side
        const isAdmin = await checkAdminRole(session.user.id);
        if (isMounted) setStatus(isAdmin ? "allowed" : "blocked");
      } catch {
        if (isMounted) setStatus("blocked");
      }
    };

    // 3. Listen for real-time auth changes (login/logout while on page)
    const { data: authData } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (!session?.user) {
        setStatus("blocked");
        return;
      }

      // Re-check role on every auth state change
      const isAdmin = await checkAdminRole(session.user.id);
      if (isMounted) setStatus(isAdmin ? "allowed" : "blocked");
    });

    subscription = authData.subscription;

    // Run initial check
    initialize();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [location.pathname, isPublic]);

  // Always block while loading (never flash content)
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
