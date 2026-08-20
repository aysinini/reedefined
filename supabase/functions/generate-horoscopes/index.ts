// Supabase Edge Function: generate-horoscopes
// Generates monthly horoscope copy (12 zodiac signs x en/de/tr) using the
// Anthropic API and writes it into public.horoscopes. English is grounded
// via the web_search server tool (current astrological transits from a
// reputable source); German and Turkish are natural localizations of the
// English copy — not literal translations — so the astrology content stays
// consistent across languages while the voice adapts per language.
//
// Split into three separate stages, each a single Anthropic API call, called
// as three separate invocations. A single invocation doing English (web
// search, which runs its own code-execution-backed filtering) plus two
// localization calls hit the edge runtime's per-invocation compute/time
// limit (WORKER_RESOURCE_LIMIT / IDLE_TIMEOUT) — splitting keeps each call
// well inside it, and lets a failed stage be retried without redoing the
// (slower, costlier) English/web-search stage.
//
// Triggered manually, once a month, when ISSUE_NUMBER (i18n.js) is bumped:
//   curl -X POST .../functions/v1/generate-horoscopes -d '{"issue_number":1,"stage":"en"}'
//   curl -X POST .../functions/v1/generate-horoscopes -d '{"issue_number":1,"stage":"de"}'
//   curl -X POST .../functions/v1/generate-horoscopes -d '{"issue_number":1,"stage":"tr"}'
// (de/tr read the already-saved "en" rows for that issue_number, so "en" must run first.)

import { createClient } from "jsr:@supabase/supabase-js@2";

const SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

const LANG_NAMES: Record<string, string> = { de: "German", tr: "Turkish" };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Extracts the {...} object from a text block, tolerating a preamble sentence
// or markdown fences the model added despite being told to return only JSON.
function extractJsonObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in model response: " + text.slice(0, 200));
  }
  return text.slice(start, end + 1);
}

async function callClaude(apiKey: string, body: Record<string, unknown>): Promise<any> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errText}`);
  }
  return res.json();
}

// When web_search is active, response.content interleaves text /
// server_tool_use / web_search_tool_result blocks. The final answer (the
// JSON we asked for) is the last text block, not a concatenation of all of
// them (earlier ones may just be the model narrating its search).
function extractFinalText(data: any): string {
  const textBlocks = (data.content || []).filter((b: any) => b.type === "text");
  return (textBlocks[textBlocks.length - 1]?.text || "").trim();
}

async function generateEnglish(apiKey: string): Promise<Record<string, string>> {
  const prompt =
    `Research this month's current astrological transits (planetary positions, major aspects) ` +
    `from a reputable astrology source such as astro.com. Then, based on that research, write ` +
    `short horoscopes (3-4 sentences each) for all 12 zodiac signs. Match the editorial voice of ` +
    `a stylish, contemporary lifestyle magazine: elegant, warm, with a light, knowing wit — never ` +
    `overly mystical or dead serious. ` +
    `Return ONLY valid JSON, no markdown fences, no explanation, with exactly these 12 keys: ` +
    `${SIGNS.join(", ")}. Each value is that sign's horoscope text, in English.`;

  const baseBody: Record<string, unknown> = {
    model: "claude-opus-4-8",
    max_tokens: 4096,
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 4 }],
  };

  let data = await callClaude(apiKey, { ...baseBody, messages: [{ role: "user", content: prompt }] });

  // web_search runs its own server-side tool loop. If it pauses before
  // finishing, resend with the assistant turn appended so it can continue —
  // this does not need a user message.
  let guard = 0;
  while (data.stop_reason === "pause_turn" && guard < 2) {
    data = await callClaude(apiKey, {
      ...baseBody,
      messages: [
        { role: "user", content: prompt },
        { role: "assistant", content: data.content },
      ],
    });
    guard++;
  }

  try {
    return JSON.parse(extractJsonObject(extractFinalText(data)));
  } catch (e) {
    throw new Error(
      `${e}\n[debug] stop_reason=${data.stop_reason}\n[debug] content=${JSON.stringify(data.content).slice(0, 3000)}`,
    );
  }
}

async function localize(
  apiKey: string,
  english: Record<string, string>,
  langName: string,
): Promise<Record<string, string>> {
  const prompt =
    `Here are this month's English horoscopes for all 12 zodiac signs, written for a stylish ` +
    `lifestyle magazine (elegant, warm, lightly witty tone):\n\n${JSON.stringify(english, null, 2)}\n\n` +
    `Localize these naturally into ${langName} — this is not a literal translation. Adapt the ` +
    `phrasing, idiom, and rhythm so it reads like it was originally written by a ${langName}-speaking ` +
    `magazine columnist, while keeping the same astrological content and meaning for each sign. ` +
    `Return ONLY valid JSON, no markdown fences, no explanation, with exactly the same 12 keys ` +
    `(${SIGNS.join(", ")}), values in ${langName}.`;

  const data = await callClaude(apiKey, {
    model: "claude-opus-4-8",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(extractJsonObject(extractFinalText(data)));
}

function checkComplete(lang: string, values: Record<string, string>) {
  for (const sign of SIGNS) {
    if (!values[sign]) throw new Error(`Missing ${lang} horoscope for sign: ${sign}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { issue_number, stage } = await req.json();
    if (!issue_number || typeof issue_number !== "number") {
      return new Response(JSON.stringify({ error: "issue_number (number) is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (stage !== "en" && stage !== "de" && stage !== "tr") {
      return new Response(JSON.stringify({ error: 'stage must be "en", "de", or "tr"' }), {
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

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let values: Record<string, string>;
    try {
      if (stage === "en") {
        values = await generateEnglish(apiKey);
      } else {
        const { data: enRows, error: enErr } = await supabaseAdmin
          .from("horoscopes")
          .select("sign, content")
          .eq("issue_number", issue_number)
          .eq("lang", "en");
        if (enErr) throw new Error(`Failed to read English rows: ${enErr.message}`);
        const english: Record<string, string> = {};
        for (const row of enRows || []) english[row.sign] = row.content;
        checkComplete("en", english);
        values = await localize(apiKey, english, LANG_NAMES[stage]);
      }
      checkComplete(stage, values);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Horoscope generation failed", detail: String(e) }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = SIGNS.map((sign) => ({ issue_number, sign, lang: stage, content: values[sign] }));

    const { error } = await supabaseAdmin
      .from("horoscopes")
      .upsert(rows, { onConflict: "issue_number,sign,lang" });

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to save horoscopes", detail: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, issue_number, stage, count: rows.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
