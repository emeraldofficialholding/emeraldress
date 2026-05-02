/**
 * Emeraldress analytics layer.
 * - Loads Google Analytics 4 (gtag) only if VITE_GA4_ID is set.
 * - Honors Consent Mode v2: defaults to denied; updateConsent() flips analytics_storage.
 * - Exposes trackEvent() for custom conversions (WhatsApp, CTA, add_to_cart, etc.).
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    __ga4Loaded?: boolean;
  }
}

const GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined)?.trim();

export function initAnalytics() {
  if (typeof window === "undefined") return;
  if (!GA4_ID) return;
  if (window.__ga4Loaded) return;

  // Skip on Lovable preview hosts to keep dev data clean.
  const h = window.location.hostname;
  if (h.includes("lovable.app") || h.includes("lovableproject.com")) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);

  window.gtag?.("config", GA4_ID, {
    anonymize_ip: true,
    send_page_view: true,
  });

  window.__ga4Loaded = true;
}

/** Call when the cookie banner accepts analytics. */
export function grantAnalyticsConsent() {
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
  });
  initAnalytics();
}

/** Call when the user opts out. */
export function denyAnalyticsConsent() {
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
  });
}

/** Track a custom event — safe no-op if GA isn't configured. */
export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {},
) {
  try {
    window.gtag?.("event", name, params);
  } catch {
    /* ignore */
  }
}

/** Manual page-view (use only with custom routers; GA4 sends one automatically). */
export function trackPageView(path: string) {
  if (!GA4_ID) return;
  window.gtag?.("event", "page_view", { page_path: path });
}