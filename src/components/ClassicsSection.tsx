import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroVideo from "@/assets/hero-video.mp4";
import logoET from "@/assets/logo-emeraldtouch.png";

const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const ClassicsSection = () => {
  return (
    <section className="overflow-hidden bg-[#f5fef8]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
        {/* ── LEFT: Video ─────────────────────────────────── */}
        <div className="relative overflow-hidden h-[70vw] sm:h-[55vw] lg:h-auto">
          <video
            src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/hf_20260219_151213_1d627184-125b-46a5-a620-25d188f39862.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Fade-right to blend into the right column on desktop */}
          <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-transparent via-transparent to-[#f5fef8]/40 pointer-events-none" />
        </div>

        {/* ── RIGHT: Storytelling ─────────────────────────── */}
        <div className="flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-16 lg:py-24">
          {/* Badge */}
          <FadeUp delay={0.05}>
            <span className="inline-block border border-emerald-800/50 text-emerald-800 text-[10px] tracking-[0.35em] uppercase px-4 py-1.5 rounded-full font-sans mb-8 w-fit">
              Limited Edition
            </span>
          </FadeUp>

          {/* Title */}
          <FadeUp delay={0.15}>
            <div className="mb-6">
              <img src={logoET} alt="Emerald Touch" className="h-10 md:h-14 object-contain mb-3" />
              <span className="block italic text-emerald-700 font-serif text-2xl md:text-3xl">L'Essenza del Lusso</span>
            </div>
          </FadeUp>

          {/* Divider */}
          <FadeUp delay={0.22}>
            <div className="w-12 h-px bg-emerald-600 mb-8" />
          </FadeUp>

          {/* Description */}
          <FadeUp delay={0.3}>
            <p className="font-sans text-neutral-500 text-base md:text-lg leading-relaxed mb-10 max-w-md">
              Emerald Touch accompagna la donna dall'aperitivo al tramonto con <strong>linee pulite</strong> e <strong>scollature iconiche</strong>.
              Realizzata con <strong>materiali premium e sostenibili</strong>, la collezione unisce <strong>silhouette scolpite</strong> e <strong>comfort
              assoluto</strong>. Capi <strong>senza tempo</strong>, nati per valorizzare la figura con discrezione e superare le tendenze.
            </p>
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={0.4}>
            <Link
              to="/collezioni?category=emerald-touch"
              className="group inline-flex items-center gap-4 border border-neutral-900 text-neutral-900 px-8 py-4 text-xs tracking-[0.25em] uppercase font-sans hover:bg-neutral-900 hover:text-[#f5fef8] transition-all duration-500 w-fit"
            >
              Scopri la Collezione
              <span className="block w-5 h-px bg-current transition-all duration-300 group-hover:w-8" />
            </Link>
          </FadeUp>

          {/* Bottom tag */}
          <FadeUp delay={0.5}>
            <p className="mt-12 text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-sans">
              Manifattura Italiana — EmeralDress
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default ClassicsSection;
