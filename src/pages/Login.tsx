import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/external-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── Shimmer particles ─────────────────────────────────────────────────────────
const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 4,
  duration: 2.5 + Math.random() * 3,
}));

// ── Google Icon ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // Sign in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sign up state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Role-based redirect helper
  const redirectByRole = async (userId: string) => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleData) navigate("/admin", { replace: true });
    else navigate("/profilo", { replace: true });
  };

  // Handle OAuth return: if a session already exists on mount, redirect by role
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // defer to avoid deadlocks
        setTimeout(() => redirectByRole(session.user.id), 0);
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sign In ────────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setIsLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError || !data.user) {
        setError("Credenziali non valide. Riprova.");
        return;
      }
      await redirectByRole(data.user.id);
    } catch {
      setError("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Sign Up ────────────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: { emailRedirectTo: redirectUrl },
      });
      if (signUpError) {
        if (signUpError.message.toLowerCase().includes("registered")) {
          setError("Email già registrata. Prova ad accedere.");
        } else {
          setError(signUpError.message);
        }
        return;
      }
      if (data.session && data.user) {
        await redirectByRole(data.user.id);
      } else {
        setInfo("Account creato. Controlla la tua email per confermare.");
      }
    } catch {
      setError("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google OAuth ───────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setError(null);
    setInfo(null);
    setIsLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/login` },
      });
      if (oauthError) {
        setError("Accesso Google non disponibile. Riprova.");
        setIsLoading(false);
      }
    } catch {
      setError("Si è verificato un errore con Google.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden py-10"
        style={{ backgroundColor: "#e4ffec" }}
      >
        {/* Shimmer particles */}
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

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(52,211,153,0.08) 0%, transparent 70%)",
          }}
        />

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
            className="text-center mb-8"
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-emerald-700/60 mb-3">
              Emeraldress
            </p>
            <h1
              className="text-3xl text-emerald-950"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              {tab === "signin" ? "Accesso" : "Registrazione"}
            </h1>
            <div className="mt-3 mx-auto w-10 h-px bg-emerald-400/50" />
          </motion.div>

          <Tabs value={tab} onValueChange={(v) => { setTab(v as "signin" | "signup"); setError(null); setInfo(null); }}>
            <TabsList className="grid w-full grid-cols-2 bg-white/50 border border-emerald-200 mb-5">
              <TabsTrigger value="signin" className="text-[11px] tracking-[0.2em] uppercase data-[state=active]:bg-emerald-900 data-[state=active]:text-emerald-50">
                Accedi
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-[11px] tracking-[0.2em] uppercase data-[state=active]:bg-emerald-900 data-[state=active]:text-emerald-50">
                Crea Account
              </TabsTrigger>
            </TabsList>

            {/* ── Sign In ─────────────────────────────────────── */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-[10px] tracking-[0.25em] uppercase text-emerald-800/60 mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/60 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-950 placeholder:text-emerald-700/30 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300 transition-all"
                    placeholder="nome@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-[10px] tracking-[0.25em] uppercase text-emerald-800/60 mb-2">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/60 border border-emerald-200 rounded-lg px-4 py-3 pr-11 text-sm text-emerald-950 placeholder:text-emerald-700/30 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300 transition-all"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600/50 hover:text-emerald-700">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <SubmitButton isLoading={isLoading} label="Entra" loadingLabel="Accesso in corso…" />
              </form>
            </TabsContent>

            {/* ── Sign Up ─────────────────────────────────────── */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label htmlFor="signup-email" className="block text-[10px] tracking-[0.25em] uppercase text-emerald-800/60 mb-2">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-white/60 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-950 placeholder:text-emerald-700/30 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300 transition-all"
                    placeholder="nome@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-[10px] tracking-[0.25em] uppercase text-emerald-800/60 mb-2">Password</label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full bg-white/60 border border-emerald-200 rounded-lg px-4 py-3 pr-11 text-sm text-emerald-950 placeholder:text-emerald-700/30 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300 transition-all"
                      placeholder="Almeno 6 caratteri"
                    />
                    <button type="button" onClick={() => setShowSignupPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600/50 hover:text-emerald-700">
                      {showSignupPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <SubmitButton isLoading={isLoading} label="Crea Account" loadingLabel="Creazione in corso…" />
              </form>
            </TabsContent>
          </Tabs>

          {/* Messages */}
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-xs text-red-600/80 text-center tracking-wide">
              {error}
            </motion.p>
          )}
          {info && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-xs text-emerald-700 text-center tracking-wide">
              {info}
            </motion.p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-emerald-300/40" />
            <span className="text-[9px] tracking-[0.3em] uppercase text-emerald-800/50">oppure continua con</span>
            <div className="flex-1 h-px bg-emerald-300/40" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-white border border-emerald-200 text-sm text-emerald-950 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            <GoogleIcon />
            <span className="tracking-wide font-medium">Accedi con Google</span>
          </button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-8 text-center text-[9px] tracking-[0.25em] uppercase text-emerald-800/35"
          >
            Area Emeraldress · Accesso sicuro
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}

// ── Submit Button ───────────────────────────────────────────────────────────
function SubmitButton({ isLoading, label, loadingLabel }: { isLoading: boolean; label: string; loadingLabel: string }) {
  return (
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
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
