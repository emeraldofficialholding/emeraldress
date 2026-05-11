import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Accesso",
  description: "Accedi al tuo account Emeraldress per gestire ordini, preferiti e profilo.",
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
