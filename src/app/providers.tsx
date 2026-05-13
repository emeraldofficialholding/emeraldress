"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CartProvider } from "@/contexts/CartContext";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WishlistProvider>
          <CartProvider>
            {children}
            <SonnerToaster position="top-center" richColors closeButton />
          </CartProvider>
        </WishlistProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
