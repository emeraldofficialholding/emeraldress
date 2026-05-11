/**
 * Analytics layer (GA4 + Consent Mode v2).
 * Tutto sandbox client-side: lazy-load di gtag, default deny finché il banner cookie accetta.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    __ga4Loaded?: boolean;
  }
}

const GA4_ID = (process.env.NEXT_PUBLIC_GA4_ID as string | undefined)?.trim();

export function initAnalytics() {
  if (typeof window === "undefined") return;
  if (!GA4_ID) return;
  if (window.__ga4Loaded) return;

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

export function grantAnalyticsConsent() {
  window.gtag?.("consent", "update", { analytics_storage: "granted" });
  initAnalytics();
}

export function denyAnalyticsConsent() {
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
}

export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  try {
    window.gtag?.("event", name, params);
  } catch {
    /* ignore */
  }
}

export function trackPageView(path: string) {
  if (!GA4_ID) return;
  window.gtag?.("event", "page_view", { page_path: path });
}
