import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import GatekeeperRoute from "@/components/GatekeeperRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import PromoBanner from "@/components/PromoBanner";
import { usePageTracking } from "@/hooks/usePageTracking";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import EmeraldScanner from "./pages/EmeraldScanner";
import Collezioni from "./pages/Collezioni";
import ChiSiamo from "./pages/ChiSiamo";
import Sostenibilita from "./pages/Sostenibilita";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import ComingSoon from "./pages/ComingSoon";
import Login from "./pages/Login";
import Profilo from "./pages/Profilo";

const queryClient = new QueryClient();

// Routes that should NOT show the Navbar/Footer (standalone pages)
const STANDALONE_ROUTES = ["/coming-soon", "/login", "/admin"];
const NO_FOOTER_ROUTES = ["/profilo"];

function AppShell() {
  const location = useLocation();
  const isStandalone = STANDALONE_ROUTES.some(
    (r) => location.pathname === r || location.pathname.startsWith(r + "/")
  );

  // Track page views
  usePageTracking();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <CartProvider>
      <WishlistProvider>
      {!isStandalone && <PromoBanner />}
      {!isStandalone && <Navbar />}
      {!isStandalone && <CartSheet />}
      <Routes>
        {/* ── Public / always accessible ─────────────────────────── */}
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profilo" element={<Profilo />} />

        {/* ── Gated routes (admin only while coming soon is active) ── */}
        <Route path="/" element={<GatekeeperRoute><Index /></GatekeeperRoute>} />
        <Route path="/collezioni" element={<GatekeeperRoute><Collezioni /></GatekeeperRoute>} />
        <Route path="/chisiamo" element={<GatekeeperRoute><ChiSiamo /></GatekeeperRoute>} />
        <Route path="/sostenibilita" element={<GatekeeperRoute><Sostenibilita /></GatekeeperRoute>} />
        <Route path="/emeraldscanner" element={<GatekeeperRoute><EmeraldScanner /></GatekeeperRoute>} />
        <Route path="/product/:id" element={<GatekeeperRoute><ProductDetail /></GatekeeperRoute>} />
        <Route path="*" element={<GatekeeperRoute><NotFound /></GatekeeperRoute>} />
      </Routes>
      {!isStandalone && <Footer />}
      </WishlistProvider>
    </CartProvider>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <AppShell />
          </ErrorBoundary>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
