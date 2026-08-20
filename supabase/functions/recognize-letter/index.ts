// Supabase Edge Function: recognize-letter
// Prototype for the crossword puzzle's handwriting input. Takes a single
// cell's canvas drawing (base64 PNG) and asks Claude Haiku (fast, cheap —
// this fires on every letter a user draws) to read the one handwritten
// character. Returns { letter, uncertain } — the client falls back to its
// on-screen keyboard whenever uncertain is true.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOCALE_MAP: Record<string, string> = { en: "en-US", tr: "tr-TR", de: "de-DE" };

function langNote(lang: string): string {
  if (lang === "tr") return "The letter is Turkish and may be one of the special characters ç, ğ, ı, İ, ö, ş, ü.";
  if (lang === "de") return "The letter is German and may be one of the special characters ä, ö, ü, ß.";
  return "The letter is English.";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { image, lang } = await req.json();
    if (!image || typeof image !== "string") {
      return new Response(JSON.stringify({ error: "image (base64 PNG, no data: prefix) is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const language = (lang === "tr" || lang === "de") ? lang : "en";

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server not configured: missing ANTHROPIC_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt =
      `This image contains a single handwritten letter, drawn by hand on a touchscreen or with a mouse. ` +
      `Return ONLY that one character — no punctuation, no explanation, nothing else. ` +
      `${langNote(language)} ` +
      `If you cannot confidently identify a single letter, return exactly: ?`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 10,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/png", data: image } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: "Recognition service error", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await anthropicRes.json();
    const raw = (data?.content?.[0]?.text || "").trim();
    const chars = [...raw]; // spread iterates by codepoint, so accented single letters count as length 1

    if (chars.length === 1 && raw !== "?") {
      const locale = LOCALE_MAP[language] || "en-US";
      const letter = raw.toLocaleUpperCase(locale);
      return new Response(JSON.stringify({ letter, uncertain: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ letter: null, uncertain: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
