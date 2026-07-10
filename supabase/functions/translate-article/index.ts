// Supabase Edge Function: translate-article
// Safely translates a contributor's column into another language.
// The Anthropic API key lives here, server-side, as a secret — it is
// NEVER exposed to the browser. The frontend calls this function instead
// of calling Anthropic directly.

const LANG_NAMES: Record<string, string> = {
  tr: "Turkish",
  de: "German",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { title, tagline, body, lang } = await req.json();
    const targetLang = LANG_NAMES[lang];

    if (!targetLang) {
      return new Response(JSON.stringify({ error: "Unsupported language" }), {
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

    const prompt =
      `Translate the following personal magazine column from English to ${targetLang}. ` +
      `Keep the personal, editorial tone — do not make it sound like a news article. ` +
      `Return ONLY valid JSON with exactly these keys: "title", "tagline", "body". ` +
      `No markdown fences, no explanation, just the JSON object.\n\n` +
      `Title: ${title || ""}\n` +
      `Tagline: ${tagline || ""}\n` +
      `Body:\n${body || ""}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: "Translation service error", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await anthropicRes.json();
    const raw = data?.content?.[0]?.text?.trim() || "{}";
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // If the model didn't return clean JSON, fail safe to the original text
      parsed = { title, tagline, body };
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
