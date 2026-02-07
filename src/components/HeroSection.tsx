import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroVideo from "@/assets/hero-video.mp4";

const HeroSection = () => (
  <section className="relative h-screen w-full overflow-hidden">
    <video
      src={heroVideo}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

    <div className="relative z-10 h-full flex flex-col items-center justify-end pb-24 px-4 text-center text-white">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-wide mb-4"
      >
        LUSSO, RINATO.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="font-sans text-sm md:text-base tracking-[0.2em] uppercase opacity-80 mb-8"
      >
        Lusso consapevole, manifattura italiana.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <Link
          to="/collezioni"
          className="inline-block border border-white/80 px-8 py-3 text-xs tracking-[0.2em] uppercase font-sans hover:bg-white hover:text-black transition-all duration-500"
        >
          Esplora
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
