import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import GatekeeperRoute from "@/components/GatekeeperRoute";
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

const queryClient = new QueryClient();

// Routes that should NOT show the Navbar/Footer (standalone pages)
const STANDALONE_ROUTES = ["/coming-soon", "/login"];

function AppShell() {
  const location = useLocation();
  const isStandalone = STANDALONE_ROUTES.some(
    (r) => location.pathname === r || location.pathname.startsWith(r + "/")
  );

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <CartProvider>
      {!isStandalone && <Navbar />}
      {!isStandalone && <CartSheet />}
      <Routes>
        {/* ── Public / always accessible ─────────────────────────── */}
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />

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
    </CartProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
