import type { Metadata } from "next";
import { ProfiloClient } from "./profilo-client";

export const metadata: Metadata = {
  title: "Area Personale",
  description: "Il tuo account Emeraldress: ordini, wishlist, scansioni, recensioni e impostazioni.",
  robots: { index: false, follow: false },
};

// Auth gating gestito dal middleware (redirect a /login se non auth).
export default function ProfiloPage() {
  return <ProfiloClient />;
}
