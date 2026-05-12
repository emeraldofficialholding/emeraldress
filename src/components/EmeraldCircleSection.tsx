"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Crown, Calendar, Lock } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { AuthDialog } from "./AuthDialog";

const supabase = getSupabaseBrowserClient();

const logoED =
  "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-icon-ed.svg";

const PERKS = [
  {
    icon: Calendar,
    eyebrow: "Drop · Anteprime",
    title: "Accesso anticipato",
    desc: "Sblocca i nuovi rilasci 24h prima del pubblico, prima che le taglie si esauriscano.",
  },
  {
    icon: Crown,
    eyebrow: "Riservato · Membri",
    title: "Vantaggi esclusivi",
    desc: "Offerte private, inviti agli eventi e contenuti dedicati sulla filiera sostenibile.",
  },
  {
    icon: Sparkles,
    eyebrow: "Wishlist · Storico",
    title: "Il tuo universo",
    desc: "Salva i capi che ami, traccia gli ordini e rivivi le tue scansioni Emerald Scanner.",
  },
];

const EmeraldCircleSection = () => {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasUser(!!data.session?.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setHasUser(!!s?.user));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleCTA = () => {
    if (hasUser) router.push("/profilo");
    else setAuthOpen(true);
  };

  return (
    <section
      aria-label="Entra nell'Emerald Circle"
      className="relative py-28 md:py-36 overflow-hidden border-t border-emerald-100"
      style={{ backgroundColor: "#e4ffec" }}
    >
      {/* Same decorative blur as the removed manifesto newsletter section */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

      {/* Subtle noise texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-12 bg-emerald-900/30" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoED} alt="Emeraldress" className="w-14 h-14 object-contain" />
            <span className="h-px w-12 bg-emerald-900/30" />
          </div>

          <p className="text-[11px] tracking-[0.4em] uppercase font-bold text-emerald-700 mb-5">
            Membership · Su invito
          </p>

          <h2 className="font-serif text-4xl md:text-6xl text-emerald-950 leading-[1.05] mb-6">
            Entra nell&apos;<span className="italic text-emerald-700">Emerald Circle</span>
          </h2>

          <p className="text-emerald-900/75 font-sans text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Il cerchio ristretto di chi sceglie un lusso consapevole. Crea il tuo account e accedi a
            anteprime, vantaggi riservati e alla tua wishlist personale.
          </p>
        </motion.div>

        {/* Perks grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7 mb-14 md:mb-16">
          {PERKS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group relative bg-white/70 backdrop-blur-sm border border-emerald-200/60 rounded-2xl p-7 md:p-8 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_-20px_rgba(6,95,70,0.25)] hover:-translate-y-1"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-7 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-[0_8px_20px_-6px_rgba(6,95,70,0.4)]">
                  <Icon className="w-5 h-5 text-emerald-50" strokeWidth={1.5} />
                </div>

                <p className="text-[10px] tracking-[0.3em] uppercase text-emerald-700/70 mb-2.5 font-sans">
                  {p.eyebrow}
                </p>
                <h3
                  className="text-xl md:text-2xl text-emerald-950 mb-3"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  {p.title}
                </h3>
                <p className="text-sm text-emerald-900/70 leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl border border-emerald-900/15 shadow-[0_30px_80px_-30px_rgba(6,95,70,0.45)]"
            style={{
              background:
                "linear-gradient(135deg, #052e1f 0%, #064e3b 45%, #065f46 100%)",
            }}
          >
            {/* Decorative gleam */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(60% 50% at 110% 10%, rgba(52,211,153,0.35) 0%, transparent 70%), radial-gradient(50% 50% at -10% 110%, rgba(16,185,129,0.25) 0%, transparent 70%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative px-7 md:px-12 py-10 md:py-14 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/10 border border-emerald-300/30 text-emerald-100 text-[10px] tracking-[0.3em] uppercase font-medium backdrop-blur-sm mb-6">
                <Lock className="w-3 h-3" />
                Accesso sicuro
              </div>

              <p
                className="text-2xl md:text-3xl text-emerald-50 max-w-xl leading-snug mb-3"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                {hasUser
                  ? "Bentornata nel tuo Circle."
                  : "Bastano 30 secondi. Email o Google."}
              </p>
              <p className="text-emerald-100/70 text-sm md:text-base max-w-md mb-8">
                {hasUser
                  ? "Continua a esplorare il tuo mondo Emeraldress: wishlist, ordini, scansioni."
                  : "Crea il tuo profilo Emeraldress per salvare i capi, tracciare gli ordini e accedere alle anteprime."}
              </p>

              <HoverBorderGradient
                as="button"
                onClick={handleCTA}
                containerClassName="rounded-full"
                className="bg-[#e4ffec] text-emerald-950 flex items-center gap-3 px-10 py-4 font-bold tracking-[0.2em] uppercase text-sm hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(228,255,236,0.25)]"
              >
                {hasUser ? "Vai all'area personale" : "Entra nel Circle"}
                <ArrowRight className="w-4 h-4" />
              </HoverBorderGradient>

              {!hasUser && (
                <p className="mt-6 text-[10px] tracking-[0.25em] uppercase text-emerald-200/50">
                  Nessuna spam · Disiscriviti quando vuoi
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-emerald-900/65 text-xs tracking-[0.25em] uppercase"
        >
          <span className="flex items-center gap-2.5">
            <span className="w-1 h-1 rounded-full bg-emerald-700" />
            Edizione limitata
          </span>
          <span className="flex items-center gap-2.5">
            <span className="w-1 h-1 rounded-full bg-emerald-700" />
            Made in Italy
          </span>
          <span className="flex items-center gap-2.5">
            <span className="w-1 h-1 rounded-full bg-emerald-700" />
            ECONYL® rigenerato
          </span>
        </motion.div>
      </div>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        returnTo="/profilo"
        title="Entra nell'Emerald Circle"
        subtitle="Accedi o crea il tuo account in pochi secondi."
      />
    </section>
  );
};

export default EmeraldCircleSection;
