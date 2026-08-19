// Supabase Edge Function: send-notification
// Sends a transactional email (new like / new comment / new follow) via Resend,
// wrapped in a small branded HTML template with an optional CTA button.
// Looks up the recipient's email server-side using the service role key —
// the client never has direct access to other users' email addresses.

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, subject, message, ctaText, ctaUrl } = await req.json();

    if (!userId || !subject || !message) {
      return new Response(JSON.stringify({ error: "Missing userId, subject, or message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: userData, error: userErr } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userErr || !userData?.user?.email) {
      return new Response(JSON.stringify({ error: "Recipient not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server not configured: missing RESEND_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ctaHtml = ctaUrl && ctaText
      ? `<a href="${ctaUrl}" style="display:inline-block;background:#4A7C3F;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:13px 28px;border-radius:24px;margin-top:8px">${ctaText} &rarr;</a>`
      : "";

    const html = `
<div style="background:#F8F7F4;padding:40px 20px;font-family:Georgia,'Times New Roman',serif">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #E2E2E2;border-radius:8px;overflow:hidden">
    <div style="border-bottom:3px solid #0C0C0C;padding:22px 32px">
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:.08em;color:#0C0C0C">Reedefined</span>
    </div>
    <div style="padding:32px">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#0C0C0C;line-height:1.6;margin-bottom:${ctaHtml ? "28px" : "0"}">${message}</div>
      ${ctaHtml}
    </div>
    <div style="border-top:1px solid #E2E2E2;padding:16px 32px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#6B6B6B">
      Reedefined &mdash; The magazine shaped by the people you follow.
    </div>
  </div>
</div>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Reedefined <hello@reedefinedmag.com>",
        to: userData.user.email,
        subject,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      return new Response(JSON.stringify({ error: "Email send failed", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
