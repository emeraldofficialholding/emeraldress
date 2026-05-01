import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BASE = "https://www.emeraldress.com";

const STATIC_URLS = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/collezioni", changefreq: "weekly", priority: "0.9" },
  { loc: "/sostenibilita", changefreq: "monthly", priority: "0.7" },
  { loc: "/chisiamo", changefreq: "monthly", priority: "0.7" },
  { loc: "/emeraldscanner", changefreq: "monthly", priority: "0.6" },
  { loc: "/faq", changefreq: "monthly", priority: "0.5" },
  { loc: "/resi", changefreq: "yearly", priority: "0.4" },
  { loc: "/privacy", changefreq: "yearly", priority: "0.4" },
  { loc: "/termini", changefreq: "yearly", priority: "0.4" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: products } = await supabase
      .from("products")
      .select("id, created_at, status")
      .neq("status", "draft");

    const escapeXml = (s: string) =>
      s.replace(/[<>&'"]/g, (c) =>
        ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!,
      );

    const urls: string[] = [];

    for (const u of STATIC_URLS) {
      urls.push(
        `  <url>\n    <loc>${BASE}${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
      );
    }

    for (const p of products ?? []) {
      const lastmod = new Date(p.created_at).toISOString().split("T")[0];
      urls.push(
        `  <url>\n    <loc>${BASE}/product/${escapeXml(p.id)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<error>${(err as Error).message}</error>`,
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/xml" } },
    );
  }
});
