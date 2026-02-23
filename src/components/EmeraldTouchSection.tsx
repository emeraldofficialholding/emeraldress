import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import GemLoader from "./GemLoader";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Sparkles, ArrowRight } from "lucide-react";
import logoET from "@/assets/logo-emeraldtouch.png";

const EmeraldTouchSection = () => {
  // MODIFICA: Carichiamo tutti i prodotti e filtriamo lato client per maggiore sicurezza
  const { data: allProducts, isLoading } = useProducts();

  // Logica intelligente:
  // 1. Cerca prodotti specifici "emerald-touch"
  const emeraldProducts = allProducts?.filter((p) => p.category === "emerald-touch");

  // 2. Se non ne trova, usa i primi 4 prodotti generici (Fallback) per non lasciare il buco vuoto
  const displayProducts =
    emeraldProducts && emeraldProducts.length > 0 ? emeraldProducts.slice(0, 4) : allProducts?.slice(0, 4);

  // Varianti per l'animazione a cascata della griglia
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section className="relative py-28 overflow-hidden bg-neutral-50">
      {/* Sfondo Decorativo: Texture e Glow #e4ffec */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#e4ffec]/50 to-white" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Blob sfocato laterale */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header Sezione */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <p className="text-xs tracking-[0.3em] uppercase font-bold font-sans text-emerald-500">
                Collezione Esclusiva
              </p>
            </div>

            <img src={logoET} alt="Emerald Touch" className="h-12 md:h-16 object-contain mx-auto mb-2" />

            <p className="text-neutral-500 font-sans text-lg leading-relaxed normal-case">
              Emerald Touch è la <strong>capsule collection</strong> di debutto di Emeraldress: cinque capi iconici che fondono
              <strong> sensualità, comfort e raffinatezza mediterranea</strong>. Ispirata ai contrasti cromatici e alla luce della <strong>Costa
              Smeralda</strong>, la collezione celebra un'<strong>eleganza senza tempo</strong> e un <strong>fit impeccabile</strong>, pensata per valorizzare ogni
              donna con naturalezza.
            </p>
          </motion.div>
        </div>

        {/* Griglia Prodotti */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <GemLoader />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
          >
            {displayProducts?.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}

            {/* Messaggio se non ci sono prodotti nemmeno nel fallback */}
            {(!displayProducts || displayProducts.length === 0) && (
              <div className="col-span-full text-center py-10 text-neutral-400 font-serif italic">
                Nessun prodotto disponibile al momento.
              </div>
            )}
          </motion.div>
        )}

        {/* Bottone "Vedi Tutto" in fondo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <Link to="/collezioni?category=emerald-touch">
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="bg-white text-emerald-950 flex items-center gap-3 px-10 py-4 font-bold tracking-widest uppercase text-sm shadow-xl shadow-emerald-100/50 hover:shadow-emerald-200/50 transition-all"
            >
              Esplora la Collezione
              <ArrowRight className="w-4 h-4" />
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EmeraldTouchSection;