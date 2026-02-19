import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/supabaseCustom";

// ── Shimmer particles (same aesthetic as ComingSoon) ───────────────────────────
const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 4,
  duration: 2.5 + Math.random() * 3,
}));

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Credenziali non valide. Riprova.");
        return;
      }

      if (!authData.user) {
        setError("Accesso non riuscito. Riprova.");
        return;
      }

      // 2. Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        // Sign out non-admin users
        await supabase.auth.signOut();
        setError("Accesso non autorizzato.");
        return;
      }

      // 3. Admin confirmed → navigate to home
      navigate("/", { replace: true });
    } catch {
      setError("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#e4ffec" }}
    >
      {/* ── Shimmer particles ──────────────────────────────────────────────── */}
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
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.4, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Subtle emerald radial glow ──────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(52,211,153,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Login card ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-emerald-700/60 mb-3">
            Emeraldress
          </p>
          <h1
            className="text-3xl text-emerald-950"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            Accesso
          </h1>
          <div className="mt-3 mx-auto w-10 h-px bg-emerald-400/50" />
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="space-y-4"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] tracking-[0.25em] uppercase text-emerald-800/60 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/60 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-950 placeholder:text-emerald-700/30 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300 transition-all duration-200"
              placeholder="nome@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-[10px] tracking-[0.25em] uppercase text-emerald-800/60 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/60 border border-emerald-200 rounded-lg px-4 py-3 pr-11 text-sm text-emerald-950 placeholder:text-emerald-700/30 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300 transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600/50 hover:text-emerald-700 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600/80 text-center tracking-wide"
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-lg text-[11px] tracking-[0.25em] uppercase font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
              color: "#f0fdf4",
              boxShadow: "0 4px 20px rgba(5,150,105,0.25)",
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={13} className="animate-spin" />
                Accesso in corso…
              </span>
            ) : (
              "Entra"
            )}
          </button>
        </motion.form>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-8 text-center text-[9px] tracking-[0.25em] uppercase text-emerald-800/35"
        >
          Area riservata al personale Emerald
        </motion.p>
      </motion.div>
    </div>
  );
}
