"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthDialog } from "./AuthDialog";

const supabase = getSupabaseBrowserClient();

const PERKS = [
  { eyebrow: "Anteprime", title: "Drop in anteprima", desc: "Accesso prima del pubblico ai nuovi rilasci in edizione limitata." },
  { eyebrow: "Vantaggi", title: "Offerte riservate", desc: "Sconti e benefit dedicati ai membri del Circle." },
  { eyebrow: "Esperienza", title: "Wishlist & ordini", desc: "Salva i capi che ami e gestisci tutto dall'area personale." },
];

const EmeraldCircleSection = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasUser(!!data.session?.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setHasUser(!!s?.user));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <section
      aria-label="Emerald Circle"
      className="relative border-t border-emerald-100/60 py-20 md:py-28 overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, #e6f7ec 0%, #f7fdf9 50%, #ffffff 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] opacity-50"
        style={{
          background:
            "radial-gradient(40% 60% at 80% 10%, rgba(16,185,129,0.18) 0%, transparent 70%), radial-gradient(40% 60% at 15% 30%, rgba(5,150,105,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="container relative mx-auto px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-12 md:mb-14"
        >
          <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.35em] uppercase font-bold text-emerald-600 mb-4 font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            Membership
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 leading-tight">
            Entra nell&apos;Emerald Circle
          </h2>
          <p className="mt-5 text-emerald-900/70 font-sans text-base md:text-lg leading-relaxed">
            Il cerchio ristretto di chi sceglie un lusso consapevole. Crea il tuo account e accedi
            ad anteprime, vantaggi riservati e alla tua wishlist personale.
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-px bg-emerald-100/70 border border-emerald-100/70 mb-12">
          {PERKS.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white p-6 md:p-8 flex flex-col"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-emerald-600/80 font-sans mb-3">
                {p.eyebrow}
              </span>
              <span className="font-serif text-xl text-emerald-950 mb-2">{p.title}</span>
              <span className="text-[0.9em] text-emerald-900/70 font-['Alice'] leading-relaxed">
                {p.desc}
              </span>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-emerald-200/70 bg-white/70 backdrop-blur-sm p-6 md:p-7 shadow-[0_10px_30px_-18px_rgba(6,95,70,0.25)]"
        >
          <div className="text-center sm:text-left">
            <p className="text-[10px] tracking-[0.3em] uppercase text-emerald-700/60 mb-1">
              {hasUser ? "Sei già nel Circle" : "Diventa membro"}
            </p>
            <p
              className="text-lg text-emerald-950"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              {hasUser
                ? "Continua a esplorare il tuo mondo Emeraldress."
                : "Bastano 30 secondi. Email o Google."}
            </p>
          </div>
          <button
            onClick={() => {
              if (hasUser) {
                window.location.href = "/profilo";
              } else {
                setAuthOpen(true);
              }
            }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[11px] tracking-[0.25em] uppercase font-medium transition-all hover:opacity-95 active:scale-[0.98] shrink-0"
            style={{
              background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
              color: "#f0fdf4",
              boxShadow: "0 8px 24px -8px rgba(5,150,105,0.45)",
            }}
          >
            {hasUser ? "Vai all'area personale" : "Entra nel Circle"}
            <ArrowRight className="w-4 h-4" />
          </button>
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
