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

    const checkAdminRole = async (userId: string) => {
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();
        if (isMounted) setStatus(data ? "allowed" : "blocked");
      } catch {
        if (isMounted) setStatus("blocked");
      }
    };

    // Listen for real-time auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          // Dispatch after callback to avoid deadlock
          setTimeout(() => checkAdminRole(session.user.id), 0);
        } else {
          setStatus("blocked");
        }
      }
    );

    // Initial check — controls first load
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        if (session?.user) {
          await checkAdminRole(session.user.id);
        } else {
          setStatus("blocked");
        }
      } catch {
        if (isMounted) setStatus("blocked");
      }
    };

    initializeAuth();

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
