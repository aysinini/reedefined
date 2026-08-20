// Supabase Edge Function: generate-puzzle
// Generates this month's crossword (en/de/tr) and writes it into
// public.puzzles. Two stages, kept fully separate on purpose:
//
//   1. Word/clue generation (AI) — one Claude call per language, with the
//      web_search tool active, researching this month's news/culture and
//      writing 15-20 crossword-suitable words + clues NATIVELY in that
//      language (not translated — word lengths and natural phrasing differ
//      too much between TR/DE/EN for translation to produce a usable list).
//   2. Grid placement (deterministic, no AI) — a backtracking algorithm
//      places the generated words into a classic crossword grid (black
//      squares, standard numbering), capped at 11x11 so cells stay
//      touch-friendly. If some words can't be placed without conflicts,
//      they're dropped and placement retries — this is plain constraint
//      solving, not guesswork, so every stored puzzle is guaranteed
//      internally consistent (every clue's answer actually reads off the
//      grid correctly).
//
// Called once per language per month, alongside generate-horoscopes:
//   curl -X POST .../functions/v1/generate-puzzle -d '{"issue_number":1,"stage":"en"}'
//   curl -X POST .../functions/v1/generate-puzzle -d '{"issue_number":1,"stage":"de"}'
//   curl -X POST .../functions/v1/generate-puzzle -d '{"issue_number":1,"stage":"tr"}'
// (Each stage is a single Claude call + fast local grid-building, so unlike
// generate-horoscopes this doesn't need to be split further to stay inside
// the edge runtime's per-invocation resource limit.)

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANG_NAMES: Record<string, string> = { en: "English", de: "German", tr: "Turkish" };
const LOCALE_MAP: Record<string, string> = { en: "en-US", tr: "tr-TR", de: "de-DE" };

// ══════════════════════════════════════════════
// STAGE 1 — AI word/clue generation
// ══════════════════════════════════════════════

function extractJsonArray(text: string): string {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON array found in model response: " + text.slice(0, 200));
  }
  return text.slice(start, end + 1);
}

function extractFinalText(data: any): string {
  const textBlocks = (data.content || []).filter((b: any) => b.type === "text");
  return (textBlocks[textBlocks.length - 1]?.text || "").trim();
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

async function generateWords(apiKey: string, langName: string): Promise<{ word: string; clue: string }[]> {
  const prompt =
    `Research this month's news, cultural moments, and current events relevant to a stylish contemporary ` +
    `lifestyle magazine. Then write 15 to 20 crossword-suitable words in ${langName}: each a single word ` +
    `(no spaces or hyphens), 3 to 9 letters long, common enough to be fair in a general-audience puzzle, ` +
    `related to this month's theme or current events where possible. Write these NATIVELY in ${langName} — ` +
    `do not translate from English or any other language; the words and clues should read as if originally ` +
    `written by a ${langName}-speaking magazine editor. Give each word a short, one-line clue in ${langName}. ` +
    `Return ONLY valid JSON, no markdown fences, no explanation: an array shaped exactly like ` +
    `[{"word": "...", "clue": "..."}, ...].`;

  const baseBody: Record<string, unknown> = {
    model: "claude-opus-4-8",
    max_tokens: 4096,
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 4 }],
  };

  let data = await callClaude(apiKey, { ...baseBody, messages: [{ role: "user", content: prompt }] });

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

  const parsed = JSON.parse(extractJsonArray(extractFinalText(data)));
  if (!Array.isArray(parsed)) throw new Error("Model did not return a JSON array");
  return parsed.filter((w: any) => w && typeof w.word === "string" && typeof w.clue === "string");
}

// ══════════════════════════════════════════════
// STAGE 2 — deterministic grid placement (no AI)
// ══════════════════════════════════════════════

function normalizeWord(w: string, lang: string): string {
  const locale = LOCALE_MAP[lang] || "en-US";
  return w.toLocaleUpperCase(locale).trim();
}

type WordEntry = { word: string; clue: string };
type Placement = { word: string; clue: string; row: number; col: number; dir: "A" | "D" };

