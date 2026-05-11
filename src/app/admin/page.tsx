import type { Metadata } from "next";
import { AdminClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Pannello di controllo Emeraldress",
  robots: { index: false, follow: false },
};

// Auth gating: middleware redirige a /login se non admin.
// AdminClient è "use client" → SSR del primo frame + hydration, no SSR overhead reale
// perché tutta la logica gira lato browser dopo l'idratazione.
export default function AdminPage() {
  return <AdminClient />;
}
