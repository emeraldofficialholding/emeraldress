import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Checkout annullato",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ backgroundColor: "#f7fdf9" }}
    >
      <div className="max-w-md w-full text-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-emerald-700/60 mb-3">
          Nessun addebito
        </p>
        <h1
          className="text-3xl sm:text-4xl text-emerald-950 mb-4 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          Checkout annullato
        </h1>
        <p className="text-sm text-emerald-900/70 leading-relaxed mb-8">
          Il tuo carrello è ancora disponibile. Riprova quando preferisci, niente è andato perso.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/collezioni"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-[11px] tracking-[0.25em] uppercase font-medium transition-all hover:opacity-95"
            style={{
              background: "linear-gradient(135deg, #052e1f 0%, #064e3b 45%, #047857 100%)",
              color: "#f0fdf4",
              boxShadow: "0 8px 24px -10px rgba(5,150,105,0.45)",
            }}
          >
            <ArrowLeft size={13} />
            Torna allo shop
          </Link>
        </div>
      </div>
    </main>
  );
}
