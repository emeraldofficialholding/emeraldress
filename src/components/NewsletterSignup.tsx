"use client";

import { useState, FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Mail, Check, Loader2 } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterSignup = () => {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!emailRegex.test(value)) {
      toast.error("Inserisci un'email valida");
      return;
    }
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("subscribers") as any).insert({
      email: value,
      source: "footer",
      active: true,
    });
    setLoading(false);
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      toast.error("Si è verificato un errore. Riprova.");
      return;
    }
    setDone(true);
    setEmail("");
    toast.success("Iscrizione confermata");
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 text-emerald-800 font-sans text-sm">
        <Check className="w-4 h-4 text-emerald-600" />
        <span>Grazie. Sei nella lista.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <p className="text-xs text-emerald-800/80 font-sans leading-relaxed">
        Iscriviti per anteprime esclusive e nuovi arrivi.
      </p>
      <div className="flex items-stretch border border-emerald-200 bg-white/60 focus-within:border-emerald-700 transition-colors">
        <span className="flex items-center pl-3 text-emerald-700/70">
          <Mail className="w-4 h-4" />
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="La tua email"
          aria-label="Email per newsletter"
          className="flex-1 px-3 py-2.5 bg-transparent text-sm font-sans text-emerald-950 placeholder:text-emerald-700/40 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 bg-emerald-950 text-[#e4ffec] text-[10px] font-sans tracking-[0.25em] uppercase hover:bg-emerald-800 transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Iscrivi"}
        </button>
      </div>
      <p className="text-[10px] text-emerald-700/50 font-sans leading-relaxed">
        Iscrivendoti accetti la nostra Privacy Policy. Disiscrizione in qualsiasi momento.
      </p>
    </form>
  );
};

export default NewsletterSignup;
