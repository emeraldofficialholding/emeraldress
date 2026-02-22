import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

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

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
          <Link to="/" className="font-serif text-xl tracking-[0.2em] font-semibold">
            EMERALDRESS
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs tracking-[0.15em] uppercase font-sans font-medium transition-opacity hover:opacity-70 ${
                  location.pathname === link.to ? "opacity-100" : "opacity-80"
                }`}
              >
                {link.label}
              </Link>
            ))}
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
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-2xl"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
