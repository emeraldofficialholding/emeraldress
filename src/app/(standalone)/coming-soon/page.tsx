import type { Metadata } from "next";
import { ComingSoonClient } from "./coming-soon-client";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "Un tocco di smeraldo sta per arrivare. Iscriviti per essere il primo a scoprire Emeraldress.",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return <ComingSoonClient />;
}
