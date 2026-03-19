import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import GemLoader from "@/components/GemLoader";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import logoET from "@/assets/logo-emeraldtouch.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- CARD PRODOTTO (Stile Atelier) ---
const CollectionCard = ({ product, index }: { product: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`} className="flex flex-col gap-4 cursor-pointer">
        <div className="relative w-full aspect-[3/4.5] overflow-hidden bg-[#fdfdfd]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            />
          )}

          {product.is_new_arrival && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-emerald-900">Nuovo</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center text-center gap-1.5 px-2">
          <h3 className="font-serif text-sm tracking-wide text-neutral-800 group-hover:text-emerald-900 transition-colors">
            {product.name}
          </h3>
          <p className="font-sans text-[11px] tracking-[0.1em] text-neutral-500 font-light">
            {new Intl.NumberFormat("it-IT", {
              style: "currency",
              currency: "EUR",
            }).format(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

// --- PAGINA COLLEZIONI ---
const Collezioni = () => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");

  // Carica solo prodotti Emerald Touch
  const { data: products, isLoading } = useProducts("emerald-touch");

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    let items = [...products];
    if (sortOrder === "asc") return items.sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") return items.sort((a, b) => b.price - a.price);
    return items;
  }, [products, sortOrder]);

  return (
    <main className="pt-28 pb-20 min-h-screen bg-[#e4ffec]/20 transition-colors duration-500">
      <Helmet>
        <title>Le Collezioni | Emeraldress Luxury Fashion</title>
        <meta name="description" content="Esplora le collezioni Emeraldress: abbigliamento luxury sostenibile in fibra riciclata, manifattura italiana." />
      </Helmet>
      {/* Header */}
      <div className="text-center mb-16 container mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <span className="text-[10px] font-bold tracking-[0.4em] text-emerald-700/70 uppercase font-sans">Atelier 2026</span>
          <img src={logoET} alt="Emerald Touch" className="h-10 md:h-14 object-contain mx-auto" />
          <div className="w-12 h-[1px] bg-emerald-200 mx-auto mt-6"></div>
        </motion.div>
      </div>

      {/* Control Bar Sticky — solo ordinamento */}
      <div className="sticky top-[70px] z-30 bg-white/70 backdrop-blur-xl border-y border-emerald-100/50 mb-12 py-4">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <span className="text-[9px] text-neutral-400 tracking-[0.2em] uppercase font-sans">
            {sortedProducts.length} Pezzi Unici
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium font-sans text-neutral-600 hover:text-emerald-700 transition-colors">
                Ordina <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none border-emerald-50 w-56 bg-white/95 p-2">
              <DropdownMenuItem
                onClick={() => setSortOrder("none")}
                className="text-[10px] uppercase tracking-widest py-3 cursor-pointer font-sans"
              >
                Default
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOrder("asc")}
                className="text-[10px] uppercase tracking-widest py-3 cursor-pointer font-sans"
              >
                Prezzo: Crescente
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOrder("desc")}
                className="text-[10px] uppercase tracking-widest py-3 cursor-pointer font-sans"
              >
                Prezzo: Decrescente
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid Prodotti */}
      <div className="container mx-auto px-6 lg:px-12">
        {isLoading ? (
          <div className="flex justify-center py-32">
            <GemLoader />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={sortOrder}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-20"
            >
              {sortedProducts.map((product, i) => (
                <CollectionCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!isLoading && sortedProducts.length === 0 && (
          <div className="text-center py-40">
            <p className="font-serif text-2xl text-neutral-300 italic">La selezione è attualmente in preparazione.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Collezioni;
