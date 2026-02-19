import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Leaf, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/supabaseCustom";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

// ── Shimmer / sparkle particles ────────────────────────────────────────────────
const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 5,
  delay: Math.random() * 4,
  duration: 2.5 + Math.random() * 3,
}));

export default function ComingSoon() {
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
      const { error } = await supabase.from("newsletter_leads").insert([{
        full_name: formData.nome,
        email: formData.email,
        phone: formData.telefono,
        source: "coming_soon",
      }]);
      if (error) throw error;
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

      {/* ── Shimmer particles ─────────────────────────────────────────────── */}
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

      {/* ── Radial glow center ────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-300/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-400/15 rounded-full blur-[60px]" />
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto w-full">

        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-900 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <Leaf className="w-8 h-8 text-[#e4ffec]" />
          </div>
          <span className="tracking-[0.4em] uppercase text-emerald-800 text-xs font-semibold mb-2">
            Emeraldress
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-emerald-950 leading-tight tracking-tight mb-6"
        >
          L'eleganza <br />
          <span className="italic text-emerald-700 relative inline-block">
            ha bisogno di tempo
            {/* shimmer underline */}
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
          className="text-emerald-800/70 font-sans text-base sm:text-lg tracking-wide mb-16 max-w-md"
        >
          Un tocco di smeraldo sta per arrivare. Lascia i tuoi dati per essere
          il primo a scoprirlo.
        </motion.p>

        {/* ── Newsletter Form ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="w-full"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">

              {/* Nome */}
              <div className="relative group">
                <input
                  type="text"
                  name="nome"
                  id="cs-nome"
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

              {/* Email */}
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  id="cs-email"
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

              {/* Telefono */}
              <div className="relative group">
                <input
                  type="tel"
                  name="telefono"
                  id="cs-telefono"
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
                  <><Loader2 className="w-4 h-4 animate-spin" /> Registrazione...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Avvisami al lancio</>
                )}
              </HoverBorderGradient>
            </div>

            <p className="text-center text-xs text-emerald-900/40">
              I tuoi dati sono al sicuro. Non inviamo spam, solo eccellenza.
            </p>
          </form>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-emerald-800/40">
            Emeraldress · Milano · Lusso Consapevole
          </p>
          <a
            href="/admin"
            className="text-[9px] tracking-[0.2em] uppercase text-emerald-900/20 hover:text-emerald-900/50 transition-colors duration-300"
          >
            Admin Access
          </a>
        </motion.div>
      </div>
    </div>
  );
}
