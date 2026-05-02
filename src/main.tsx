import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics, grantAnalyticsConsent } from "./lib/analytics";

createRoot(document.getElementById("root")!).render(<App />);

// ── Service Worker (con guardie iframe/preview) ──
const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();
const isPreviewHost =
  window.location.hostname.includes("lovable.app") ||
  window.location.hostname.includes("lovableproject.com") ||
  window.location.hostname === "localhost";

if ("serviceWorker" in navigator) {
  if (isInIframe || isPreviewHost) {
    // Pulizia eventuali SW già registrati in dev/preview
    navigator.serviceWorker.getRegistrations().then((regs) =>
      regs.forEach((r) => r.unregister()),
    );
  } else {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
}

// ── Analytics: rispetta il consenso già salvato ──
try {
  if (typeof localStorage !== "undefined" &&
      localStorage.getItem("emeraldress_cookie_consent_v1") === "accepted") {
    grantAnalyticsConsent();
  } else {
    initAnalytics(); // no-op se non c'è VITE_GA4_ID
  }
} catch {}
