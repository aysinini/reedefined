// Supabase Edge Function: translate-article
// Safely translates a contributor's column into another language.
// The Anthropic API key lives here, server-side, as a secret — it is
// NEVER exposed to the browser. The frontend calls this function instead
// of calling Anthropic directly.
//
// After a successful translation, also caches it into
// contributions.translations (a per-language JSON blob) using the service
// role key, so the same article/language pair only ever costs one Anthropic
// call — every later reader gets it straight from the row. Readers can't
// write that column themselves (RLS only allows the article's own author to
// update their row), so the cache write happens here, server-side, instead.

import { createClient } from "jsr:@supabase/supabase-js@2";

const LANG_NAMES: Record<string, string> = {
  en: "English",
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
    const { contributionId, title, tagline, body, lang } = await req.json();
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
      `Translate the following personal magazine column to ${targetLang}. ` +
      `Auto-detect the source language from the text itself — do not assume it is written in English. ` +
      `If the text is already written in ${targetLang}, return it unchanged. ` +
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
        model: "claude-opus-4-8",
        max_tokens: 8192,
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
      // The model didn't return clean JSON — surface a real error instead of
      // silently echoing the original text back as if it were a translation.
      return new Response(JSON.stringify({ error: "Translation service returned an unexpected response" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cache the translation so this article/language pair never needs a
    // second Anthropic call. Best-effort: a cache-write failure shouldn't
    // stop the reader from seeing the translation they just asked for.
    if (contributionId) {
      try {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );
        const { data: row } = await supabaseAdmin
          .from("contributions")
          .select("translations")
          .eq("id", contributionId)
          .single();
        let translations: Record<string, unknown> = {};
        try {
          translations = JSON.parse(row?.translations || "{}");
        } catch {
          translations = {};
        }
        translations[lang] = parsed;
        await supabaseAdmin
          .from("contributions")
          .update({ translations: JSON.stringify(translations) })
          .eq("id", contributionId);
      } catch (e) {
        console.error("Failed to cache translation:", e);
      }
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
