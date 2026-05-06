import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const code = typeof body?.code === "string" ? body.code.trim() : "";
    const subtotal = Number(body?.subtotal ?? 0);
    if (!code) {
      return new Response(JSON.stringify({ valid: false, message: "Codice mancante" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("id, code, discount_type, value, is_active, valid_from, valid_until, usage_limit, used_count")
      .ilike("code", code)
      .maybeSingle();

    if (error || !coupon) {
      return new Response(JSON.stringify({ valid: false, message: "Codice non valido" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!coupon.is_active) {
      return new Response(JSON.stringify({ valid: false, message: "Codice non attivo" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return new Response(JSON.stringify({ valid: false, message: "Codice non ancora valido" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return new Response(JSON.stringify({ valid: false, message: "Codice scaduto" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (
      coupon.usage_limit !== null &&
      typeof coupon.usage_limit === "number" &&
      coupon.used_count >= coupon.usage_limit
    ) {
      return new Response(JSON.stringify({ valid: false, message: "Codice esaurito" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const value = Number(coupon.value ?? 0);
    let discount = 0;
    if (coupon.discount_type === "percentage") {
      discount = +(subtotal * (value / 100)).toFixed(2);
    } else if (coupon.discount_type === "fixed") {
      discount = Math.min(value, subtotal);
    }

    return new Response(
      JSON.stringify({
        valid: true,
        code: coupon.code,
        discount_type: coupon.discount_type,
        value,
        discount,
        message: "Codice valido",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ valid: false, message: "Errore interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