function attemptPlacement(words: WordEntry[], maxDim: number) {
  const cells = new Map<string, { letter: string; wordRefs: { dir: string }[] }>();
  const placements: Placement[] = [];
  let minR = 0, maxR = 0, minC = 0, maxC = 0;

  const key = (r: number, c: number) => r + "," + c;

  function canPlace(word: string, row: number, col: number, dir: "A" | "D") {
    const len = word.length;
    const endRow = dir === "D" ? row + len - 1 : row;
    const endCol = dir === "A" ? col + len - 1 : col;
    const boxMinR = Math.min(minR, row), boxMaxR = Math.max(maxR, endRow);
    const boxMinC = Math.min(minC, col), boxMaxC = Math.max(maxC, endCol);
    if (boxMaxR - boxMinR + 1 > maxDim || boxMaxC - boxMinC + 1 > maxDim) return null;

    let crossings = 0;
    for (let i = 0; i < len; i++) {
      const r = dir === "D" ? row + i : row;
      const c = dir === "A" ? col + i : col;
      const existing = cells.get(key(r, c));
      if (existing) {
        if (existing.letter !== word[i]) return null;
        crossings++;
      } else {
        if (dir === "A") {
          if (cells.has(key(r - 1, c)) || cells.has(key(r + 1, c))) return null;
        } else {
          if (cells.has(key(r, c - 1)) || cells.has(key(r, c + 1))) return null;
        }
      }
    }
    if (dir === "A") {
      if (cells.has(key(row, col - 1)) || cells.has(key(row, col + len))) return null;
    } else {
      if (cells.has(key(row - 1, col)) || cells.has(key(row + len, col))) return null;
    }
    return { crossings };
  }

  function place(word: string, clue: string, row: number, col: number, dir: "A" | "D") {
    for (let i = 0; i < word.length; i++) {
      const r = dir === "D" ? row + i : row;
      const c = dir === "A" ? col + i : col;
      const k = key(r, c);
      const existing = cells.get(k);
      if (existing) existing.wordRefs.push({ dir });
      else cells.set(k, { letter: word[i], wordRefs: [{ dir }] });
      minR = Math.min(minR, r); maxR = Math.max(maxR, r);
      minC = Math.min(minC, c); maxC = Math.max(maxC, c);
    }
    placements.push({ word, clue, row, col, dir });
  }

  place(words[0].word, words[0].clue, 0, 0, "A");

  const unplaced: WordEntry[] = [];
  let pass = 0;
  let toTry = words.slice(1);
  while (toTry.length > 0 && pass < 6) {
    const stillUnplaced: WordEntry[] = [];
    for (const entry of toTry) {
      const word = entry.word;
      let best: { row: number; col: number; dir: "A" | "D"; crossings: number } | null = null;
      for (const [k, cellData] of cells) {
        const [er, ec] = k.split(",").map(Number);
        for (let i = 0; i < word.length; i++) {
          if (word[i] !== cellData.letter) continue;
          for (const dir of ["A", "D"] as const) {
            const row = dir === "D" ? er - i : er;
            const col = dir === "A" ? ec - i : ec;
            const result = canPlace(word, row, col, dir);
            if (result && (!best || result.crossings > best.crossings)) {
              best = { row, col, dir, crossings: result.crossings };
            }
          }
        }
      }
      if (best) place(word, entry.clue, best.row, best.col, best.dir);
      else stillUnplaced.push(entry);
    }
    if (stillUnplaced.length === toTry.length) break;
    toTry = stillUnplaced;
    pass++;
  }
  unplaced.push(...toTry);

  return { cells, placements, unplaced };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCrossword(rawWords: WordEntry[], opts: { minWords?: number; maxAttempts?: number; lang?: string; maxDim?: number } = {}) {
  const minWords = opts.minWords || 8;
  const maxAttempts = opts.maxAttempts || 20;
  const lang = opts.lang || "en";
  const maxDim = opts.maxDim || 11;

  const seen = new Set<string>();
  const words = rawWords
    .map((w) => ({ word: normalizeWord(w.word, lang), clue: w.clue }))
    .filter((w) => {
      if (w.word.length < 3 || w.word.length > 9) return false;
      if (seen.has(w.word)) return false;
      seen.add(w.word);
      return true;
    });

  if (words.length === 0) return null;

  let best: { result: ReturnType<typeof attemptPlacement>; wordsUsed: WordEntry[] } | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let candidateList = shuffle(words).sort((a, b) => b.word.length - a.word.length);

    for (let dropPass = 0; dropPass < 6; dropPass++) {
      const result = attemptPlacement(candidateList, maxDim);
      if (!best || result.placements.length > best.result.placements.length) {
        best = { result, wordsUsed: candidateList };
      }
      if (result.placements.length >= minWords && result.unplaced.length === 0) break;
      if (result.unplaced.length === 0) break;
      const droppedWords = new Set(result.unplaced.map((w) => w.word));
      const next = candidateList.filter((w) => !droppedWords.has(w.word));
      if (next.length === candidateList.length || next.length < 4) break;
      candidateList = next;
    }

    if (best && best.result.placements.length >= minWords) break;
  }

  if (best && best.result.placements.length >= 4) {
    return finalizeGrid(best.result, best.wordsUsed);
  }
  return null;
}

