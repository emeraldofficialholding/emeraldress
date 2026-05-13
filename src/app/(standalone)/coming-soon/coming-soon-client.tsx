"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const logoED = "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-icon-ed.svg";
const N8N_NEWSLETTER_URL =
  process.env.NEXT_PUBLIC_N8N_NEWSLETTER_URL ?? "https://n8n.kreareweb.com/webhook/newsletter-register";

// Drop ufficiale: giovedi' 14 maggio 2026, 18:00 ora italiana (CEST = +02:00).
// Per cambiare la data al volo basta toccare questa costante.
const DROP_AT_ISO = "2026-05-14T18:00:00+02:00";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(target: number): TimeLeft {
  const total = Math.max(0, target - Date.now());
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);
  return { days, hours, minutes, seconds, total };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center min-w-[64px] sm:min-w-[88px]">
      <div
        className="relative w-full aspect-square sm:aspect-[5/4] flex items-center justify-center rounded-2xl border border-emerald-900/15 bg-white/55 backdrop-blur-sm shadow-[0_12px_30px_-18px_rgba(6,95,70,0.35)] overflow-hidden"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-emerald-600/40 to-transparent"
        />
        <span
          className="text-3xl sm:text-5xl tabular-nums text-emerald-950 leading-none"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          {padded}
        </span>
      </div>
      <span className="mt-2 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-emerald-800/60">
        {label}
      </span>
    </div>
  );
}

function Countdown({ targetIso }: { targetIso: string }) {
  const targetMs = new Date(targetIso).getTime();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(targetMs));

  useEffect(() => {
    setMounted(true);
    const tick = () => setTime(getTimeLeft(targetMs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  // SSR: rendiamo placeholder neutro per evitare hydration mismatch.
  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-2.5 sm:gap-4">
        {["GG", "HH", "MM", "SS"].map((l) => (
          <CountdownUnit key={l} value={0} label={l === "GG" ? "Giorni" : l === "HH" ? "Ore" : l === "MM" ? "Min" : "Sec"} />
        ))}
      </div>
    );
  }

  if (time.total <= 0) {
    return (
      <div className="text-center">
        <p
          className="text-3xl sm:text-4xl text-emerald-700 italic"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          Siamo live.
        </p>
        <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-emerald-800/60">
          Il drop è iniziato — entra nel sito
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2.5 sm:gap-4">
      <CountdownUnit value={time.days} label="Giorni" />
      <CountdownUnit value={time.hours} label="Ore" />
      <CountdownUnit value={time.minutes} label="Min" />
      <CountdownUnit value={time.seconds} label="Sec" />
    </div>
  );
}

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 5,
  delay: Math.random() * 4,
  duration: 2.5 + Math.random() * 3,
}));

export function ComingSoonClient() {
  const [formData, setFormData] = useState({ nome: "", email: "", telefono: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.telefono) {
      toast.error("Per favore, compila tutti i campi obbligatori.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(N8N_NEWSLETTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.nome,
          email: formData.email,
          phone: formData.telefono,
          source: "coming_soon",
        }),
      });
      if (!res.ok) throw new Error("Webhook error");
      toast.success("Benvenuto nell'Inner Circle di Emeraldress.");
      setFormData({ nome: "", email: "", telefono: "" });
    } catch {
      toast.error("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#e4ffec] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle, #10b981 0%, #6ee7b7 50%, transparent 100%)",
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5],
            y: [0, -20, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-300/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-400/15 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center mb-12"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoED} alt="Emeraldress" className="w-20 h-20 object-contain mb-6 invert brightness-200" />
          <span className="tracking-[0.4em] uppercase text-emerald-800 text-xs font-semibold mb-2">
            Emeraldress
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-emerald-950 leading-tight tracking-tight mb-6"
        >
          L&apos;eleganza <br />
          <span className="italic text-emerald-700 relative inline-block">
            ha bisogno di tempo
            <motion.span
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-500 rounded-full"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 1.2 }}
              style={{ width: "100%" }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-emerald-800/70 font-sans text-base sm:text-lg tracking-wide mb-10 max-w-md"
        >
          Un tocco di smeraldo sta per arrivare. Iscriviti alla newsletter per accedere alle{" "}
          <span className="font-semibold text-emerald-900">18:00 di giovedì</span>.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75 }}
          className="mb-12 w-full flex flex-col items-center gap-3"
        >
          <p className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-emerald-700/65 flex items-center gap-2">
            <span className="w-6 h-px bg-emerald-700/30" />
            Drop ufficiale · 14 maggio · ore 18:00
            <span className="w-6 h-px bg-emerald-700/30" />
          </p>
          <Countdown targetIso={DROP_AT_ISO} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="w-full"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="relative group">
                <input
                  type="text"
                  name="nome"
                  id="cs-nome"
                  autoComplete="name"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="block w-full bg-transparent border-b border-emerald-900/20 py-4 text-emerald-950 text-base placeholder-transparent focus:border-emerald-700 focus:outline-none transition-colors peer"
                  placeholder="Nome Completo"
                  required
                />
                <label
                  htmlFor="cs-nome"
                  className="absolute left-0 -top-3.5 text-emerald-700 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-emerald-800/60 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-emerald-700 peer-focus:text-xs uppercase tracking-widest"
                >
                  Nome Completo
                </label>
              </div>

              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  id="cs-email"
                  autoComplete="email"
                  inputMode="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full bg-transparent border-b border-emerald-900/20 py-4 text-emerald-950 text-base placeholder-transparent focus:border-emerald-700 focus:outline-none transition-colors peer"
                  placeholder="Email"
                  required
                />
                <label
                  htmlFor="cs-email"
                  className="absolute left-0 -top-3.5 text-emerald-700 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-emerald-800/60 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-emerald-700 peer-focus:text-xs uppercase tracking-widest"
                >
                  Indirizzo Email
                </label>
              </div>

              <div className="relative group">
                <input
                  type="tel"
                  name="telefono"
                  id="cs-telefono"
                  autoComplete="tel"
                  inputMode="tel"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="block w-full bg-transparent border-b border-emerald-900/20 py-4 text-emerald-950 text-base placeholder-transparent focus:border-emerald-700 focus:outline-none transition-colors peer"
                  placeholder="Telefono"
                  required
                />
                <label
                  htmlFor="cs-telefono"
                  className="absolute left-0 -top-3.5 text-emerald-700 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-emerald-800/60 peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-emerald-700 peer-focus:text-xs uppercase tracking-widest"
                >
                  Numero di Telefono
                </label>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <HoverBorderGradient
                as="button"
                type="submit"
                disabled={isSubmitting}
                containerClassName="rounded-full"
                className="bg-emerald-950 text-[#e4ffec] flex items-center gap-3 px-12 py-4 font-bold tracking-widest uppercase text-sm min-w-[200px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Registrazione...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Iscrivimi alla newsletter
                  </>
                )}
              </HoverBorderGradient>
            </div>

            <p className="text-center text-xs text-emerald-900/40">
              I tuoi dati sono al sicuro. Non inviamo spam, solo eccellenza.
            </p>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-emerald-800/40">
            EMERALDRESS · PORTO CERVO · LUSSO CONSAPEVOLE
          </p>
          <Link
            href="/login"
            className="text-[9px] tracking-[0.2em] uppercase text-emerald-900/20 hover:text-emerald-900/50 transition-colors duration-300"
          >
            Admin Access
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
