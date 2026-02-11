import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ArrowRight } from "lucide-react";

const ManifestoSection = () => (
  <section className="relative py-40 overflow-hidden flex items-center justify-center">
    {/* Background Image con Parallax Effect simulato e Overlay */}
    <div className="absolute inset-0 z-0">
      <img
        src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=2000&auto=format&fit=crop"
        alt="Emeraldress Manifesto"
        className="w-full h-full object-cover brightness-[0.4] scale-105"
      />
      <div className="absolute inset-0 bg-emerald-950/30 mix-blend-multiply" />
    </div>

    <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <span className="text-emerald-300 tracking-[0.3em] uppercase text-xs font-bold mb-6 block">
          La nostra Filosofia
        </span>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-10 drop-shadow-lg">
          "La moda non deve <br /> costare la Terra."
        </h2>

        <div className="flex justify-center">
          <Link to="/chisiamo">
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="bg-white/10 backdrop-blur-md text-white border-white/20 flex items-center gap-3 px-10 py-4 font-bold tracking-widest uppercase text-sm hover:bg-white hover:text-emerald-950 transition-all duration-500"
            >
              Scopri la nostra storia
              <ArrowRight className="w-4 h-4" />
            </HoverBorderGradient>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ManifestoSection;
