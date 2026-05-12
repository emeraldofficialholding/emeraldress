import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { PageTracker } from "@/components/PageTracker";

// Layout pubblico: navbar fissa in alto, footer in fondo, cookie banner persistente.
// Usato per /, /collezioni, /chi-siamo, /sostenibilita, /emeraldscanner, /product/[slug],
// /faq, /resi, /privacy, /termini.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <PageTracker />
      {children}
      <Footer />
      <CookieBanner />
    </>
  );
}
