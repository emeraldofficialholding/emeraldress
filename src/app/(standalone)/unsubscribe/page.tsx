import type { Metadata } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disiscrizione Newsletter",
  description: "Disiscriviti dalla newsletter Emeraldress.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

/**
 * Disiscrizione newsletter via token.
 * Usa service_role per bypassare RLS — l'UPDATE è ristretto al token specifico.
 * NESSUNA policy RLS pubblica esposta su subscribers (più sicuro).
 *
 * Link nei template email del modulo n8n Comunicazioni:
 *   https://www.emeraldress.com/unsubscribe?token=<subscribers.token>
 */
export default async function UnsubscribePage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return <UnsubscribeShell variant="error" message="Link di disiscrizione non valido. Token mancante." />;
  }

  // Validazione UUID base (evita query inutili su input garbage)
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(token)) {
    return <UnsubscribeShell variant="error" message="Token non valido." />;
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("subscribers")
      .update({ active: false, status: "unsubscribed" })
      .eq("token", token)
      .select("email")
      .maybeSingle();

    if (error) {
      console.error("[unsubscribe] supabase error:", error);
      return <UnsubscribeShell variant="error" message="Errore tecnico. Riprova più tardi o scrivici a emeraldresshop@gmail.com." />;
    }

    if (!data) {
      return <UnsubscribeShell variant="error" message="Token non trovato. Probabilmente sei già disiscritto." />;
    }

    return <UnsubscribeShell variant="success" message={`Disiscrizione completata per ${data.email}. Ci dispiace vederti andare.`} />;
  } catch (e) {
    console.error("[unsubscribe] unexpected error:", e);
    return <UnsubscribeShell variant="error" message="Errore tecnico. Riprova più tardi." />;
  }
}

function UnsubscribeShell({ variant, message }: { variant: "success" | "error"; message: string }) {
  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;
  const colors =
    variant === "success"
      ? "text-emerald-700"
      : "text-amber-700";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{ backgroundColor: "#e4ffec" }}
    >
      <div className="max-w-md w-full bg-white border border-emerald-100 rounded-2xl shadow-sm p-10 text-center">
        <Icon className={`w-12 h-12 mx-auto mb-5 ${colors}`} strokeWidth={1.5} />
        <p className="text-[10px] tracking-[0.35em] uppercase text-emerald-700/60 mb-3">Emeraldress · Newsletter</p>
        <h1
          className="text-2xl text-emerald-950 mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          {variant === "success" ? "Disiscrizione completata" : "Non possiamo procedere"}
        </h1>
        <p className="text-sm text-emerald-900/70 leading-relaxed mb-8">{message}</p>
        <Link
          href="/"
          className="inline-block text-[11px] tracking-[0.25em] uppercase text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
        >
          Torna al sito
        </Link>
      </div>
    </div>
  );
}
