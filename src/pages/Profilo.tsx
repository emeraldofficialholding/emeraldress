import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Heart,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  Loader2,
  Home,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import GemLoader from "@/components/GemLoader";

type SectionId = "ordini" | "wishlist" | "scanner" | "impostazioni";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
};

const SECTIONS: { id: SectionId; label: string; icon: typeof Package; emoji: string; description: string }[] = [
  { id: "ordini", label: "I Miei Ordini", icon: Package, emoji: "📦", description: "Storico ordini, tracking e gestione resi." },
  { id: "wishlist", label: "Wishlist", icon: Heart, emoji: "💚", description: "I capi che hai salvato per dopo." },
  { id: "scanner", label: "Emerald Scanner", icon: Sparkles, emoji: "📱", description: "Storico delle tue diagnosi AI sui tessuti." },
  { id: "impostazioni", label: "Impostazioni Account", icon: Settings, emoji: "⚙️", description: "Dati personali, newsletter e password." },
];

export default function Profilo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [section, setSection] = useState<SectionId>("ordini");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth + profile fetch
  useEffect(() => {
    let active = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/login", { replace: true });
        return;
      }
      if (!active) return;
      setEmail(session.user.email ?? null);

      const { data: p } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!active) return;
      setProfile(
        p ?? {
          id: session.user.id,
          first_name: null,
          last_name: null,
          avatar_url: null,
        }
      );
      setLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s?.user) navigate("/login", { replace: true });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f7fdf9" }}>
        <GemLoader />
      </div>
    );
  }

  const displayName = profile?.first_name || email?.split("@")[0] || "Ospite";
  const initials = (
    (profile?.first_name?.[0] ?? "") + (profile?.last_name?.[0] ?? "")
  ).toUpperCase() || (email?.[0]?.toUpperCase() ?? "E");

  const NavList = ({ onSelect }: { onSelect?: () => void }) => (
    <nav className="space-y-1">
      {SECTIONS.map(({ id, label, icon: Icon }) => {
        const active = section === id;
        return (
          <button
            key={id}
            onClick={() => {
              setSection(id);
              onSelect?.();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
              active
                ? "bg-emerald-900 text-emerald-50 shadow-sm"
                : "text-emerald-950/70 hover:bg-emerald-100/60"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="font-medium tracking-wide">{label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      <Helmet>
        <title>Area Personale · Emeraldress</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen w-full max-w-full overflow-x-hidden" style={{ backgroundColor: "#f7fdf9" }}>
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-emerald-100 px-4 h-14 flex items-center justify-between">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="p-2 -ml-2 text-emerald-900" aria-label="Apri menu">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-white">
              <ProfileSidebar
                displayName={displayName}
                initials={initials}
                avatarUrl={profile?.avatar_url ?? null}
                email={email}
                NavList={NavList}
                onLogout={handleLogout}
                onClose={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
          <p
            className="text-sm tracking-[0.25em] uppercase text-emerald-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Profilo
          </p>
          <button
            onClick={() => navigate("/")}
            className="p-2 -mr-2 text-emerald-900"
            aria-label="Torna al sito"
          >
            <Home className="w-5 h-5" />
          </button>
        </header>

        <div className="mx-auto max-w-6xl flex">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex w-72 shrink-0 min-h-screen border-r border-emerald-100 bg-white/60">
            <ProfileSidebar
              displayName={displayName}
              initials={initials}
              avatarUrl={profile?.avatar_url ?? null}
              email={email}
              NavList={NavList}
              onLogout={handleLogout}
            />
          </aside>

          {/* Main */}
          <main className="flex-1 w-full max-w-full overflow-x-hidden p-4 lg:p-10">
            <SectionHeader displayName={displayName} />

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-8"
              >
                <SectionPlaceholder id={section} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function ProfileSidebar({
  displayName,
  initials,
  avatarUrl,
  email,
  NavList,
  onLogout,
  onClose,
}: {
  displayName: string;
  initials: string;
  avatarUrl: string | null;
  email: string | null;
  NavList: (props: { onSelect?: () => void }) => JSX.Element;
  onLogout: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col w-full h-full p-5">
      {/* Identity card */}
      <div className="flex items-center gap-3 pb-5 mb-4 border-b border-emerald-100">
        <Avatar avatarUrl={avatarUrl} initials={initials} size="sm" />
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.3em] uppercase text-emerald-700/60">Cliente</p>
          <p className="text-sm font-medium text-emerald-950 truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
            {displayName}
          </p>
          {email && <p className="text-[11px] text-emerald-800/50 truncate">{email}</p>}
        </div>
      </div>

      <NavList onSelect={onClose} />

      <div className="mt-auto pt-4 space-y-1 border-t border-emerald-100">
        <a
          href="/"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-emerald-900/70 hover:bg-emerald-100/60 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="font-medium tracking-wide">Torna al sito</span>
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-700/80 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium tracking-wide">Esci</span>
        </button>
      </div>
    </div>
  );
}

// ── Header (greeting) ──────────────────────────────────────────────────────
function SectionHeader({ displayName }: { displayName: string }) {
  return (
    <div className="flex items-center gap-5">
      <div className="hidden sm:block">
        <Avatar avatarUrl={null} initials={displayName[0]?.toUpperCase() ?? "E"} size="lg" />
      </div>
      <div>
        <p className="text-[10px] tracking-[0.35em] uppercase text-emerald-700/60 mb-2">Area Personale</p>
        <h1
          className="text-2xl sm:text-3xl text-emerald-950"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          Ciao, {displayName}!
        </h1>
        <div className="mt-3 w-10 h-px bg-emerald-400/50" />
      </div>
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({
  avatarUrl,
  initials,
  size,
}: {
  avatarUrl: string | null;
  initials: string;
  size: "sm" | "lg";
}) {
  const dim = size === "lg" ? "w-20 h-20 text-2xl" : "w-11 h-11 text-sm";
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt="Avatar"
        className={`${dim} rounded-full object-cover border border-emerald-200`}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center text-emerald-50 font-medium border border-emerald-200`}
      style={{
        background: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
        fontFamily: "'Playfair Display', serif",
      }}
    >
      {initials}
    </div>
  );
}

// ── Placeholder per ogni sezione ───────────────────────────────────────────
function SectionPlaceholder({ id }: { id: SectionId }) {
  const meta = SECTIONS.find((s) => s.id === id)!;
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 sm:p-10 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{meta.emoji}</span>
        <h2
          className="text-xl sm:text-2xl text-emerald-950"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          {meta.label}
        </h2>
      </div>
      <p className="text-sm text-emerald-900/60 max-w-xl">{meta.description}</p>
      <div className="mt-8 flex items-center gap-3 text-emerald-700/50 text-xs tracking-[0.2em] uppercase">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Sezione in arrivo
      </div>
    </div>
  );
}
