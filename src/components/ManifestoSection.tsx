"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ArrowRight, Globe, Fingerprint, Scissors } from "lucide-react";

const ManifestoSection = () => {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-40 overflow-hidden flex items-center justify-center min-h-[85vh]">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/ASSET/emeraldress-lanostrafilosofia.webp"
            alt="Emeraldress Manifesto"
            className="w-full h-full object-cover brightness-[0.6] scale-105"
          />
          <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-emerald-300 tracking-[0.3em] uppercase text-xs font-bold mb-6 block">
              La nostra Filosofia
            </span>

            <h2
              className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-12 drop-shadow-lg"
              aria-label="La moda non deve costare la Terra"
            >
              &quot;La moda non deve <br /> costare la Terra.&quot;
            </h2>

            <div className="flex justify-center">
              <Link href="/chi-siamo">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="bg-[#e4ffec] text-emerald-950 flex items-center gap-3 px-10 py-4 font-bold tracking-widest uppercase text-sm hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(228,255,236,0.3)]"
                >
                  Scopri la nostra storia
                  <ArrowRight className="w-4 h-4" />
                </HoverBorderGradient>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-[#F9FAF9] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-5 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h3
                  className="font-serif text-5xl md:text-6xl text-emerald-950 leading-none mb-6"
                  aria-label="Lusso Responsabile"
                >
                  Lusso <br /> <span className="italic text-emerald-600">Responsabile</span>
                </h3>
                <div className="h-1 w-20 bg-emerald-400 mb-8" />
                <p className="text-neutral-600 text-lg leading-relaxed font-sans mb-8">
                  Progettiamo il futuro trasformando <strong>reti da pesca abbandonate</strong> in pregiato{" "}
                  <strong>Nylon ECONYL®</strong>. Con Emeraldress, il problema ambientale diventa{" "}
                  <strong>bellezza pura e sostenibile</strong>, senza compromessi per il pianeta.
                </p>

                <Link href="/sostenibilita" className="inline-block">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    className="bg-emerald-950 text-[#e4ffec] flex items-center gap-3 px-8 py-3.5 font-bold tracking-widest uppercase text-xs hover:bg-emerald-900 transition-colors shadow-lg"
                  >
                    Scopri i Benefici del Processo
                    <ArrowRight className="w-4 h-4" />
                  </HoverBorderGradient>
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-emerald-100/50">
                <motion.div
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Globe className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-emerald-900 mb-1">ECONYL® Yarn</h4>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">100% Rigenerato</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Scissors className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-emerald-900 mb-1">Made in Italy</h4>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Sartoria Etica</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Fingerprint className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-emerald-900 mb-1">Blockchain</h4>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Trasparenza Totale</p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[400px] lg:h-[600px] mt-12 lg:mt-0">
              <motion.div
                className="absolute right-0 top-0 w-full lg:w-3/4 h-[350px] lg:h-[550px] overflow-hidden rounded-sm shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/ASSET/emeraldress-lussoresponsabile.webp"
                  alt="Fashion Editorial"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </motion.div>

              <motion.div
                className="absolute left-0 lg:left-10 bottom-0 w-2/3 lg:w-1/2 h-[200px] lg:h-[350px] overflow-hidden rounded-sm shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-4 border-white hidden lg:block"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/ASSET/emeraldress-lussoresponsabile-dress.webp"
                  alt="Fabric Detail"
                  className="w-full h-full object-cover scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-serif text-2xl italic">&quot;EmeralDress&quot;</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ManifestoSection;
