import "server-only";

import { randomUUID } from "node:crypto";

const N8N_EMAIL_SEND_URL =
  process.env.NEXT_PUBLIC_N8N_EMAIL_URL ??
  "https://n8n.kreareweb.com/webhook/emerald/email-send-b2a4d6f8c0e2a4b6d8f0c2e4a6b8d0f2";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "emeraldresshop@gmail.com";

export interface EmailRecipient {
  email: string;
  name?: string;
}

/**
 * Manda email transazionale tramite WF11 EMERALD-Email-Send (n8n).
 * Best-effort: se n8n non risponde, l'errore è loggato ma non blocca.
 *
 * Pattern: l'HTML è preparato lato Vercel (brand consistency, type-safe),
 * n8n orchestra solo il delivery Gmail. Niente "build HTML in n8n Code node".
 */
export async function sendBrandedEmail(opts: {
  templateName: string; // identifier per log/dedup (es. "order_cancelled")
  subject: string;
  html: string;
  recipients: EmailRecipient[];
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(N8N_EMAIL_SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign_id: `tx-${opts.templateName}-${randomUUID()}`,
        template_name: opts.templateName,
        subject: opts.subject,
        html: opts.html,
        recipients: opts.recipients.map((r) => ({
          email: r.email,
          name: r.name ?? "",
          token: "",
        })),
        scheduled_at: null,
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `n8n responded ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "fetch failed",
    };
  }
}

export const ADMIN_NOTIFICATION_EMAIL = ADMIN_EMAIL;

// ── Template HTML brand Emeraldress ──────────────────────────────────────
// Layout minimale verde brand, riusato da tutti i transactional emails.

interface BrandLayoutOpts {
  preheader?: string;
  title: string;
  body: string; // HTML inner
  ctaUrl?: string;
  ctaLabel?: string;
}

export function brandLayout(opts: BrandLayoutOpts): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#e4ffec;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#064e3b;">
${opts.preheader ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(opts.preheader)}</div>` : ""}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#e4ffec;padding:40px 20px;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(6,95,70,0.08);">
        <tr>
          <td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid #d1fae5;">
            <div style="font-family:'Playfair Display',Georgia,serif;font-size:28px;letter-spacing:0.2em;color:#064e3b;font-weight:600;">EMERALDRESS</div>
            <div style="margin-top:6px;font-size:10px;letter-spacing:0.35em;color:#059669;text-transform:uppercase;">Atelier Sostenibile</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <h1 style="margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;font-size:24px;color:#064e3b;font-weight:400;">${escapeHtml(opts.title)}</h1>
            <div style="font-size:15px;line-height:1.7;color:#1f2937;">
              ${opts.body}
            </div>
            ${
              opts.ctaUrl && opts.ctaLabel
                ? `<div style="text-align:center;margin:32px 0 8px;"><a href="${escapeAttr(opts.ctaUrl)}" style="display:inline-block;background-color:#064e3b;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;">${escapeHtml(opts.ctaLabel)}</a></div>`
                : ""
            }
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 32px;border-top:1px solid #d1fae5;text-align:center;font-size:11px;color:#6b7280;line-height:1.6;">
            <p style="margin:0 0 8px;">Emeraldress · Atelier Made in Italy · Costa Smeralda</p>
            <p style="margin:0;">
              <a href="https://www.emeraldress.com" style="color:#059669;text-decoration:none;">emeraldress.com</a>
              &nbsp;·&nbsp;
              <a href="mailto:emeraldresshop@gmail.com" style="color:#059669;text-decoration:none;">supporto</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

// Util escape (mini, no deps)
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;");
}
