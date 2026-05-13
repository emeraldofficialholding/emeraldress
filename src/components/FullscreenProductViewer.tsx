"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Heart, ShoppingBag, X, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useWishlist } from "@/contexts/WishlistContext";
import { AuthDialog } from "./AuthDialog";
import type { Product } from "@/hooks/useProducts";

interface FullscreenProductViewerProps {
  /** Lista di prodotti tra cui scorrere (deve includere quello iniziale). */
  products?: Product[];
  /** Indice del prodotto iniziale dentro `products`. Se products non passato, usa solo `product`. */
  initialIndex?: number;
  /** Fallback: singolo prodotto (retrocompatibilità). */
  product?: Product;
  /** Chiusura silenziosa del viewer. */
  onDismiss: () => void;
  /** @deprecated kept for backwards compat with ProductCard. */
  onClose?: () => void;
}

const supabase = getSupabaseBrowserClient();

const SWIPE_THRESHOLD_X = 60;
const SWIPE_THRESHOLD_Y = 90;

export default function FullscreenProductViewer({
  products,
  initialIndex = 0,
  product: singleProduct,
  onDismiss,
}: FullscreenProductViewerProps) {
  const router = useRouter();
  const { addItem, removeItem, hasItem } = useWishlist();

  const list: Product[] = useMemo(() => {
    if (products && products.length > 0) return products;
    if (singleProduct) return [singleProduct];
    return [];
  }, [products, singleProduct]);

  const [index, setIndex] = useState(() => {
    const safe = Math.max(0, Math.min(initialIndex, list.length - 1));
    return safe;
  });
  const [direction, setDirection] = useState<1 | -1>(1);
  const [authOpen, setAuthOpen] = useState(false);
  const [hasUser, setHasUser] = useState<boolean | null>(null);

  const product = list[index];
  const liked = product ? hasItem(product.id) : false;
  const productHref = product ? `/product/${product.slug ?? product.id}` : "/";
  const cover = product?.images?.[0] ?? "";

  // Drag motion values per feedback visivo (immagine si muove durante swipe)
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const overlayOpacity = useTransform(dragY, [-180, 0, 180], [0.85, 0, 0.85]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasUser(!!data.session?.user));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Reset drag values al cambio prodotto
  useEffect(() => {
    dragX.set(0);
    dragY.set(0);
  }, [index, dragX, dragY]);

  const canPrev = list.length > 1;
  const canNext = list.length > 1;

  const goPrev = () => {
    if (!canPrev) return;
    setDirection(-1);
    setIndex((i) => (i - 1 + list.length) % list.length);
  };

  const goNext = () => {
    if (!canNext) return;
    setDirection(1);
    setIndex((i) => (i + 1) % list.length);
  };

  const openDetail = () => {
    router.push(productHref);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    const absX = Math.abs(offset.x);
    const absY = Math.abs(offset.y);

    // Direzione dominante
    if (absX > absY) {
      // Swipe orizzontale → prev/next
      if (offset.x < -SWIPE_THRESHOLD_X || velocity.x < -400) {
        goNext();
      } else if (offset.x > SWIPE_THRESHOLD_X || velocity.x > 400) {
        goPrev();
      }
    } else {
      // Swipe verticale → entra nel dettaglio (qualsiasi direzione, su o giù)
      if (absY > SWIPE_THRESHOLD_Y || Math.abs(velocity.y) > 500) {
        openDetail();
      }
    }
  };

  const toggleLike = () => {
    if (!product) return;
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

  if (!product) return null;

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
        {/* Slide container: aria-live polite per screen reader sul cambio */}
        <div className="absolute inset-0" aria-live="polite">
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            <motion.div
              key={product.id}
              custom={direction}
              initial={{ x: direction === 1 ? "100%" : "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 1 ? "-100%" : "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ x: dragX, y: dragY }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={{ top: 0.6, bottom: 0.6, left: 0.6, right: 0.6 }}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 select-none"
            >
              {/* Immagine edge-to-edge: object-contain con bande nere sopra/sotto
                  che ospitano top close + bottom info gradient (l'immagine resta
                  intera, nessun taglio di corpo/orlo). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Overlay scuro durante swipe verticale per dare hint "stai entrando" */}
        <motion.div
          className="absolute inset-0 bg-emerald-950 pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />

        {/* Top gradient + close */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
        <button
          onClick={onDismiss}
          aria-label="Chiudi anteprima"
          className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition"
        >
          <X size={18} />
        </button>

        {/* Indicatore pagina (1/N) */}
        {list.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] tracking-[0.25em] font-medium">
            {index + 1} / {list.length}
          </div>
        )}

        {/* Hint laterali (visibili 2s al primo open o se più di 1 prodotto) */}
        {list.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Capo precedente"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white/80 flex items-center justify-center active:scale-90 transition md:left-4"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              aria-label="Capo successivo"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white/80 flex items-center justify-center active:scale-90 transition md:right-4"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Bottom info + actions */}
        <div className="absolute inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)] bg-gradient-to-t from-black/85 via-black/50 to-transparent pt-12">
          <div className="px-5 pb-5">
            <button
              onClick={openDetail}
              className="flex items-center gap-1.5 text-white/70 text-[10px] tracking-[0.25em] uppercase mb-3 active:text-white"
            >
              <ChevronUp size={14} />
              Apri scheda · scorri su/giù
            </button>

            <div className="flex items-end justify-between gap-4">
              <button onClick={openDetail} className="flex-1 text-left min-w-0">
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
                  onClick={openDetail}
                  aria-label="Vai alla scheda prodotto"
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-emerald-950 active:scale-90 transition-all shadow-lg"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        returnTo={productHref}
        title="Salva nel tuo Circle"
        subtitle="Accedi per salvare questo capo nella tua wishlist e ritrovarlo nell'area personale."
        onAuthenticated={() => {
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
