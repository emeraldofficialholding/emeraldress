import { motion } from "framer-motion";

const BrandStrip = () => {
  const keywords = [
    "SustainableFashion",
    "EcoLuxury",
    "MadeInItaly",
    "Ecological fabrics",
    "Lusso Sostenibile",
    "Costa Smeralda Style",
    "ecofriendly",
  ];

  return (
    <div className="bg-emerald-950 py-4 overflow-hidden border-y border-emerald-800/50">
      {/* Container per l'effetto scorrimento fluido (Marquee) */}
      <div className="flex whitespace-nowrap">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-12 px-6"
        >
          {/* Ripetiamo le parole due volte per un loop infinito senza interruzioni */}
          {[...keywords, ...keywords].map((word, index) => (
            <div key={index} className="flex items-center gap-12">
              <span className="text-[10px] md:text-[11px] font-sans uppercase tracking-[0.3em] text-[#e4ffec] font-medium">
                {word}
              </span>
              {/* Separatore elegante tra le parole */}
              <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-50" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BrandStrip;
