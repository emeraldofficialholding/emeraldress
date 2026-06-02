import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Accedi o Registrati",
  description:
    "Accedi al tuo account Emeraldress o crea un nuovo account per gestire ordini, preferiti, recensioni e profilo.",
  robots: { index: false, follow: false },
};

// useSearchParams() richiede Suspense boundary per static rendering.
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#e4ffec]" />}>
      <LoginForm />
    </Suspense>
  );
}
