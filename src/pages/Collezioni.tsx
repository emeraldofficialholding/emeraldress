import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import ButterflyLoader from "@/components/ButterflyLoader";
import { motion } from "framer-motion";

const filters = [
  { label: "Tutto", value: undefined },
  { label: "Emerald Touch", value: "emerald-touch" },
  { label: "Classici", value: "classics" },
];

const Collezioni = () => {
  const [activeFilter, setActiveFilter] = useState<string | undefined>(undefined);
  const { data: products, isLoading } = useProducts(activeFilter);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-serif text-5xl md:text-6xl mb-6">LE COLLEZIONI</h1>
          <div className="flex gap-4 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.label}
                onClick={() => setActiveFilter(f.value)}
                className={`px-5 py-2 text-xs tracking-[0.15em] uppercase font-sans border transition-all duration-300 ${
                  activeFilter === f.value
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <ButterflyLoader />
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {products?.map((product, i) => (
              <div key={product.id} className="break-inside-avoid">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Collezioni;
