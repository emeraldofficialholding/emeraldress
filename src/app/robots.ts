import type { MetadataRoute } from "next";

const SITE_URL = "https://www.emeraldress.com";

const AI_BOTS_ALLOWED = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "Anthropic-ai",
  "PerplexityBot",
  "YouBot",
  "CCBot",
  "Google-Extended",
];

const SEO_COMPETITORS_BLOCKED = ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "Rogerbot"];

const PROTECTED_PATHS = [
  "/admin",
  "/admin/",
  "/login",
  "/coming-soon",
  "/private/",
  "/profilo",
  "/profilo/",
  "/auth/",
  "/unsubscribe",
  "/*?utm_*",
  "/*?fbclid=*",
  "/*?gclid=*",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI bot allowlist
      ...AI_BOTS_ALLOWED.map((userAgent) => ({ userAgent, allow: "/" })),
      // SEO competitors blocklist
      ...SEO_COMPETITORS_BLOCKED.map((userAgent) => ({ userAgent, disallow: "/" })),
      // Everyone else: open with protected paths
      {
        userAgent: "*",
        allow: "/",
        disallow: PROTECTED_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
