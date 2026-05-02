/**
 * Emeraldress Service Worker — minimal & safe.
 * Strategy:
 *  - HTML navigations: NetworkFirst (no stale shell ever locks devices).
 *  - Static brand assets (favicons, og-image, fonts via gstatic): CacheFirst.
 *  - Everything else: pass-through.
 * Auto-cleans old caches on activate.
 */
const VERSION = "v1";
const STATIC_CACHE = `emeraldress-static-${VERSION}`;
const HTML_CACHE = `emeraldress-html-${VERSION}`;

const STATIC_PATHS = [
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_PATHS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== HTML_CACHE)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Never intercept Supabase / API / analytics / Stripe traffic.
  if (
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("supabase.in") ||
    url.hostname.includes("google-analytics.com") ||
    url.hostname.includes("googletagmanager.com") ||
    url.hostname.includes("stripe.com") ||
    url.hostname.includes("facebook") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // HTML navigations → NetworkFirst with timeout, fallback to cached index.
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await Promise.race([
            fetch(req),
            new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000)),
          ]);
          const cache = await caches.open(HTML_CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(req);
          if (cached) return cached;
          const fallback = await caches.match("/");
          return fallback || new Response("Offline", { status: 503 });
        }
      })(),
    );
    return;
  }

  // Static brand assets → CacheFirst.
  if (
    STATIC_PATHS.some((p) => url.pathname === p) ||
    url.hostname === "fonts.gstatic.com"
  ) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            const cache = caches.open(STATIC_CACHE);
            cache.then((c) => c.put(req, res.clone()));
            return res;
          }),
      ),
    );
  }
});

// Allow page to ask for immediate skipWaiting on new deploys.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});