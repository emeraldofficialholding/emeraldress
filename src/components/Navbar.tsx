import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import logoET from "@/assets/logo-emeraldtouch.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/collezioni", label: "Collezioni", hasSubmenu: true },
  { to: "/chisiamo", label: "Chi Siamo" },
  { to: "/sostenibilita", label: "Sostenibilità" },
  { to: "/emeraldscanner", label: "Emerald Scanner" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collezioniOpen, setCollezioniOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartControls = useAnimation();
  const { totalItems, setIsOpen } = useCart();
  const prevTotal = useRef(totalItems);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (totalItems > prevTotal.current) {
      cartControls.start({
        scale: [1, 1.35, 0.88, 1.12, 1],
        transition: { duration: 0.45, ease: "easeInOut" },
      });
    }
    prevTotal.current = totalItems;
  }, [totalItems, cartControls]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setCollezioniOpen(false);
  }, [location.pathname]);

  const transparent = isHome && !scrolled && !mobileOpen;

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDesktopDropdown(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDesktopDropdown(false), 150);
  };

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
          <Link to="/" className="font-serif text-xl tracking-[0.2em] font-semibold">
            EMERALDRESS
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) =>
              link.hasSubmenu ? (
                <div
                  key={link.to}
                  className="relative group"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to={link.to}
                    className={`text-xs tracking-[0.15em] uppercase font-sans font-medium transition-opacity hover:opacity-70 flex items-center gap-1 py-2 ${
                      location.pathname === link.to || location.pathname.startsWith("/collezioni") ? "opacity-100" : "opacity-80"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${desktopDropdown ? "rotate-180" : ""}`} />
                  </Link>

                  {/* Invisible bridge to prevent hover gap */}
                  {desktopDropdown && (
                    <div className="absolute top-full left-0 right-0 h-3" />
                  )}

                  <AnimatePresence>
                    {desktopDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-[calc(100%+0.5rem)] left-0 bg-white rounded-lg shadow-lg border border-emerald-100/60 p-4 min-w-[200px] z-[60]"
                      >
                        <Link
                          to="/collezioni"
                          className="block text-xs tracking-[0.1em] uppercase font-sans font-medium text-emerald-900 hover:text-emerald-600 transition-colors mb-3 pb-3 border-b border-emerald-50"
                          onClick={() => setDesktopDropdown(false)}
                        >
                          Tutte le Collezioni
                        </Link>
                        <Link
                          to="/collezioni?category=emerald-touch"
                          className="flex items-center gap-3 group/item py-1"
                          onClick={() => setDesktopDropdown(false)}
                        >
                          <img src={logoET} alt="Emerald Touch" className="h-5 w-auto object-contain group-hover/item:opacity-80 transition-opacity" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-xs tracking-[0.15em] uppercase font-sans font-medium transition-opacity hover:opacity-70 ${
                    location.pathname === link.to ? "opacity-100" : "opacity-80"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:opacity-70 transition-opacity"><User className="w-5 h-5" /></Link>
            <motion.button
              className="hover:opacity-70 transition-opacity relative"
              onClick={() => setIsOpen(true)}
              animate={cartControls}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-sans">
                  {totalItems}
                </span>
              )}
            </motion.button>
            <button className="lg:hidden hover:opacity-70" onClick={() => setMobileOpen(!mobileOpen)}>
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
                link.hasSubmenu ? (
                  <div key={link.to}>
                    <button
                      onClick={() => setCollezioniOpen(!collezioniOpen)}
                      className="font-serif text-2xl flex items-center gap-2 w-full text-left"
                    >
                      {link.label}
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${collezioniOpen ? "rotate-180" : ""}`} />
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
                          <div className="pl-4 pt-4 pb-2 flex flex-col gap-3">
                            <Link
                              to="/collezioni"
                              onClick={() => setMobileOpen(false)}
                              className="text-lg font-sans text-foreground/70"
                            >
                              Tutte le Collezioni
                            </Link>
                            <Link
                              to="/collezioni?category=emerald-touch"
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-3"
                            >
                              <img src={logoET} alt="Emerald Touch" className="h-5 w-auto object-contain" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
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
