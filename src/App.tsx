import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import EmeraldScanner from "./pages/EmeraldScanner";
import Collezioni from "./pages/Collezioni";
import ChiSiamo from "./pages/ChiSiamo";
import Sostenibilita from "./pages/Sostenibilita";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <Navbar />
          <CartSheet />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/collezioni" element={<Collezioni />} />
            <Route path="/chisiamo" element={<ChiSiamo />} />
            <Route path="/sostenibilita" element={<Sostenibilita />} />
            <Route path="/emeraldscanner" element={<EmeraldScanner />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
