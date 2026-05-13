import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutSuccessClient } from "./success-client";

export const metadata: Metadata = {
  title: "Ordine confermato",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20" style={{ backgroundColor: "#f7fdf9" }}>
      <div className="max-w-xl w-full">
        <CheckoutSuccessClient sessionId={session_id ?? null} />
        <p className="mt-10 text-center text-[10px] tracking-[0.3em] uppercase text-emerald-800/55">
          Emeraldress · Manifattura italiana
        </p>
        <div className="mt-2 text-center">
          <Link
            href="/"
            className="text-[11px] tracking-[0.2em] uppercase text-emerald-800/70 hover:text-emerald-950 transition-colors"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </main>
  );
}
