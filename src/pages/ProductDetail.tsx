import { useParams } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ButterflyLoader from "@/components/ButterflyLoader";
import ImageFallback from "@/components/ImageFallback";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight, Ruler, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";

/* ── Size Guide Modal ───────────────────────────────────────────────── */
const SizeGuideModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-background border border-border p-8 max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.96, y: "-48%" }}
          animate={{ opacity: 1, scale: 1, y: "-50%" }}
          exit={{ opacity: 0, scale: 0.96, y: "-48%" }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="font-serif text-lg mb-5 tracking-wide">Guida alle Taglie</h3>
          <table className="w-full text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-border">
                {["Taglia", "Busto", "Vita", "Fianchi"].map((h) => (
                  <th key={h} className="py-2 text-left text-muted-foreground tracking-widest uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["XS", "80 cm", "62 cm", "88 cm"],
                ["S",  "84 cm", "66 cm", "92 cm"],
                ["M",  "88 cm", "70 cm", "96 cm"],
                ["L",  "94 cm", "76 cm", "102 cm"],
                ["XL", "100 cm","82 cm", "108 cm"],
              ].map(([t, b, w, h]) => (
                <tr key={t} className="border-b border-border/50">
                  {[t, b, w, h].map((v, i) => (
                    <td key={i} className="py-2.5">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={onClose}
            className="mt-6 w-full border border-border text-xs font-sans tracking-[0.15em] uppercase py-3 hover:bg-muted transition-colors"
          >
            Chiudi
          </button>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ── Desktop Gallery ────────────────────────────────────────────────── */
const DesktopGallery = ({
  images,
  activeImage,
  setActiveImage,
  productName,
}: {
  images: string[];
  activeImage: number;
  setActiveImage: (i: number) => void;
  productName: string;
}) => {
  const goNext = () => setActiveImage((activeImage + 1) % images.length);
  const goPrev = () => setActiveImage((activeImage - 1 + images.length) % images.length);

  return (
    <div className="hidden lg:flex gap-3 h-full">
      {/* Thumbnails column */}
      {images.length > 1 && (
        <div className="flex flex-col gap-2 w-[72px] shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={cn(
                "relative w-full aspect-[3/4] overflow-hidden border transition-all duration-300",
                activeImage === i
                  ? "border-foreground"
                  : "border-transparent opacity-50 hover:opacity-80"
              )}
            >
              <ImageFallback src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1 overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <ImageFallback
              src={images[activeImage]}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-border"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-border"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Mobile Carousel ────────────────────────────────────────────────── */
const MobileCarousel = ({
  images,
  productName,
  onIndexChange,
  currentIndex,
}: {
  images: string[];
  productName: string;
  onIndexChange: (i: number) => void;
  currentIndex: number;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    onIndexChange(emblaApi.selectedScrollSnap());
  }, [emblaApi, onIndexChange]);

  // Attach select listener
  useState(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  });

  return (
    <div className="lg:hidden relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-full">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <ImageFallback src={img} alt={`${productName} ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                currentIndex === i
                  ? "w-5 h-1.5 bg-foreground"
                  : "w-1.5 h-1.5 bg-muted-foreground/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────────────────── */
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || "");
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  if (isLoading)
    return (
      <div className="pt-24">
        <ButterflyLoader />
      </div>
    );
  if (!product)
    return (
      <div className="pt-24 text-center py-20">
        <p className="text-muted-foreground font-sans text-sm tracking-widest uppercase">
          Prodotto non trovato.
        </p>
      </div>
    );

  // Robust size cleaning: handles Postgres {S,M,L} format, stray braces on any element
  const rawSizes = product.sizes?.length ? product.sizes : ["XS", "S", "M", "L", "XL"];
  const sizes = rawSizes
    .flatMap((s) => {
      const cleaned = String(s).replace(/[{}]/g, "").trim();
      return cleaned.includes(",") ? cleaned.split(",") : [cleaned];
    })
    .map((s) => s.trim())
    .filter(Boolean);
  const images = product.images?.length ? product.images : ["/placeholder.svg"];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      size: selectedSize,
      image: images[0],
    });
    toast.success("Aggiunto al carrello", {
      description: `${product.name} — Taglia ${selectedSize}`,
    });
  };

  return (
    <>
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      <main className="pt-20 pb-24 bg-background">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="lg:grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] lg:gap-16 xl:gap-24">

            {/* ── Gallery Column ── */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:min-h-screen"
            >
              {/* Desktop */}
              <div className="hidden lg:block h-[90vh] sticky top-20">
                <DesktopGallery
                  images={images}
                  activeImage={activeImage}
                  setActiveImage={setActiveImage}
                  productName={product.name}
                />
              </div>

              {/* Mobile */}
              <MobileCarousel
                images={images}
                productName={product.name}
                onIndexChange={setActiveImage}
                currentIndex={activeImage}
              />
            </motion.div>

            {/* ── Info Column ── */}
            <motion.div
              ref={infoRef}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              className="lg:sticky lg:top-20 lg:h-fit pt-8 lg:pt-0 flex flex-col"
            >
              {/* Brand label */}
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                Emeraldress
              </p>

              {/* Title + Wishlist */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="font-serif text-2xl md:text-3xl leading-tight">
                  {product.name}
                </h1>
                <button
                  onClick={() => setIsWishlisted((v) => !v)}
                  className="mt-1 shrink-0 w-9 h-9 flex items-center justify-center border border-border transition-all duration-300 hover:bg-accent group"
                  aria-label="Aggiungi ai preferiti"
                >
                  <Heart
                    size={16}
                    className={cn(
                      "transition-all duration-300",
                      isWishlisted
                        ? "fill-primary stroke-primary"
                        : "stroke-foreground group-hover:stroke-primary"
                    )}
                  />
                </button>
              </div>

              {/* Price */}
              <p className="font-sans text-xl tracking-wide mb-6">
                €{Number(product.price).toFixed(2)}
              </p>

              {/* Divider */}
              <div className="h-px bg-border mb-6" />

              {/* Size selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                    Taglia
                    {selectedSize && (
                      <span className="ml-2 text-foreground font-medium">
                        — {selectedSize}
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-[10px] font-sans tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Ruler size={11} />
                    Guida alle taglie
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "relative w-12 h-12 text-xs font-sans tracking-wider border transition-all duration-300",
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-foreground bg-background text-foreground"
                      )}
                    >
                      {size}
                      {selectedSize === size && (
                        <motion.span
                          layoutId="size-indicator"
                          className="absolute inset-0 bg-primary -z-10"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Add to cart */}
              <motion.button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                whileHover={selectedSize ? { scale: 1.01 } : {}}
                whileTap={selectedSize ? { scale: 0.99 } : {}}
                className={cn(
                  "w-full py-4 flex items-center justify-center gap-2.5 font-sans text-xs tracking-[0.25em] uppercase transition-all duration-400 mb-3",
                  selectedSize
                    ? "bg-foreground text-background hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <ShoppingBag size={14} />
                {selectedSize ? "Aggiungi al carrello" : "Seleziona una taglia"}
              </motion.button>

              {/* Trust note */}
              <p className="text-center text-[10px] font-sans tracking-widest uppercase text-muted-foreground mb-8">
                Spedizione gratuita sopra i €200 · Reso entro 30 giorni
              </p>

              {/* Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description" className="border-border">
                  <AccordionTrigger className="font-sans text-[11px] tracking-[0.2em] uppercase hover:no-underline py-4 text-foreground">
                    Descrizione
                  </AccordionTrigger>
                  <AccordionContent className="text-xs font-sans text-muted-foreground leading-relaxed pb-5">
                    {product.description || "Un capo senza tempo che unisce artigianato italiano e materiali pregiati, pensato per chi cerca eleganza discreta e qualità duratura."}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fabric" className="border-border">
                  <AccordionTrigger className="font-sans text-[11px] tracking-[0.2em] uppercase hover:no-underline py-4 text-foreground">
                    Composizione & Cura
                  </AccordionTrigger>
                  <AccordionContent className="text-xs font-sans text-muted-foreground leading-relaxed pb-5">
                    {product.fabric_details || "Tessuto di alta qualità selezionato con cura. Per preservare la morbidezza e la forma del capo, si consiglia il lavaggio a mano in acqua fredda."}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping" className="border-border">
                  <AccordionTrigger className="font-sans text-[11px] tracking-[0.2em] uppercase hover:no-underline py-4 text-foreground">
                    Spedizioni & Resi
                  </AccordionTrigger>
                  <AccordionContent className="text-xs font-sans text-muted-foreground leading-relaxed pb-5 space-y-2">
                    <p>{product.shipping_info || "Spedizione standard 3–5 giorni lavorativi. Spedizione espressa disponibile al checkout."}</p>
                    <p>Reso gratuito entro 30 giorni dall'acquisto. Il capo deve essere integro e con le etichette originali.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Editorial tag */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 text-center">
                  Manifattura Italiana · Edizione Limitata
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductDetail;
