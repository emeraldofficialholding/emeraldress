"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu, X, ChevronDown, Shield, LogIn, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useCart } from "@/contexts/CartContext";

const logoET = "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-logo-touch-collection.svg";

type AuthState = "guest" | "user" | "admin";

const links = [
  { to: "/", label: "Home" },
  { to: "/collezioni", label: "Collezioni" },
  { to: "/chi-siamo", label: "Chi Siamo" },
  { to: "/sostenibilita", label: "Sostenibilità" },
  { to: "/emeraldscanner", label: "Emerald Scanner" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collezioniOpen, setCollezioniOpen] = useState(false);
  const [desktopCollezioniOpen, setDesktopCollezioniOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("guest");
  const desktopCollezioniRef = useRef<HTMLDivElement>(null);
  const { totalItems, openCart } = useCart();
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";

  // Cart icon bump: re-trigger ad ogni incremento di totalItems
  const [bumpKey, setBumpKey] = useState(0);
  const prevTotalRef = useRef(totalItems);
  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setBumpKey((k) => k + 1);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setDesktopCollezioniOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!desktopCollezioniOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!desktopCollezioniRef.current) return;
      if (!desktopCollezioniRef.current.contains(e.target as Node)) {
        setDesktopCollezioniOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [desktopCollezioniOpen]);

  // Stato auth + ruolo per decidere dove punta l'icona utente.
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const resolve = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        setAuthState("guest");
        return;
      }
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setAuthState(roleRow ? "admin" : "user");
    };
    void resolve();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) {
        setAuthState("guest");
      } else {
        void resolve();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userHref =
    authState === "guest" ? "/login" : authState === "admin" ? "/admin" : "/profilo";
  const userLabel =
    authState === "guest"
      ? "Accedi"
      : authState === "admin"
        ? "Area admin"
        : "Area utente";
  const UserIcon = authState === "guest" ? LogIn : authState === "admin" ? Shield : User;

  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent
            ? "bg-transparent text-white"
            : "bg-background/80 backdrop-blur-md text-foreground shadow-sm"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          <Link href="/" className="font-serif text-xl tracking-[0.2em] font-semibold">
            EMERALDRESS
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) =>
              link.to === "/collezioni" ? (
                <div
                  key={link.to}
                  ref={desktopCollezioniRef}
                  className="relative flex items-center"
                  onMouseEnter={() => setDesktopCollezioniOpen(true)}
                  onMouseLeave={() => setDesktopCollezioniOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setDesktopCollezioniOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={desktopCollezioniOpen}
                    className={`flex items-center gap-1 text-xs tracking-[0.15em] uppercase font-sans font-medium transition-opacity hover:opacity-70 leading-none ${
                      pathname === link.to ? "opacity-100" : "opacity-80"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-300 ${desktopCollezioniOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  <div
                    role="menu"
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 ${
                      desktopCollezioniOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    }`}
                  >
                    <div className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100/50 px-6 py-4 min-w-[180px] flex justify-center">
                      <Link
                        href="/collezioni"
                        onClick={() => setDesktopCollezioniOpen(false)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logoET} alt="Emerald Touch" className="h-8 object-contain" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`text-xs tracking-[0.15em] uppercase font-sans font-medium transition-opacity hover:opacity-70 ${
                    pathname === link.to ? "opacity-100" : "opacity-80"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            {/* Admin: scorciatoia visibile separata oltre all'icona utente */}
            {authState === "admin" && (
              <Link
                href="/profilo"
                className="hidden sm:inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Area personale"
              >
                <User className="w-4 h-4" />
                Profilo
              </Link>
            )}
            <Link
              href={userHref}
              className="relative hover:opacity-70 transition-opacity"
              aria-label={userLabel}
              title={userLabel}
            >
              <UserIcon className="w-5 h-5" />
              {authState === "admin" && (
                <span
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-background"
                  aria-hidden
                />
              )}
            </Link>
            <motion.button
              type="button"
              onClick={openCart}
              aria-label={`Apri carrello${totalItems > 0 ? ` (${totalItems} articoli)` : ""}`}
              className="relative hover:opacity-70 transition-opacity"
              key={bumpKey}
              animate={
                bumpKey > 0
                  ? { scale: [1, 1.25, 0.95, 1.1, 1], rotate: [0, -6, 6, -3, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-700 text-emerald-50 text-[10px] font-medium leading-none flex items-center justify-center ring-2 ring-background"
                  aria-hidden
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </motion.button>
            <button
              className="lg:hidden hover:opacity-70"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-28 px-8 lg:hidden"
          >
            <nav className="flex flex-col gap-6">
              {links.map((link) =>
                link.to === "/collezioni" ? (
                  <div key={link.to} className="flex flex-col">
                    <button
                      onClick={() => setCollezioniOpen((v) => !v)}
                      className="font-serif text-2xl flex items-center gap-2"
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${collezioniOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {collezioniOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <Link
                            href="/collezioni"
                            onClick={() => setMobileOpen(false)}
                            className="ml-4 mt-3 block hover:opacity-70 transition-opacity"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logoET} alt="Emerald Touch" className="h-7 object-contain" />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.to}
                    href={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="font-serif text-2xl"
                  >
                    {link.label}
                  </Link>
                )
              )}

              {/* Account section nel menu mobile */}
              <div className="mt-6 pt-6 border-t border-emerald-100/60 flex flex-col gap-4">
                <p className="text-[10px] tracking-[0.35em] uppercase text-emerald-700/60">Account</p>
                {authState === "guest" ? (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="font-serif text-xl flex items-center gap-3"
                  >
                    <LogIn className="w-5 h-5" />
                    Accedi
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/profilo"
                      onClick={() => setMobileOpen(false)}
                      className="font-serif text-xl flex items-center gap-3"
                    >
                      <User className="w-5 h-5" />
                      Area Personale
                    </Link>
                    {authState === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="font-serif text-xl flex items-center gap-3 text-emerald-700"
                      >
                        <Shield className="w-5 h-5" />
                        Admin
                      </Link>
                    )}
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
