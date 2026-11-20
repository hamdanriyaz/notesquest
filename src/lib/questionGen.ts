import { type Question, shuffle, shuffleQuestion, arrangeWaves } from "./game";

const STOP = new Set("the a an and or but of to in on for with by from as at is are was were be been being this that these those it its which who whom whose what when where why how can could should would may might will shall do does did has have had not no yes than then there their they them we you your our also such into over under more most less very each other some any all both either neither one two three using used use between within about after before during while because so if".split(" "));

const clean = (s: string) => s.replace(/\s+/g, " ").trim();
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const trim = (s: string, n = 140) => (s.length > n ? s.slice(0, n).replace(/\s\S*$/, "") + "…" : s);

export function splitSentences(text: string): string[] {
  return clean(text)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => { const w = s.split(" ").length; return w >= 6 && w <= 60 && /[a-z]/.test(s); });
}

export function keywords(text: string): string[] {
  const freq = new Map<string, number>();
  const words = text.match(/\b[A-Za-z][A-Za-z\-]{3,}\b/g) ?? [];
  for (const w of words) {
    const k = w.toLowerCase();
    if (STOP.has(k)) continue;
    freq.set(k, (freq.get(k) ?? 0) + (w[0] === w[0]!.toUpperCase() ? 1.5 : 1) + (w.length > 7 ? 0.5 : 0));
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
}

const DEF_RE = /^(?:An?\s+|The\s+)?([A-Za-z][\w\s\-()]{1,50}?)\s+(?:is|are|refers to|means|is defined as|is known as|describes)\s+(.{15,})$/i;

function pickDistractors(correct: string, pool: string[], n = 3): string[] {
  const c = correct.toLowerCase();
  const uniq = [...new Set(pool.filter((p) => p.toLowerCase() !== c && !c.includes(p.toLowerCase()) && !p.toLowerCase().includes(c)))];
  return shuffle(uniq).slice(0, n);
}

export function generateQuestions(text: string, target = 10): Question[] {
  const sents = splitSentences(text);
  const kws = keywords(text);
  const used = new Set<number>();
  const defs: { term: string; def: string; i: number }[] = [];
  sents.forEach((s, i) => {
    const m = s.match(DEF_RE);
    if (m?.[1] && m[2] && m[1].split(" ").length <= 6) defs.push({ term: clean(m[1]), def: clean(m[2]).replace(/[.!?]$/, ""), i });
  });
  const out: Question[] = [];
  const termPool = [...defs.map((d) => d.term), ...kws.slice(0, 40).map(cap)];

  // Definition questions -> mobs (short) / boss (long defs)
  for (const d of shuffle(defs)) {
    if (out.length >= target) break;
    const long = d.def.split(" ").length > 22;
    if (Math.random() < 0.5) {
      const dist = pickDistractors(d.term, termPool);
      if (dist.length < 3) continue;
      out.push({ q: `Which term matches this description: "${trim(d.def, 180)}"?`, options: [cap(d.term), ...dist.map(cap)], answer: 0, explain: `${cap(d.term)} — ${trim(d.def, 120)}.`, kind: long ? "boss" : "mob" });
    } else {
      const others = defs.filter((o) => o !== d).map((o) => trim(o.def, 110));
      const fill = sents.filter((_, i) => i !== d.i).map((s) => trim(s.replace(/[.!?]$/, ""), 110));
      const dist = pickDistractors(trim(d.def, 110), [...others, ...fill]);
      if (dist.length < 3) continue;
      out.push({ q: `What best describes "${cap(d.term)}"?`, options: [trim(d.def, 110), ...dist], answer: 0, explain: `${cap(d.term)} ${d.def.split(" ").length > 0 ? "is " + trim(d.def, 110) : ""}.`, kind: long ? "boss" : "mob" });
    }
    used.add(d.i);
  }

  // Cloze questions from key sentences
  const ranked = sents.map((s, i) => ({ s, i, score: kws.slice(0, 30).filter((k) => s.toLowerCase().includes(k)).length })).filter((x) => !used.has(x.i) && x.score > 0).sort((a, b) => b.score - a.score);
  for (const { s } of ranked) {
    if (out.length >= target) break;
    const kw = kws.slice(0, 40).find((k) => new RegExp(`\\b${k}\\b`, "i").test(s));
    if (!kw) continue;
    const dist = pickDistractors(kw, kws.slice(0, 60)).map(cap);
    if (dist.length < 3) continue;
    const blanked = s.replace(new RegExp(`\\b${kw}\\b`, "gi"), "_____");
    const long = s.split(" ").length > 24;
    out.push({ q: long ? `Analyze this statement and fill the blank: "${blanked}"` : `Fill in the blank: "${blanked}"`, options: [cap(kw), ...dist], answer: 0, explain: trim(s, 160), kind: long ? "boss" : "mob" });
  }

  let qs = out.slice(0, Math.max(target, 8));
  // ensure some bosses: promote longest questions
  const needBoss = Math.max(2, Math.floor(qs.length / 4));
  const bossCount = qs.filter((q) => q.kind === "boss").length;
  if (bossCount < needBoss) {
    const byLen = [...qs].filter((q) => q.kind === "mob").sort((a, b) => b.q.length - a.q.length).slice(0, needBoss - bossCount);
    byLen.forEach((q) => (q.kind = "boss"));
  }
  qs = qs.map(shuffleQuestion);
  return arrangeWaves(qs);
}
