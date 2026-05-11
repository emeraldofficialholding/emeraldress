"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const logoET = "https://jtmbnmpggzbucmgglisw.supabase.co/storage/v1/object/public/emerald-asset/emeraldress-logo-touch-collection.svg";

const links = [
  { to: "/", label: "Home" },
  { to: "/collezioni", label: "Collezioni" },
  { to: "/chisiamo", label: "Chi Siamo" },
  { to: "/sostenibilita", label: "Sostenibilità" },
  { to: "/emeraldscanner", label: "Emerald Scanner" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collezioniOpen, setCollezioniOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
                <div key={link.to} className="relative group flex items-center">
                  <Link
                    href={link.to}
                    className={`text-xs tracking-[0.15em] uppercase font-sans font-medium transition-opacity hover:opacity-70 leading-none ${
                      pathname === link.to ? "opacity-100" : "opacity-80"
                    }`}
                  >
                    {link.label}
                  </Link>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100/50 px-6 py-4 min-w-[180px] flex justify-center">
                      <Link href="/collezioni" className="hover:opacity-70 transition-opacity">
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

          <div className="flex items-center gap-4">
            <Link href="/profilo" className="hover:opacity-70 transition-opacity" aria-label="Area utente">
              <User className="w-5 h-5" />
            </Link>
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
            className="fixed inset-0 z-40 bg-background pt-20 px-8 lg:hidden"
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
