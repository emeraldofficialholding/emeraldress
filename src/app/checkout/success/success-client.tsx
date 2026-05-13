"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Package, Mail } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function CheckoutSuccessClient({ sessionId }: { sessionId: string | null }) {
  const { clearCart } = useCart();

  // Svuota il carrello al ritorno positivo (ordine creato lato webhook).
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-white border border-emerald-200/70 shadow-[0_30px_80px_-30px_rgba(6,95,70,0.35)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(16,185,129,0.10) 0%, transparent 70%)",
        }}
      />
      <div className="relative px-7 sm:px-10 py-12 sm:py-14 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
          className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-emerald-600 to-emerald-900 shadow-[0_12px_30px_-10px_rgba(6,95,70,0.45)]"
        >
          <Check className="w-7 h-7 text-emerald-50" strokeWidth={2.5} />
        </motion.div>

        <p className="text-[10px] tracking-[0.4em] uppercase text-emerald-700/60 mb-3">
          Pagamento ricevuto
        </p>
        <h1
          className="text-3xl sm:text-4xl text-emerald-950 mb-4 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          Grazie per il tuo ordine
        </h1>
        <p className="text-sm sm:text-base text-emerald-900/70 max-w-md mx-auto leading-relaxed mb-8">
          Stiamo già preparando i tuoi capi con la cura che meritano. A breve riceverai
          un&apos;email di conferma con tutti i dettagli e il numero di tracciamento appena la
          spedizione partirà.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 flex gap-3 items-start">
            <Mail className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-700/70 mb-0.5">
                Conferma email
              </p>
              <p className="text-xs text-emerald-900/75 leading-relaxed">
                Controlla la tua casella (anche spam) entro pochi minuti.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 flex gap-3 items-start">
            <Package className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-700/70 mb-0.5">
                Spedizione
              </p>
              <p className="text-xs text-emerald-900/75 leading-relaxed">
                3–5 giorni lavorativi · tracciamento incluso.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/profilo#ordini"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-[11px] tracking-[0.25em] uppercase font-medium transition-all hover:opacity-95"
            style={{
              background: "linear-gradient(135deg, #052e1f 0%, #064e3b 45%, #047857 100%)",
              color: "#f0fdf4",
              boxShadow: "0 8px 24px -10px rgba(5,150,105,0.45)",
            }}
          >
            Vedi i miei ordini
          </Link>
          <Link
            href="/collezioni"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-[11px] tracking-[0.25em] uppercase font-medium border border-emerald-900 text-emerald-950 hover:bg-emerald-50 transition-all"
          >
            Continua a esplorare
          </Link>
        </div>

        {sessionId && (
          <p className="mt-7 text-[10px] tracking-[0.15em] uppercase text-emerald-800/45 font-mono">
            Rif. {sessionId.slice(-12)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
