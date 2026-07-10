// Supabase Edge Function: moderate-text
// Server-side AI content check for submitted columns.
// The Anthropic API key lives here, server-side, as a secret — it is
// NEVER exposed to the browser. The frontend calls this function instead
// of calling Anthropic directly (browsers can't call it directly anyway —
// api.anthropic.com has no CORS allowance for browser-origin requests).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a content moderator for Reedefined, an editorial magazine platform. Review the submitted column for policy violations.

Check for:
- Explicit sexual content or nudity
- Hate speech, discrimination or harassment based on race, gender, religion, sexuality or other protected characteristics
- Graphic violence or gore
- Promotion of dangerous or illegal activities
- Spam or meaningless content
- Content that could harm or harass real individuals

Respond ONLY with valid JSON in this exact format:
{"passed": true, "reason": null}
OR
{"passed": false, "reason": "Brief explanation of the specific issue found, in plain language for the contributor."}

Be fair — creative writing, mature themes handled thoughtfully, strong opinions and personal essays are all acceptable. Only flag clear violations.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { title, body } = await req.json();

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
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Title: ${title || ""}\n\nBody:\n${body || ""}` }],
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
    const raw = data?.content?.[0]?.text?.trim() || '{"passed":true,"reason":null}';
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // If the model didn't return clean JSON, fail open rather than block a real submission
      parsed = { passed: true, reason: null };
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
