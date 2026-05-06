import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import RelatedLinks, { RelatedLink } from "@/components/RelatedLinks";

interface LegalLayoutProps {
  title: string;
  eyebrow: string;
  intro?: string;
  metaTitle: string;
  metaDescription: string;
  lastUpdated?: string;
  canonicalPath?: string;
  relatedLinks?: RelatedLink[];
  children: ReactNode;
}

const LegalLayout = ({
  title,
  eyebrow,
  intro,
  metaTitle,
  metaDescription,
  lastUpdated = "1 maggio 2026",
  canonicalPath,
  relatedLinks,
  children,
}: LegalLayoutProps) => {
  return (
    <main className="bg-white relative overflow-hidden">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {canonicalPath && (
          <link rel="canonical" href={`https://www.emeraldress.com${canonicalPath}`} />
        )}
      </Helmet>

      {/* Hero */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden border-b border-emerald-100/60">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e4ffec]/40 via-white to-white" />
        <div className="absolute top-20 -right-32 w-96 h-96 bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-8 relative z-10 max-w-4xl">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-sans text-emerald-700/70 mb-8"
          >
            <Link to="/" className="hover:text-emerald-950 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-950">{eyebrow}</span>
          </motion.nav>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-xs tracking-[0.35em] uppercase font-bold font-sans text-emerald-600 mb-5"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-emerald-950 leading-[1.05] mb-6"
          >
            {title}
          </motion.h1>

          {intro && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="font-sans text-lg md:text-xl text-emerald-900/70 leading-relaxed max-w-2xl"
            >
              {intro}
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-[11px] tracking-[0.25em] uppercase font-sans text-emerald-700/60"
          >
            Ultimo aggiornamento · {lastUpdated}
          </motion.p>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="legal-content font-sans text-[0.95rem] md:text-base text-emerald-950/85 leading-[1.85]"
          >
            {children}
          </motion.article>

          <div className="mt-20 pt-10 border-t border-emerald-100">
            <p className="text-xs text-emerald-700/60 font-sans italic">
              Per qualsiasi richiesta o chiarimento puoi scriverci a{" "}
              <a
                href="mailto:emeraldresshop@gmail.com"
                className="text-emerald-700 hover:text-emerald-950 underline underline-offset-4"
              >
                emeraldresshop@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {relatedLinks && relatedLinks.length > 0 && (
        <RelatedLinks
          title="Documenti correlati"
          intro="Continua a esplorare le pagine ufficiali e le aree principali di Emeraldress."
          links={relatedLinks}
          variant="mint"
        />
      )}
    </main>
  );
};

export default LegalLayout;
