"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, X, ChevronUp } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useWishlist } from "@/contexts/WishlistContext";
import { AuthDialog } from "./AuthDialog";
import type { Product } from "@/hooks/useProducts";

interface FullscreenProductViewerProps {
  product: Product;
  /** Qualsiasi uscita (X, swipe, tap titolo) chiude il viewer e naviga a /product/[slug]. */
  onClose: () => void;
  /** Chiusura silenziosa (solo per casi controllati come l'apertura di AuthDialog). */
  onDismiss: () => void;
}

const supabase = getSupabaseBrowserClient();

export default function FullscreenProductViewer({
  product,
  onClose,
  onDismiss,
}: FullscreenProductViewerProps) {
  const router = useRouter();
  const { addItem, removeItem, hasItem } = useWishlist();
  const [authOpen, setAuthOpen] = useState(false);
  const [hasUser, setHasUser] = useState<boolean | null>(null);
  const liked = hasItem(product.id);
  const productHref = `/product/${product.slug ?? product.id}`;
  const cover = product.images?.[0] ?? "";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasUser(!!data.session?.user));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const toggleLike = () => {
    if (liked) {
      removeItem(product.id);
      return;
    }
    if (hasUser === false) {
      setAuthOpen(true);
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: cover,
    });
  };

  const buy = () => {
    router.push(productHref);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="fs-viewer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] bg-black lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label={`Anteprima ${product.name}`}
      >
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.5}
          onDragEnd={(_, info) => {
            if (info.offset.y > 120) onClose();
          }}
          className="absolute inset-0 flex items-center justify-center touch-pan-y"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={product.name}
            className="max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none"
            draggable={false}
          />
        </motion.div>

        {/* Top gradient + close */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <button
          onClick={onClose}
          aria-label="Apri scheda prodotto"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition"
        >
          <X size={18} />
        </button>

        {/* Bottom info + actions */}
        <div className="absolute inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)] bg-gradient-to-t from-black/85 via-black/50 to-transparent pt-12">
          <div className="px-5 pb-5">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-white/70 text-[10px] tracking-[0.25em] uppercase mb-3 active:text-white"
            >
              <ChevronUp size={14} />
              Apri scheda prodotto
            </button>

            <div className="flex items-end justify-between gap-4">
              <button
                onClick={onClose}
                className="flex-1 text-left min-w-0"
              >
                <h2
                  className="text-white text-xl truncate"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  {product.name}
                </h2>
                <p className="text-white/80 text-sm mt-1">€ {Number(product.price).toFixed(2)}</p>
              </button>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={toggleLike}
                  aria-label={liked ? "Rimuovi dalla wishlist" : "Aggiungi alla wishlist"}
                  className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
                    liked
                      ? "bg-rose-500/95 text-white"
                      : "bg-white/15 text-white border border-white/25"
                  }`}
                >
                  <Heart size={20} fill={liked ? "currentColor" : "none"} strokeWidth={liked ? 0 : 2} />
                </button>
                <button
                  onClick={buy}
                  aria-label="Vai alla scheda prodotto per acquistare"
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-emerald-950 active:scale-90 transition-all shadow-lg"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Drag handle hint */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/40 pointer-events-none" />
      </motion.div>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        returnTo={productHref}
        title="Salva nel tuo Circle"
        subtitle="Accedi per salvare questo capo nella tua wishlist e ritrovarlo nell'area personale."
        onAuthenticated={() => {
          // dopo login, aggiungi davvero
          addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: cover,
          });
          setHasUser(true);
        }}
      />
    </AnimatePresence>
  );
}
