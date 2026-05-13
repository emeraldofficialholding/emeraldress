"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Heart,
  Sparkles,
  Settings,
  LogOut,
  Loader2,
  Home,
  Star,
  Camera,
  Trash2,
  Truck,
  PackageCheck,
  Mail,
  Lock,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const supabase = getSupabaseBrowserClient();
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";
import GemLoader from "@/components/GemLoader";
import { AddressesSection } from "@/components/profile/AddressesSection";

type SectionId = "ordini" | "wishlist" | "scanner" | "recensioni" | "indirizzi" | "impostazioni";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  newsletter_opt_in: boolean;
};

type OrderItem = { name?: string; quantity?: number; price?: number; image?: string };
type Order = {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
  customer_email: string;
  tracking_number?: string | null;
  tracking_url?: string | null;
  return_status?: string | null;
};

type Review = {
  id: string;
  created_at: string;
  rating: number;
  comment: string | null;
  product_id: string;
  is_approved: boolean;
};

type ScanRow = {
  id: string;
  created_at: string;
  image_url: string | null;
  sustainability_score: number | null;
  garment_type: string | null;
  diagnosis_result: string | null;
};

const SECTIONS: { id: SectionId; label: string; icon: typeof Package; emoji: string }[] = [
  { id: "ordini", label: "I Miei Ordini", icon: Package, emoji: "📦" },
  { id: "wishlist", label: "Wishlist", icon: Heart, emoji: "💚" },
  { id: "scanner", label: "Le Mie Scansioni", icon: Sparkles, emoji: "📱" },
  { id: "recensioni", label: "Le Mie Recensioni", icon: Star, emoji: "⭐" },
  { id: "indirizzi", label: "Indirizzi", icon: Home, emoji: "🏠" },
  { id: "impostazioni", label: "Impostazioni", icon: Settings, emoji: "⚙️" },
];

const AVATAR_BUCKET = "emerald-asset";
const LOGO_EMERALD_TOUCH =
  "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-logo-touch-collection.svg";

