import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Pannello di controllo Emeraldress",
  robots: { index: false, follow: false },
};

// Carico admin solo client-side per evitare overhead SSR su 3600 righe + Recharts.
// Auth gating: middleware redirige a /login se non admin.
const AdminClient = dynamic(() => import("./admin-client").then((m) => m.AdminClient), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <p className="text-sm text-neutral-500 font-sans tracking-widest uppercase">Caricamento admin…</p>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminClient />;
}
