// Supabase Edge Function: moderate-photo
// Server-side AI content check for photo uploads in columns.
// The Anthropic API key lives here, server-side, as a secret — it is
// NEVER exposed to the browser. The frontend calls this function instead
// of calling Anthropic directly (browsers can't call it directly anyway —
// api.anthropic.com has no CORS allowance for browser-origin requests).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { base64, mediaType } = await req.json();
    if (!base64 || !mediaType) {
      return new Response(JSON.stringify({ error: "Missing base64 or mediaType" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server not configured: missing ANTHROPIC_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 200,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            {
              type: "text",
              text: 'Check this image for policy violations. Respond ONLY with JSON: {"passed": true/false, "reason": "brief reason if failed"}. Reject if: nudity or sexual content, graphic violence or gore, hate symbols, self-harm imagery. Accept everything else including art, fashion, food, nature, people, cityscapes.',
            },
          ],
        }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: "Moderation service error", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await anthropicRes.json();
    const raw = data?.content?.[0]?.text?.trim() || '{"passed":true}';
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // If the model didn't return clean JSON, fail open rather than block a real upload
      parsed = { passed: true };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