export function ProfiloClient() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [section, setSection] = useState<SectionId>("ordini");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Deep-linking via URL hash: /profilo#wishlist apre direttamente la wishlist
  useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash.replace("#", "");
      const validIds: SectionId[] = ["ordini", "wishlist", "scanner", "recensioni", "impostazioni"];
      if ((validIds as string[]).includes(raw)) {
        setSection(raw as SectionId);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // Aggiorna l'URL hash quando cambia sezione (senza scroll jump).
  const goToSection = (id: SectionId) => {
    setSection(id);
    if (typeof window !== "undefined" && window.location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`);
    }
  };

  // Auth + profile fetch
  useEffect(() => {
    let active = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace("/login");
        return;
      }
      if (!active) return;
      setUserId(session.user.id);
      setEmail(session.user.email ?? null);

      const { data: p } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url, phone_number, newsletter_opt_in")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!active) return;
      setProfile(
        (p as unknown as Profile) ?? {
          id: session.user.id,
          first_name: null,
          last_name: null,
          avatar_url: null,
          phone_number: null,
          newsletter_opt_in: false,
        }
      );
      setLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s?.user) router.replace("/login");
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <>
        <ProfileTopBar scrolled={false} />
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, #e6f7ec 0%, #f7fdf9 45%, #f7fdf9 100%)",
          }}
        >
          <GemLoader />
        </div>
      </>
    );
  }

  const displayName = profile?.first_name || email?.split("@")[0] || "Benvenuta";
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
              goToSection(id);
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
      <ProfileTopBar scrolled={scrolled} />
      <div
        className="min-h-screen w-full max-w-full overflow-x-hidden relative"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, #e6f7ec 0%, #f7fdf9 45%, #f7fdf9 100%)",
        }}
      >
        {/* Subtle decorative gradients */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 80% 10%, rgba(16,185,129,0.10) 0%, transparent 70%), radial-gradient(50% 50% at 10% 30%, rgba(5,150,105,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto flex w-full max-w-6xl pt-16 sm:pt-20">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex w-72 shrink-0 min-h-screen border-r border-emerald-100/70 bg-white/70 backdrop-blur-sm">
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
          <main className="flex-1 w-full max-w-full overflow-x-hidden px-4 sm:px-6 lg:p-10 pt-3 sm:pt-5 lg:pt-10 pb-28 sm:pb-10 lg:pb-16">
            <SectionHeader displayName={displayName} avatarUrl={profile?.avatar_url ?? null} initials={initials} />

            {/* Tab strip orizzontale per tablet / medium screens (sm-lg) */}
            <nav
              aria-label="Sezioni profilo"
              className="hidden sm:flex lg:hidden mt-6 -mx-1 overflow-x-auto scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="flex gap-2 px-1 min-w-max">
                {SECTIONS.map(({ id, label, icon: Icon }) => {
                  const active = section === id;
                  return (
                    <button
                      key={id}
                      onClick={() => goToSection(id)}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-all whitespace-nowrap ${
                        active
                          ? "bg-emerald-900 text-emerald-50 shadow-[0_4px_12px_-2px_rgba(6,95,70,0.35)]"
                          : "bg-white/70 text-emerald-900/70 border border-emerald-200/60 hover:border-emerald-700 hover:text-emerald-950"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label.replace("I Miei ", "").replace("Le Mie ", "")}
                    </button>
                  );
                })}
              </div>
            </nav>

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-6 sm:mt-7"
              >
                {section === "ordini" && <OrdersSection email={email} />}
                {section === "wishlist" && <WishlistSection />}
                {section === "scanner" && <ScansSection />}
                {section === "recensioni" && <ReviewsSection />}
                {section === "indirizzi" && userId && (
                  <div className="group relative rounded-2xl border border-emerald-100/80 bg-white p-5 sm:p-8 shadow-[0_4px_20px_-8px_rgba(6,95,70,0.10)]">
                    <span
                      aria-hidden
                      className="absolute left-0 top-6 bottom-6 w-[2px] rounded-full bg-gradient-to-b from-emerald-400/40 via-emerald-600/30 to-transparent"
                    />
                    <div className="flex items-center gap-2.5 mb-5">
                      <span className="text-xl leading-none">🏠</span>
                      <h2
                        className="text-lg sm:text-xl text-emerald-950"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                      >
                        Indirizzi salvati
                      </h2>
                    </div>
                    <AddressesSection userId={userId} />
                  </div>
                )}
                {section === "impostazioni" && (
                  <SettingsSection
                    userId={userId!}
                    email={email}
                    profile={profile!}
                    onProfileUpdate={(p) => setProfile(p)}
                    onLoggedOut={() => router.replace("/login")}
                    toast={toast}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Bottom nav: solo smartphone vero (<sm). Tablet usa la tab strip top. */}
        <nav
          className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 shadow-[0_-4px_20px_-8px_rgba(6,95,70,0.15)] px-1 pb-[env(safe-area-inset-bottom)]"
          aria-label="Navigazione profilo"
        >
          <ul className="flex items-stretch justify-between">
            {SECTIONS.map(({ id, label, icon: Icon }) => {
              const active = section === id;
              return (
                <li key={id} className="flex-1 relative">
                  <button
                    onClick={() => goToSection(id)}
                    className={`w-full flex flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 transition-colors ${
                      active ? "text-emerald-900" : "text-emerald-900/45"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span
                      className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${
                        active
                          ? "bg-emerald-900 text-emerald-50 shadow-[0_4px_12px_-2px_rgba(6,95,70,0.35)] scale-105"
                          : ""
                      }`}
                    >
                      <Icon className="w-[17px] h-[17px]" />
                    </span>
                    <span className="text-[9px] tracking-wide truncate max-w-full px-0.5">
                      {label.replace("I Miei ", "").replace("Le Mie ", "")}
                    </span>
                  </button>
                  {active && (
                    <motion.span
                      layoutId="profilo-tab-indicator"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-emerald-700"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

// ── Top bar (slim, due loghi) ──────────────────────────────────────────────
function ProfileTopBar({ scrolled }: { scrolled: boolean }) {
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-emerald-100/70 shadow-[0_1px_0_rgba(6,95,70,0.04)]"
          : "bg-white/60 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between h-14 sm:h-16 px-4 lg:px-8">
        <Link
          href="/"
          aria-label="Torna alla home Emeraldress"
          className="font-serif text-base sm:text-lg tracking-[0.22em] font-semibold text-emerald-950 hover:opacity-70 transition-opacity"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          EMERALDRESS
        </Link>

        <div className="h-6 w-px bg-emerald-200/60" aria-hidden />

        <Link
          href="/collezioni"
          aria-label="Scopri la collezione Emerald Touch"
          className="flex items-center hover:opacity-70 transition-opacity"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_EMERALD_TOUCH}
            alt="Emerald Touch"
            className="h-5 sm:h-6 object-contain"
          />
        </Link>
      </div>
    </header>
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
  NavList: (props: { onSelect?: () => void }) => React.JSX.Element;
  onLogout: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col w-full h-full p-5">
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
function SectionHeader({
  displayName,
  avatarUrl,
  initials,
}: {
  displayName: string;
  avatarUrl: string | null;
  initials: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-white via-white to-emerald-50/60 px-4 py-5 sm:px-7 sm:py-7 shadow-[0_10px_30px_-15px_rgba(6,95,70,0.18)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(16,185,129,0.18) 0%, transparent 70%)",
        }}
      />
      <div className="relative flex items-center gap-3.5 sm:gap-5">
        <div className="shrink-0 sm:hidden">
          <Avatar avatarUrl={avatarUrl} initials={initials} size="sm" />
        </div>
        <div className="shrink-0 hidden sm:block">
          <Avatar avatarUrl={avatarUrl} initials={initials} size="lg" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-emerald-700/60 mb-1">
            Area Personale
          </p>
          <h1
            className="text-xl sm:text-3xl text-emerald-950 truncate leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            Ciao, <span className="italic text-emerald-800">{displayName}</span>
          </h1>
          <div className="mt-2 sm:mt-3 flex items-center gap-2">
            <span className="w-8 sm:w-10 h-px bg-emerald-400/60" />
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-emerald-700/50 truncate">
              Benvenuta nel tuo mondo
            </span>
          </div>
        </div>
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

// ── Card wrapper ───────────────────────────────────────────────────────────
function Card({ title, emoji, children, action }: { title: string; emoji?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="group relative rounded-2xl border border-emerald-100/80 bg-white p-5 sm:p-8 shadow-[0_4px_20px_-8px_rgba(6,95,70,0.10)] hover:shadow-[0_10px_30px_-12px_rgba(6,95,70,0.20)] transition-shadow duration-300">
      <span
        aria-hidden
        className="absolute left-0 top-6 bottom-6 w-[2px] rounded-full bg-gradient-to-b from-emerald-400/40 via-emerald-600/30 to-transparent"
      />
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          {emoji && <span className="text-xl leading-none">{emoji}</span>}
          <h2
            className="text-lg sm:text-xl text-emerald-950"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  message,
  ctaLabel,
  ctaHref,
  ctaIcon,
}: {
  icon: typeof Package;
  title: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaIcon?: typeof Package;
}) {
  const CtaIcon = ctaIcon;
  return (
    <div className="text-center py-10 sm:py-14 px-2">
      <div
        className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-[0_12px_30px_-12px_rgba(6,95,70,0.35)]"
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)",
        }}
      >
        <Icon className="w-6 h-6 text-emerald-50" strokeWidth={1.5} />
      </div>
      <p
        className="text-xl sm:text-2xl text-emerald-950 mb-2"
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
      >
        {title}
      </p>
      <p className="text-sm text-emerald-900/60 max-w-sm mx-auto leading-relaxed mb-6">
        {message}
      </p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-[11px] tracking-[0.25em] uppercase font-medium transition-all hover:opacity-95 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #052e1f 0%, #064e3b 45%, #047857 100%)",
            color: "#f0fdf4",
            boxShadow: "0 10px 28px -10px rgba(5,150,105,0.5)",
          }}
        >
          {CtaIcon && <CtaIcon className="w-3.5 h-3.5" />}
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

// ── Orders ─────────────────────────────────────────────────────────────────
function OrdersSection({ email }: { email: string | null }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const { toast } = useToast();
  const [requestingId, setRequestingId] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    (async () => {
      // RLS lets us read user_id-linked orders, guest_email orders and customer_email orders.
      // customer_email è il nuovo standard popolato dal Modulo 1 n8n. guest_email è legacy.
      const { data } = await supabase
        .from("orders")
        .select(
          "id, created_at, status, total_amount, guest_email, customer_email, order_number, tracking_number, tracking_url, return_status",
        )
        .order("created_at", { ascending: false });
      const mapped: Order[] = ((data as any[]) ?? []).map((o) => ({
        id: o.id,
        created_at: o.created_at,
        status: o.status,
        total_amount: Number(o.total_amount ?? 0),
        items: [],
        customer_email: o.customer_email ?? o.guest_email ?? "",
        tracking_number: o.tracking_number ?? null,
        tracking_url: o.tracking_url ?? null,
        return_status: o.return_status ?? null,
      }));
      setOrders(mapped);
    })();
  }, [email]);

  const requestReturn = async (orderId: string) => {
    setRequestingId(orderId);
    try {
      const res = await fetch("https://n8n.kreareweb.com/webhook/return-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, customer_email: email, source: "profilo" }),
      });
      if (!res.ok) throw new Error("Webhook ko");
      toast({ title: "Richiesta inviata", description: "Ti contatteremo via email per i prossimi passi." });
      setOrders((prev) =>
        prev ? prev.map((o) => (o.id === orderId ? { ...o, return_status: "requested" } : o)) : prev,
      );
    } catch {
      toast({ title: "Errore", description: "Impossibile inviare la richiesta. Riprova.", variant: "destructive" });
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <Card title="I Miei Ordini" emoji="📦">
      {orders === null ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-emerald-700" /></div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nessun ordine ancora"
          message="Esplora la capsule Emerald Touch: cinque capi iconici fatti per essere indossati con orgoglio."
          ctaLabel="Esplora la collezione"
          ctaHref="/collezioni"
          ctaIcon={Sparkles}
        />
      ) : (
        <ul className="divide-y divide-emerald-100">
          {orders.map((o) => {
            const items = Array.isArray(o.items) ? o.items : [];
            const isDelivered = o.status === "delivered";
            const hasReturn = !!o.return_status;
            return (
              <li key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-emerald-700/60">
                      {new Date(o.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <StatusBadge status={o.status} />
                    {hasReturn && (
                      <span className="inline-flex items-center text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                        Reso: {o.return_status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-emerald-950 truncate">
                    {items.length > 0 ? items.map((i) => i.name).filter(Boolean).join(" · ") : `Ordine #${o.id.slice(0, 8)}`}
                  </p>
                  <p className="text-xs text-emerald-900/60 mt-0.5">€ {Number(o.total_amount).toFixed(2)} · {items.length} articol{items.length === 1 ? "o" : "i"}</p>
                  {o.tracking_url && (
                    <a
                      href={o.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-950 mt-1"
                    >
                      <Truck className="w-3 h-3" />
                      Traccia spedizione {o.tracking_number ? `· ${o.tracking_number}` : ""}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isDelivered && !hasReturn && (
                    <button
                      disabled={requestingId === o.id}
                      className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-900 hover:bg-emerald-50"
                      onClick={() => requestReturn(o.id)}
                    >
                      {requestingId === o.id ? "Invio…" : "Richiedi Reso"}
                    </button>
                  )}
                  <span className="text-[10px] text-emerald-800/50 font-mono">#{o.id.slice(0, 6)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; Icon: typeof Truck }> = {
    pending: { label: "In attesa", cls: "bg-amber-50 text-amber-800", Icon: Loader2 },
    processing: { label: "In preparazione", cls: "bg-blue-50 text-blue-800", Icon: Loader2 },
    shipped: { label: "Spedito", cls: "bg-indigo-50 text-indigo-800", Icon: Truck },
    delivered: { label: "Consegnato", cls: "bg-emerald-50 text-emerald-800", Icon: PackageCheck },
    cancelled: { label: "Annullato", cls: "bg-red-50 text-red-700", Icon: Trash2 },
  };
  const m = map[status] ?? { label: status, cls: "bg-neutral-100 text-neutral-700", Icon: Package };
  const Icon = m.Icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full ${m.cls}`}>
      <Icon className="w-3 h-3" />
      {m.label}
    </span>
  );
}

// ── Wishlist ───────────────────────────────────────────────────────────────
function WishlistSection() {
  const { items, removeItem } = useWishlist();
  return (
    <Card title="Wishlist" emoji="💚">
      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Wishlist vuota"
          message="Tocca il cuore sui capi che ami: li ritrovi tutti qui, sempre a portata di mano."
          ctaLabel="Trova i tuoi preferiti"
          ctaHref="/collezioni"
          ctaIcon={Heart}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((it) => (
            <div key={it.id} className="group relative rounded-xl overflow-hidden border border-emerald-100 bg-white">
              <Link href={`/product/${it.id}`} className="block aspect-[3/4] bg-emerald-50/50">
                <img src={it.image} alt={it.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
              </Link>
              <div className="p-3">
                <p className="text-xs font-medium text-emerald-950 truncate">{it.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-emerald-900/70">€ {Number(it.price).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="text-[10px] uppercase tracking-[0.15em] text-red-700/70 hover:text-red-700"
                  >
                    Rimuovi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ── Scans ──────────────────────────────────────────────────────────────────
function ScansSection() {
  const [rows, setRows] = useState<ScanRow[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setRows([]); return; }
      const { data } = await supabase
        .from("scanner_requests")
        .select("id, created_at, image_url, sustainability_score, garment_type, diagnosis_result")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      setRows((data as any) ?? []);
    })();
  }, []);

  return (
    <Card
      title="Le Mie Scansioni"
      emoji="📱"
      action={
        <Link href="/emeraldscanner" className="text-xs uppercase tracking-[0.2em] text-emerald-800 hover:text-emerald-900">
          Nuova scansione
        </Link>
      }
    >
      {rows === null ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-emerald-700" /></div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Nessuna scansione ancora"
          message="Scansiona un capo del tuo armadio e scopri la sua impronta reale. Ogni analisi resta salvata qui."
          ctaLabel="Avvia la prima scansione"
          ctaHref="/emeraldscanner"
          ctaIcon={Sparkles}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {rows.map((s) => (
            <div key={s.id} className="rounded-xl overflow-hidden border border-emerald-100 bg-white">
              <div className="aspect-square bg-emerald-50/50">
                {s.image_url && <img src={s.image_url} alt="Scan" className="w-full h-full object-cover" />}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-emerald-950 truncate">{s.garment_type ?? "Capo"}</p>
                <p className="text-[11px] text-emerald-900/60 mt-0.5">Score: {s.sustainability_score ?? "—"}/100</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ── Reviews ────────────────────────────────────────────────────────────────
function ReviewsSection() {
  const [rows, setRows] = useState<Review[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setRows([]); return; }
      const { data } = await supabase
        .from("reviews")
        .select("id, created_at, rating, comment, product_id, is_approved")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      setRows((data as Review[]) ?? []);
    })();
  }, []);

  return (
    <Card title="Le Mie Recensioni" emoji="⭐">
      {rows === null ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-emerald-700" /></div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Star}
          title="La tua voce manca"
          message="Dopo un acquisto puoi raccontare la tua esperienza. Le tue recensioni ispirano la community Emeraldress."
          ctaLabel="Scopri la collezione"
          ctaHref="/collezioni"
          ctaIcon={Star}
        />
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li key={r.id} className="border border-emerald-100 rounded-xl p-4 bg-white">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`} />
                ))}
              </div>
              <p className="text-sm text-emerald-950">{r.comment}</p>
              <p className="text-[10px] text-emerald-800/50 mt-1">{new Date(r.created_at).toLocaleDateString("it-IT")}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

// ── Settings ───────────────────────────────────────────────────────────────
function SettingsSection({
  userId,
  email,
  profile,
  onProfileUpdate,
  onLoggedOut,
  toast,
}: {
  userId: string;
  email: string | null;
  profile: Profile;
  onProfileUpdate: (p: Profile) => void;
  onLoggedOut: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const [firstName, setFirstName] = useState(profile.first_name ?? "");
  const [lastName, setLastName] = useState(profile.last_name ?? "");
  const [phone, setPhone] = useState(profile.phone_number ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [newsletter, setNewsletter] = useState(profile.newsletter_opt_in);
  const [savingNewsletter, setSavingNewsletter] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const initials = useMemo(
    () => ((firstName[0] ?? "") + (lastName[0] ?? "")).toUpperCase() || (email?.[0]?.toUpperCase() ?? "E"),
    [firstName, lastName, email]
  );

  const saveProfile = async () => {
    setSavingProfile(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("profiles") as any)
      .upsert({ id: userId, first_name: firstName || null, last_name: lastName || null, phone_number: phone || null });
    setSavingProfile(false);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
      return;
    }
    onProfileUpdate({ ...profile, first_name: firstName, last_name: lastName, phone_number: phone });
    toast({ title: "Profilo aggiornato" });
  };

  const handleAvatar = async (file: File) => {
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `avatars/${userId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, { upsert: true });
    if (upErr) {
      setUploadingAvatar(false);
      toast({ title: "Upload fallito", description: upErr.message, variant: "destructive" });
      return;
    }
    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
    const url = data.publicUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbErr } = await (supabase.from("profiles") as any).upsert({ id: userId, avatar_url: url });
    setUploadingAvatar(false);
    if (dbErr) {
      toast({ title: "Errore", description: dbErr.message, variant: "destructive" });
      return;
    }
    onProfileUpdate({ ...profile, avatar_url: url });
    toast({ title: "Foto profilo aggiornata" });
  };

  const changePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Password troppo corta", description: "Minimo 6 caratteri.", variant: "destructive" });
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
      return;
    }
    setNewPassword("");
    toast({ title: "Password aggiornata" });
  };

  const toggleNewsletter = async (val: boolean) => {
    setSavingNewsletter(true);
    setNewsletter(val);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: pErr } = await (supabase.from("profiles") as any).upsert({ id: userId, newsletter_opt_in: val });
    if (pErr) {
      setSavingNewsletter(false);
      setNewsletter(!val);
      toast({ title: "Errore", description: pErr.message, variant: "destructive" });
      return;
    }

    if (val && email) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("subscribers") as any).upsert(
        { email, name: [firstName, lastName].filter(Boolean).join(" ") || null, phone: phone || null, source: "profilo", active: true },
        { onConflict: "email" },
      );
    } else if (!val && email) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("subscribers") as any).update({ active: false }).eq("email", email);
    }
    onProfileUpdate({ ...profile, newsletter_opt_in: val });
    setSavingNewsletter(false);
    toast({ title: val ? "Iscritta alla newsletter" : "Disiscritta dalla newsletter" });
  };

  const deleteAccount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Sessione assente");
      const { error } = await supabase.functions.invoke("delete-account", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      await supabase.auth.signOut();
      toast({ title: "Account eliminato", description: "I tuoi dati sono stati rimossi." });
      onLoggedOut();
    } catch (e: any) {
      toast({ title: "Errore", description: e?.message ?? "Impossibile eliminare l'account", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Foto profilo */}
      <Card title="Foto profilo" emoji="🖼️">
        <div className="flex items-center gap-5">
          <button
            onClick={() => fileRef.current?.click()}
            className="relative group"
            aria-label="Cambia foto profilo"
          >
            <Avatar avatarUrl={profile.avatar_url} initials={initials} size="lg" />
            <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </span>
          </button>
          <div>
            <p className="text-sm text-emerald-950">Clicca sull'avatar per caricare una nuova foto.</p>
            <p className="text-xs text-emerald-900/50 mt-1">JPG o PNG, max 2 MB.</p>
            {uploadingAvatar && <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Caricamento…</p>}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleAvatar(f);
            }}
          />
        </div>
      </Card>

      {/* Dati personali */}
      <Card title="Dati personali" emoji="👤">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fn" className="text-xs text-emerald-900/70">Nome</Label>
            <Input id="fn" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="ln" className="text-xs text-emerald-900/70">Cognome</Label>
            <Input id="ln" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="ph" className="text-xs text-emerald-900/70">Telefono</Label>
            <Input id="ph" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" placeholder="+39 ..." />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs text-emerald-900/70">Email</Label>
            <Input type="email" autoComplete="email" value={email ?? ""} disabled className="mt-1 bg-emerald-50/40" />
          </div>
        </div>
        <div className="mt-5">
          <Button onClick={saveProfile} disabled={savingProfile} className="bg-emerald-900 hover:bg-emerald-950 text-white">
            {savingProfile && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Salva modifiche
          </Button>
        </div>
      </Card>

      {/* Newsletter */}
      <Card title="Newsletter" emoji="✉️">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-emerald-950 flex items-center gap-2"><Mail className="w-4 h-4" /> Resta aggiornata sulle nuove collezioni</p>
            <p className="text-xs text-emerald-900/60 mt-1">Drop in edizione limitata, anteprime e contenuti esclusivi.</p>
          </div>
          <Switch checked={newsletter} disabled={savingNewsletter} onCheckedChange={toggleNewsletter} />
        </div>
      </Card>

      {/* Password */}
      <Card title="Cambia password" emoji="🔒">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <Label htmlFor="np" className="text-xs text-emerald-900/70">Nuova password</Label>
            <Input
              id="np"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
              placeholder="Minimo 6 caratteri"
            />
          </div>
          <Button onClick={changePassword} disabled={savingPassword || !newPassword} className="bg-emerald-900 hover:bg-emerald-950 text-white">
            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
            Aggiorna
          </Button>
        </div>
      </Card>

      {/* Elimina account */}
      <Card title="Zona pericolosa" emoji="⚠️">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-950">Elimina il mio account</p>
            <p className="text-xs text-emerald-900/60 mt-1">Verrai disconnessa e i tuoi dati verranno rimossi dal nostro sistema.</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="shrink-0">
                <Trash2 className="w-4 h-4 mr-2" /> Elimina account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicura?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione è permanente. Per completare l'eliminazione completa dei dati ti contatteremo via email.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAccount} className="bg-red-600 hover:bg-red-700">
                  Sì, elimina
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
}
