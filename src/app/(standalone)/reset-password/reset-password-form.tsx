"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Generati solo lato client (Math.random a livello modulo causa hydration mismatch).
function useParticles(count = 12) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; delay: number; duration: number }[]
  >([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 4,
        duration: 2.5 + Math.random() * 3,
      })),
    );
  }, [count]);
  return particles;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const particles = useParticles(12);
  const [ready, setReady] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const init = async () => {
      // CASO 1: link arriva da email reset password con token_hash query param.
      // Supabase Auth Hook + flusso PKCE genera un token_hash che NON funziona
      // con /auth/v1/verify cross-browser (richiede code_verifier dal cookie
      // del browser originale). verifyOtp() invece lo valida server-side senza
      // bisogno del cookie → funziona da qualsiasi device.
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get("token_hash");
      const otpType = params.get("type");

      if (tokenHash && otpType === "recovery") {
        const { error: otpError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (!active) return;
        if (otpError) {
          setError("Link non valido o scaduto. Richiedi un nuovo reset.");
          setReady(true);
          return;
        }
        setHasRecoverySession(true);
        setReady(true);
        // Pulizia URL: rimuovi token_hash dalla barra browser per evitare
        // refresh accidentale che riusa lo stesso token (one-time use).
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }

      // CASO 2: già loggato con sessione recovery (es. arrivo da /auth/callback)
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;
      if (session?.user) setHasRecoverySession(true);
      setReady(true);
    };
    void init();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session?.user)) {
        setHasRecoverySession(true);
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("La password deve avere almeno 6 caratteri.");
      return;
    }
    if (password !== confirm) {
      setError("Le password non coincidono.");
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    toast.success("Password aggiornata. Accedi con la nuova password.");
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-10"
      style={{ backgroundColor: "#e4ffec" }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, rgba(52,211,153,0.9) 0%, rgba(16,185,129,0.3) 60%, transparent 100%)",
          }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.4, 0.5] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.35em] uppercase text-emerald-700/60 mb-3">
            Emeraldress
          </p>
          <h1
            className="text-3xl text-emerald-950"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            Nuova Password
          </h1>
          <div className="mt-3 mx-auto w-10 h-px bg-emerald-400/50" />
        </div>

        {!ready ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
          </div>
        ) : !hasRecoverySession ? (
          <div className="text-center bg-white/60 border border-emerald-200 rounded-lg p-6">
            <p className="text-sm text-emerald-950 mb-2">Link non valido o scaduto.</p>
            <p className="text-xs text-emerald-900/60 mb-4">
              Richiedi un nuovo link dalla pagina di accesso.
            </p>
            <button
              onClick={() => router.replace("/login")}
              className="text-[11px] tracking-[0.25em] uppercase text-emerald-800 hover:text-emerald-950"
            >
              Torna al login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-emerald-800/60 mb-2">
                Nuova password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/60 border border-emerald-200 rounded-lg px-4 py-3 pr-11 text-sm text-emerald-950 placeholder:text-emerald-700/30 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300 transition-all"
                  placeholder="Almeno 6 caratteri"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600/50 hover:text-emerald-700"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-emerald-800/60 mb-2">
                Conferma password
              </label>
              <input
                type={show ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-white/60 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-950 placeholder:text-emerald-700/30 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300 transition-all"
                placeholder="Ripeti la password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-lg text-[11px] tracking-[0.25em] uppercase font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
                color: "#f0fdf4",
                boxShadow: "0 4px 20px rgba(5,150,105,0.25)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={13} className="animate-spin" />
                  Aggiornamento…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock size={13} />
                  Aggiorna password
                </span>
              )}
            </button>

            {error && (
              <p className="text-xs text-red-600/80 text-center tracking-wide">{error}</p>
            )}
          </form>
        )}

        <p className="mt-8 text-center text-[9px] tracking-[0.25em] uppercase text-emerald-800/35">
          Area Emeraldress · Accesso sicuro
        </p>
      </motion.div>
    </div>
  );
}
