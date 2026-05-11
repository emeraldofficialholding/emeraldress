import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Accesso",
  description: "Accedi al tuo account Emeraldress per gestire ordini, preferiti e profilo.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
