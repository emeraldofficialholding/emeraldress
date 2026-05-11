import type { Metadata } from "next";
import { EmeraldScannerClient } from "./emerald-scanner-client";

export const metadata: Metadata = {
  title: "Scanner di Sostenibilità AI | Analizza i tuoi capi",
  description:
    "Usa lo scanner AI di Emeraldress per analizzare la sostenibilità dei tuoi capi di abbigliamento.",
  alternates: { canonical: "/emeraldscanner" },
};

export default function EmeraldScannerPage() {
  return <EmeraldScannerClient />;
}
