import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
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
  Star,
  Camera,
  Trash2,
  Truck,
  PackageCheck,
  Mail,
  Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

type SectionId = "ordini" | "wishlist" | "scanner" | "recensioni" | "impostazioni";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
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
  { id: "impostazioni", label: "Impostazioni", icon: Settings, emoji: "⚙️" },
];

const AVATAR_BUCKET = "emerald-asset";

export default function Profilo() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
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
      setUserId(session.user.id);
      setEmail(session.user.email ?? null);

      const { data: p } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url, phone, newsletter_opt_in")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!active) return;
      setProfile(
        p ?? {
          id: session.user.id,
          first_name: null,
          last_name: null,
          avatar_url: null,
          phone: null,
          newsletter_opt_in: false,
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
          <main className="flex-1 w-full max-w-full overflow-x-hidden p-4 lg:p-10 pb-24 lg:pb-10">
            <SectionHeader displayName={displayName} avatarUrl={profile?.avatar_url ?? null} initials={initials} />

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-8"
              >
                {section === "ordini" && <OrdersSection email={email} />}
                {section === "wishlist" && <WishlistSection />}
                {section === "scanner" && <ScansSection />}
                {section === "recensioni" && <ReviewsSection />}
                {section === "impostazioni" && (
                  <SettingsSection
                    userId={userId!}
                    email={email}
                    profile={profile!}
                    onProfileUpdate={(p) => setProfile(p)}
                    onLoggedOut={() => navigate("/login", { replace: true })}
                    toast={toast}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Mobile bottom nav (app-style) */}
        <nav
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-emerald-100 px-1 pb-[env(safe-area-inset-bottom)]"
          aria-label="Navigazione profilo"
        >
          <ul className="flex items-stretch justify-between">
            {SECTIONS.map(({ id, label, icon: Icon }) => {
              const active = section === id;
              return (
                <li key={id} className="flex-1">
                  <button
                    onClick={() => setSection(id)}
                    className={`w-full flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                      active ? "text-emerald-900" : "text-emerald-900/50"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                        active ? "bg-emerald-900 text-emerald-50" : ""
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <span className="text-[9px] tracking-wide truncate max-w-full px-1">
                      {label.replace("I Miei ", "").replace("Le Mie ", "")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
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
    <div className="flex items-center gap-5">
      <div className="hidden sm:block">
        <Avatar avatarUrl={avatarUrl} initials={initials} size="lg" />
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

// ── Card wrapper ───────────────────────────────────────────────────────────
function Card({ title, emoji, children, action }: { title: string; emoji?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          {emoji && <span className="text-xl">{emoji}</span>}
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

function EmptyState({ icon: Icon, title, message }: { icon: typeof Package; title: string; message: string }) {
  return (
    <div className="text-center py-10">
      <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-emerald-700/70" />
      </div>
      <p className="text-sm font-medium text-emerald-950">{title}</p>
      <p className="text-xs text-emerald-900/50 mt-1 max-w-xs mx-auto">{message}</p>
    </div>
  );
}

// ── Orders ─────────────────────────────────────────────────────────────────
function OrdersSection({ email }: { email: string | null }) {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!email) return;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, created_at, status, total_amount, items, customer_email")
        .eq("customer_email", email)
        .order("created_at", { ascending: false });
      setOrders((data as any) ?? []);
    })();
  }, [email]);

  return (
    <Card title="I Miei Ordini" emoji="📦">
      {orders === null ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-emerald-700" /></div>
      ) : orders.length === 0 ? (
        <EmptyState icon={Package} title="Nessun ordine ancora" message="Quando completerai un acquisto lo troverai qui con tracking e dettagli." />
      ) : (
        <ul className="divide-y divide-emerald-100">
          {orders.map((o) => {
            const items = Array.isArray(o.items) ? o.items : [];
            const isDelivered = o.status === "delivered";
            return (
              <li key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-emerald-700/60">
                      {new Date(o.created_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-sm text-emerald-950 truncate">
                    {items.length > 0 ? items.map((i) => i.name).filter(Boolean).join(" · ") : `Ordine #${o.id.slice(0, 8)}`}
                  </p>
                  <p className="text-xs text-emerald-900/60 mt-0.5">€ {Number(o.total_amount).toFixed(2)} · {items.length} articol{items.length === 1 ? "o" : "i"}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isDelivered && (
                    <button
                      className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-900 hover:bg-emerald-50"
                      onClick={() => alert("Richiesta di reso registrata. Ti contatteremo via email.")}
                    >
                      Richiedi Reso
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
        <EmptyState icon={Heart} title="Wishlist vuota" message="Salva i tuoi capi preferiti dal sito e li ritroverai qui." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <div key={it.id} className="group relative rounded-xl overflow-hidden border border-emerald-100 bg-white">
              <Link to={`/product/${it.id}`} className="block aspect-[3/4] bg-emerald-50/50">
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
      // Lo schema attuale non lega user_id alle scansioni: mostriamo le ultime
      // dell'utente (placeholder = empty UI elegante se nulla).
      const { data } = await supabase
        .from("scanner_requests")
        .select("id, created_at, image_url, sustainability_score, garment_type, diagnosis_result")
        .order("created_at", { ascending: false })
        .limit(0);
      setRows((data as any) ?? []);
    })();
  }, []);

  return (
    <Card
      title="Le Mie Scansioni"
      emoji="📱"
      action={
        <Link to="/emeraldscanner" className="text-xs uppercase tracking-[0.2em] text-emerald-800 hover:text-emerald-900">
          Nuova scansione
        </Link>
      }
    >
      {rows === null ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-emerald-700" /></div>
      ) : rows.length === 0 ? (
        <EmptyState icon={Sparkles} title="Nessuna scansione" message="Usa l'Emerald Scanner per analizzare la sostenibilità di un capo: troverai qui lo storico." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
      // Schema attuale: nessun user_id sulle reviews → UI placeholder elegante
      setRows([]);
    })();
  }, []);

  return (
    <Card title="Le Mie Recensioni" emoji="⭐">
      {rows === null ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-emerald-700" /></div>
      ) : rows.length === 0 ? (
        <EmptyState icon={Star} title="Nessuna recensione" message="Dopo aver acquistato un capo potrai lasciare una recensione e la troverai qui." />
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
  const [phone, setPhone] = useState(profile.phone ?? "");
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
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, first_name: firstName || null, last_name: lastName || null, phone: phone || null });
    setSavingProfile(false);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
      return;
    }
    onProfileUpdate({ ...profile, first_name: firstName, last_name: lastName, phone });
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
    const { error: dbErr } = await supabase.from("profiles").upsert({ id: userId, avatar_url: url });
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

    const { error: pErr } = await supabase.from("profiles").upsert({ id: userId, newsletter_opt_in: val });
    if (pErr) {
      setSavingNewsletter(false);
      setNewsletter(!val);
      toast({ title: "Errore", description: pErr.message, variant: "destructive" });
      return;
    }

    if (val && email) {
      await supabase.from("subscribers").upsert(
        { email, name: [firstName, lastName].filter(Boolean).join(" ") || null, phone: phone || null, source: "profilo", active: true },
        { onConflict: "email" } as any
      );
    } else if (!val && email) {
      await supabase.from("subscribers").update({ active: false }).eq("email", email);
    }
    onProfileUpdate({ ...profile, newsletter_opt_in: val });
    setSavingNewsletter(false);
    toast({ title: val ? "Iscritta alla newsletter" : "Disiscritta dalla newsletter" });
  };

  const deleteAccount = async () => {
    // Senza service role non possiamo cancellare auth.users dal client.
    // Logout + messaggio: l'eliminazione completa va richiesta via supporto.
    await supabase.auth.signOut();
    toast({
      title: "Richiesta inviata",
      description: "Ti abbiamo disconnessa. Contatta supporto@emeraldress per la cancellazione completa dei dati.",
    });
    onLoggedOut();
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
            <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="ln" className="text-xs text-emerald-900/70">Cognome</Label>
            <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="ph" className="text-xs text-emerald-900/70">Telefono</Label>
            <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" placeholder="+39 ..." />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs text-emerald-900/70">Email</Label>
            <Input value={email ?? ""} disabled className="mt-1 bg-emerald-50/40" />
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
