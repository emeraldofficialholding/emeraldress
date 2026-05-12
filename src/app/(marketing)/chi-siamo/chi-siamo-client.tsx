"use client";

import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { Instagram, PenTool, ArrowRight } from "lucide-react";
import RelatedLinks from "@/components/RelatedLinks";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
  viewport: { once: true },
};

const timelineData = [
  {
    title: "Vision",
    content: (
      <div>
        <p className="text-neutral-600 text-sm md:text-base font-normal mb-8 leading-relaxed">
          <strong>EmeralDress</strong> aspira a diventare un punto di riferimento <strong>internazionale</strong> nel
          panorama del <strong>luxury wear</strong>, un marchio sinonimo di stile senza tempo.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/ASSET/emeraldress-vision.webp"
            alt="Ispirazione iniziale"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-md"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/ASSET/emeraldress-asset.webp"
            alt="Primi bozzetti"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-md"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Mission",
    content: (
      <div>
        <p className="text-neutral-600 text-sm md:text-base font-normal mb-8 leading-relaxed">
          <strong>La nostra missione</strong> è creare capi pensati per valorizzare e{" "}
          <strong>rispettare il corpo</strong>. Scegliendo esclusivamente tessuti <strong>ecosostenibili</strong>{" "}
          crediamo che nel nostro piccolo <strong>possiamo contribuire a rende il mondo un posto più pulito.</strong>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/ASSET/emeraldress-mission.webp"
          alt="Ricerca tessuti sani"
          className="rounded-lg object-cover h-40 md:h-64 w-full shadow-md"
        />
      </div>
    ),
  },
  {
    title: "Filiera",
    content: (
      <div>
        <p className="text-neutral-600 text-sm md:text-base font-normal mb-4 leading-relaxed">
          Tutta la produzione <strong>Emeraldress</strong> avviene esclusivamente in <strong>Italia</strong>. Dalla
          modellistica alla confezione finale, ogni fase è gestita da <strong>professionisti specializzati</strong>{" "}
          nella lavorazione dei <strong>tessuti elasticizzati premium</strong>. Collaboriamo con piccoli laboratori
          sartoriali del <strong>territorio</strong>, dove ogni capo viene confezionato manualmente da sarte qualificate.
        </p>
      </div>
    ),
  },
];

export function ChiSiamoClient() {
  return (
    <main className="pt-0 bg-white">
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/HERO.mp4"
        bgImageSrc="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/SFONDO%20MINT.png"
        title="Emerald Dress"
        scrollToExpand="Scorri per esplorare"
        textBlend
      >
        <div className="pt-16">
          <motion.div {...fadeUp} className="container mx-auto px-4 lg:px-8 max-w-2xl mb-24">
            <p className="text-xs tracking-[0.2em] uppercase text-emerald-600 font-sans mb-2 text-center">
              La nostra storia
            </p>
            <h1 className="font-serif text-5xl mb-6 text-center md:text-7xl text-neutral-900">Chi Siamo</h1>
            <p className="text-neutral-600 font-sans leading-relaxed text-center text-lg">
              Dalla <strong>Costa Smeralda</strong> al mondo. EMERALDRESS nasce dalla visione di unire l&apos;
              <strong>artigianato sardo</strong> con l&apos;<strong>innovazione tessile sostenibile</strong>, creando capi
              che rispettano la Terra senza compromessi sullo stile.
            </p>
          </motion.div>

          <section className="container mx-auto px-4 mb-32">
            <div className="bg-[#e4ffec] p-10 md:p-20 rounded-[3rem] border border-emerald-100 text-center max-w-5xl mx-auto relative overflow-hidden shadow-sm">
              <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                  backgroundImage: "radial-gradient(#10b981 0.5px, transparent 0.5px)",
                  backgroundSize: "12px 12px",
                }}
              />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
              <div className="relative z-10">
                <h2 className="font-serif text-2xl md:text-5xl text-emerald-950 leading-tight mb-10">
                  &quot;Emeraldress fonde stile contemporaneo al Made in Italy in un progetto indipendente e sostenibile.
                  Ogni capo è disegnato personalmente per scolpire la silhouette con tessuti premium e cura artigianale&quot;
                </h2>
                <div className="flex justify-center items-center gap-3 text-emerald-800">
                  <span className="font-serif italic text-3xl md:text-4xl transform -rotate-3">
                    Noemy Alba - Founder
                  </span>
                  <PenTool className="w-5 h-5 opacity-70" />
                </div>
              </div>
            </div>
          </section>

          <Timeline data={timelineData} />

          <section className="w-screen relative left-1/2 -translate-x-1/2 h-[400px] overflow-hidden mt-16 group">
            <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center text-white">
              <span className="tracking-[0.5em] uppercase text-sm mb-4">L&apos;Arte del </span>
              <h2 className="font-serif text-5xl md:text-6xl">MADE IN ITALY</h2>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/ASSET/emeraldress-madeinitaly.webp"
              alt="Atelier"
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2000ms]"
            />
          </section>

          <section
            className="py-28 w-screen relative left-1/2 -translate-x-1/2 overflow-hidden"
            style={{ background: "#e4ffec" }}
          >
            <div className="container mx-auto px-4 lg:px-12 relative z-10 max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-center mb-16"
              >
                <span className="inline-block py-1 px-4 rounded-full border border-emerald-300 text-emerald-700 text-[10px] uppercase tracking-[0.25em] font-bold mb-5">
                  Community
                </span>
                <h2 className="font-serif text-4xl md:text-6xl text-emerald-950 leading-tight mb-5">Social Dress</h2>
                <p className="text-neutral-600 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
                  Non è solo una pagina Instagram. È un <strong>movimento di stile</strong> ed{" "}
                  <strong>eleganza condivisa</strong>. Ogni giorno, donne che scelgono la <strong>qualità</strong>, la{" "}
                  <strong>consapevolezza</strong> e la <strong>bellezza autentica</strong> si riconoscono nell&apos;universo
                  Emeraldress.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
                {[
                  "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/Dress-Charme-Touch/Emeraldress-Dress-Charme-Touch.webp",
                  "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/ASSET/emeraldress-socialdress-2.webp",
                  "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/products/Dress-Touch/Emeraldress-Dress-Touch.webp",
                  "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/ASSET/emeraldress-socialdress-4.webp",
                ].map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="relative aspect-square overflow-hidden rounded-xl border border-emerald-100 shadow-sm group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Post ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/20 transition-colors duration-500" />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
              >
                <a
                  href="https://www.instagram.com/emeraldress_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-3 border border-neutral-900 text-neutral-900 text-xs tracking-widest uppercase font-bold transition-all duration-300 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-none"
                >
                  <Instagram className="w-4 h-4" />
                  @emeraldress_
                </a>
                <span className="text-sm font-serif italic text-neutral-400 flex items-center gap-2">
                  Unisciti a 8k+ followers <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            </div>
          </section>

          <section className="bg-[#051c14] text-white py-24 w-screen relative left-1/2 -translate-x-1/2 border-t border-emerald-900/30">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 items-center justify-center text-center divide-y md:divide-y-0 md:divide-x divide-emerald-900/50">
                <div className="flex flex-col items-center gap-4 py-4 md:py-0 group cursor-default">
                  <span className="font-serif text-5xl md:text-7xl text-emerald-50 group-hover:text-emerald-400 transition-colors duration-500">
                    8K+
                  </span>
                  <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-emerald-600/80 group-hover:text-emerald-400 transition-colors">
                    FOLLOWERS
                  </span>
                </div>

                <div className="flex flex-col items-center gap-4 py-4 md:py-0 group cursor-default">
                  <span className="font-serif text-5xl md:text-7xl text-emerald-50 group-hover:text-emerald-400 transition-colors duration-500">
                    100%
                  </span>
                  <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-emerald-600/80 group-hover:text-emerald-400 transition-colors">
                    Made in Italy
                  </span>
                </div>

                <div className="flex flex-col items-center gap-4 py-4 md:py-0 group cursor-default">
                  <span className="font-serif text-5xl md:text-7xl text-emerald-50 group-hover:text-emerald-400 transition-colors duration-500">
                    New
                  </span>
                  <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-emerald-600/80 group-hover:text-emerald-400 transition-colors">
                    Weekly Content
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ScrollExpandMedia>

      <RelatedLinks
        title="Vivi il manifesto"
        intro="La nostra storia continua nei capi, nei materiali e negli strumenti che mettiamo a disposizione di chi sceglie un lusso consapevole."
        links={[
          { to: "/", label: "Home", desc: "Torna all'esperienza visiva del brand.", eyebrow: "Inizio" },
          { to: "/sostenibilita", label: "Sostenibilità", desc: "La fibra rigenerata e il processo di trasformazione.", eyebrow: "Materia" },
          { to: "/collezioni", label: "Collezioni", desc: "La selezione Emerald Touch, edizione limitata.", eyebrow: "Shop" },
          { to: "/emeraldscanner", label: "Emerald Scanner", desc: "Analizza un capo e scopri il suo impatto reale.", eyebrow: "Strumento" },
        ]}
      />
    </main>
  );
}
