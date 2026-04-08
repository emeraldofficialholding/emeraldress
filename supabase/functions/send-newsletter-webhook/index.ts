import { createClient } from "npm:@supabase/supabase-js@2.95.3";
import { corsHeaders } from "npm:@supabase/supabase-js@2.95.3/cors";

const WEBHOOK_URL = "https://n8n.kreareweb.com/webhook/email-send";

type Recipient = {
  email: string;
  name?: string;
};

type NewsletterPayload = {
  subject: string;
  html: string;
  recipients: Recipient[];
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function isValidRecipient(recipient: unknown): recipient is Recipient {
  if (!recipient || typeof recipient !== "object") return false;

  const maybeRecipient = recipient as Record<string, unknown>;
  return (
    typeof maybeRecipient.email === "string" &&
    maybeRecipient.email.includes("@") &&
    (typeof maybeRecipient.name === "undefined" || typeof maybeRecipient.name === "string")
  );
}

function parsePayload(body: unknown): NewsletterPayload | null {
  if (!body || typeof body !== "object") return null;

  const maybePayload = body as Record<string, unknown>;
  const recipients = Array.isArray(maybePayload.recipients)
    ? maybePayload.recipients.filter(isValidRecipient)
    : [];

  if (
    typeof maybePayload.subject !== "string" ||
    !maybePayload.subject.trim() ||
    typeof maybePayload.html !== "string" ||
    !maybePayload.html.trim() ||
    recipients.length === 0
  ) {
    return null;
  }

  return {
    subject: maybePayload.subject.trim(),
    html: maybePayload.html,
    recipients,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("VITE_SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: "Backend configuration missing" }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { data: adminRole, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      return jsonResponse({ error: roleError.message }, 500);
    }

    if (!adminRole) {
      return jsonResponse({ error: "Forbidden" }, 403);
    }

    const body = await req.json().catch(() => null);
    const payload = parsePayload(body);

    if (!payload) {
      return jsonResponse({ error: "Invalid newsletter payload" }, 400);
    }

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawResponse = await webhookResponse.text();

    if (!webhookResponse.ok) {
      return jsonResponse(
        {
          error: `Webhook error: ${webhookResponse.status}`,
          details: rawResponse.slice(0, 1000),
        },
        502,
      );
    }

    return jsonResponse({
      success: true,
      sent: payload.recipients.length,
      details: rawResponse.slice(0, 1000),
    });
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});
