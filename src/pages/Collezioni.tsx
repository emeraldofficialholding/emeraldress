import { useState } from "react";
import { Link } from "react-router-dom"; // <--- IMPORT AGGIUNTO
import { useProducts } from "@/hooks/useProducts";
import ButterflyLoader from "@/components/ButterflyLoader";
import { motion } from "framer-motion";
import { Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// --- COMPONENTE CARD SPECIFICO (Stile Valentine) ---
const CollectionCard = ({ product, index }: {product: any;index: number;}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group">

      {/* WRAPPER LINK AL PRODOTTO */}
      <Link to={`/product/${product.id}`} className="flex flex-col gap-3 cursor-pointer">
        {/* 1. Immagine (Aspect Ratio Alto 3:4 o più slanciato) */}
        <div className="relative w-full aspect-[3/4.2] overflow-hidden bg-neutral-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />


          {/* Hover: Seconda immagine (se esiste) */}
          {product.images[1] &&
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          }



          {/* Badge "Nuovo" (Opzionale) */}
          {product.is_new_arrival &&
          <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-bold text-white bg-emerald-900/80 px-2 py-1 backdrop-blur-sm">
              Nuovo
            </span>
          }
        </div>

        {/* 2. Meta Info (Sotto l'immagine) */}
        <div className="flex flex-col gap-1 px-1">

          {/* Titolo Prodotto */}
          <h3 className="font-sans text-sm text-neutral-900 font-medium leading-tight group-hover:underline decoration-1 underline-offset-4 decoration-neutral-300">
            {product.name}
          </h3>

          {/* Prezzo */}
          <p className="font-sans text-xs text-neutral-500 mt-0.5">
            {new Intl.NumberFormat("it-IT", {
              style: "currency",
              currency: "EUR"
            }).format(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>);

};

// --- PAGINA PRINCIPALE ---
const Collezioni = () => {
  const [activeFilter, setActiveFilter] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Hook dati
  const { data: products, isLoading } = useProducts(activeFilter);

  // Titolo dinamico basato sul filtro
  const pageTitle = !activeFilter ?
  "TUTTE LE COLLEZIONI" :
  activeFilter === "emerald-touch" ?
  "EMERALD TOUCH" :
  "I CLASSICI";

  return (
    <main className="pt-24 pb-20 min-h-screen bg-white">
      {/* 1. Header & Title (Centrato come nella foto) */}
      <div className="text-center mb-12 md:mb-16 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">STAGIONE 2026</span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-neutral-950">{pageTitle}</h1>
        </motion.div>
      </div>

      {/* 2. Control Bar (Filtro Sx - Ordina Dx) */}
      <div className="sticky top-[70px] z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-100 mb-8 py-3">
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
          {/* SINISTRA: Filtro (Apre Sheet o Menu) */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-4 rounded-none border-neutral-200 hover:bg-neutral-50 font-sans text-xs uppercase tracking-widest gap-2">

                  <Filter className="w-3.5 h-3.5" /> Filtro
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-white rounded-none border-neutral-100">
                <DropdownMenuItem
                  onClick={() => setActiveFilter(undefined)}
                  className="cursor-pointer font-sans text-xs uppercase py-3">

                  Tutto
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveFilter("emerald-touch")}
                  className="cursor-pointer font-sans text-xs uppercase py-3">

                  Emerald Touch
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveFilter("classics")}
                  className="cursor-pointer font-sans text-xs uppercase py-3">

                  Classici
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Counter Prodotti (Visibile solo desktop) */}
            {!isLoading &&
            <span className="hidden md:inline-block text-[10px] text-neutral-400 font-sans uppercase tracking-widest">
                {products?.length} Prodotti
              </span>
            }
          </div>

          {/* DESTRA: Ordinamento */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 hover:bg-transparent font-sans text-xs uppercase tracking-widest gap-1 text-neutral-600 hover:text-black">

                Ordinare <ChevronDown className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white rounded-none border-neutral-100">
              <DropdownMenuItem onClick={() => setSortOrder("asc")} className="cursor-pointer font-sans text-xs">
                Prezzo: Crescente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")} className="cursor-pointer font-sans text-xs">
                Prezzo: Decrescente
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 3. Product Grid (4 Colonne Desktop - Stile Foto) */}
      <div className="container mx-auto px-4 lg:px-8">
        {isLoading ?
        <div className="flex justify-center py-20">
            <ButterflyLoader />
          </div> :

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16">
            {products?.map((product, i) =>
          <CollectionCard key={product.id} product={product} index={i} />
          )}
          </div>
        }

        {/* Empty State */}
        {!isLoading && products?.length === 0 &&
        <div className="text-center py-32">
            <p className="font-serif text-xl text-neutral-400">Nessun prodotto trovato in questa collezione.</p>
            <Button variant="link" onClick={() => setActiveFilter(undefined)} className="mt-4 text-emerald-600">
              Vedi tutto
            </Button>
          </div>
        }
      </div>
    </main>);

};

export default Collezioni;