function finalizeGrid(result: ReturnType<typeof attemptPlacement>, wordsUsed: WordEntry[]) {
  const { cells, placements } = result;
  let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
  for (const k of cells.keys()) {
    const [r, c] = k.split(",").map(Number);
    minR = Math.min(minR, r); maxR = Math.max(maxR, r);
    minC = Math.min(minC, c); maxC = Math.max(maxC, c);
  }
  const height = maxR - minR + 1;
  const width = maxC - minC + 1;

  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ letter: null as string | null, blocked: true, number: null as number | null }))
  );
  for (const [k, cellData] of cells) {
    const [r, c] = k.split(",").map(Number);
    grid[r - minR][c - minC] = { letter: cellData.letter, blocked: false, number: null };
  }

  const normPlacements = placements.map((p) => ({ ...p, row: p.row - minR, col: p.col - minC }));

  const startsAcross = new Map<string, Placement>();
  const startsDown = new Map<string, Placement>();
  for (const p of normPlacements) {
    const k = p.row + "," + p.col;
    if (p.dir === "A") startsAcross.set(k, p); else startsDown.set(k, p);
  }

  let num = 1;
  const numbering = new Map<string, number>();
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const k = r + "," + c;
      if (startsAcross.has(k) || startsDown.has(k)) {
        numbering.set(k, num);
        grid[r][c].number = num;
        num++;
      }
    }
  }

  const across: any[] = [];
  const down: any[] = [];
  for (const p of normPlacements) {
    const k = p.row + "," + p.col;
    const entry = { number: numbering.get(k), clue: p.clue, answer: p.word, row: p.row, col: p.col, length: p.word.length };
    if (p.dir === "A") across.push(entry); else down.push(entry);
  }
  across.sort((a, b) => a.number - b.number);
  down.sort((a, b) => a.number - b.number);

  return { width, height, cells: grid, across, down, placedCount: placements.length, droppedWords: wordsUsed.length - placements.length };
}

// ══════════════════════════════════════════════
// HTTP handler
// ══════════════════════════════════════════════

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
    if (!LANG_NAMES[stage]) {
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

    let words: { word: string; clue: string }[];
    try {
      words = await generateWords(apiKey, LANG_NAMES[stage]);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Word generation failed", detail: String(e) }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (words.length < 8) {
      return new Response(JSON.stringify({ error: `Only ${words.length} usable words generated, need at least 8` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const grid = buildCrossword(words, { minWords: 8, lang: stage, maxDim: 11 });
    if (!grid) {
      return new Response(JSON.stringify({ error: "Could not build a valid grid from the generated words" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error } = await supabaseAdmin.from("puzzles").upsert(
      {
        issue_number,
        lang: stage,
        grid_data: { width: grid.width, height: grid.height, cells: grid.cells },
        clues: { across: grid.across, down: grid.down },
      },
      { onConflict: "issue_number,lang" },
    );

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to save puzzle", detail: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        issue_number,
        stage,
        generatedWords: words.length,
        placedWords: grid.placedCount,
        gridSize: `${grid.width}x${grid.height}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
