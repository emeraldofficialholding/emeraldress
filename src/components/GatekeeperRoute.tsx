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

    // Phase 1: initial session check controls the loading state
    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (!session?.user) {
          setStatus("blocked");
          return;
        }

        const isAdmin = await checkAdminRole(session.user.id);
        if (isMounted) setStatus(isAdmin ? "allowed" : "blocked");
      } catch {
        if (isMounted) setStatus("blocked");
      }
    };

    initialize();

    // Phase 2: react to subsequent auth changes (login/logout)
    // Use setTimeout to avoid deadlocking the Supabase SDK with async calls inside the callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (!session?.user) {
        setStatus("blocked");
        return;
      }

      // Dispatch async role check AFTER the callback returns
      setTimeout(async () => {
        if (!isMounted) return;
        const isAdmin = await checkAdminRole(session.user.id);
        if (isMounted) setStatus(isAdmin ? "allowed" : "blocked");
      }, 0);
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
