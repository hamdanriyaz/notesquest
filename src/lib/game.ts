export type Kind = "mob" | "boss";
export interface Question {
  q: string;
  options: string[];
  answer: number;
  explain: string;
  kind: Kind;
}
export const MOB_HP = 100;
export const BOSS_HP = 300;
export const MAX_SHIELDS = 3;
export const timeFor = (k: Kind) => (k === "boss" ? 25 : 15);
export const hpFor = (k: Kind) => (k === "boss" ? BOSS_HP : MOB_HP);

export interface RunState { shields: number; streak: number; score: number; }

/** Apply an answer. 3 correct in a row restores 1 shield (max 3). Wrong answers break 1 shield and reset streak. */
export const SPECIAL_AT = 5;
export const SPECIAL_BONUS = 500;
export const WEAK_POINT_SECS = 5;
export const WEAK_POINT_MULT = 2;
export const LOOT_CHANCE = 0.3;
export const LOOT_TIME_BONUS = 5;
/** Special meter fill 0..1, full at a 5-streak. */
export const specialFill = (streak: number) => (streak > 0 && streak % SPECIAL_AT === 0 ? 1 : (streak % SPECIAL_AT) / SPECIAL_AT);
/** Bosses take double damage/score if answered within the first 5 seconds. */
export const isWeakPoint = (kind: Kind, elapsed: number) => kind === "boss" && elapsed <= WEAK_POINT_SECS;

/** Apply an answer. 3 correct in a row restores 1 shield (max 3). Wrong answers break 1 shield and reset streak.
 * Every 5-streak fires a special attack (+500). Fast boss answers hit the weak point (x2). */
export function applyAnswer(s: RunState, correct: boolean, kind: Kind, timeLeftRatio = 0, elapsed = Infinity): RunState & { recharged: boolean; special: boolean; weak: boolean } {
  if (!correct) return { shields: Math.max(0, s.shields - 1), streak: 0, score: s.score, recharged: false, special: false, weak: false };
  const streak = s.streak + 1;
  const mult = Math.min(3, streak);
  const base = hpFor(kind);
  const weak = isWeakPoint(kind, elapsed);
  const special = streak % SPECIAL_AT === 0;
  const score = s.score + Math.round((base + base * timeLeftRatio) * mult * (weak ? WEAK_POINT_MULT : 1)) + (special ? SPECIAL_BONUS : 0);
  const recharged = streak % 3 === 0 && s.shields < MAX_SHIELDS;
  return { shields: recharged ? s.shields + 1 : s.shields, streak, score, recharged, special, weak };
}

export type Loot = "shield" | "time" | null;
/** After a defeated monster: 30% chance to drop loot. Shield refill if damaged, otherwise extra time for next wave. */
export function rollLoot(shields: number, roll = Math.random()): Loot {
  if (roll >= LOOT_CHANCE) return null;
  return shields < MAX_SHIELDS ? "shield" : "time";
}

export function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j]!, r[i]!]; }
  return r;
}
/** Shuffle options keeping track of the correct answer. */
export function shuffleQuestion(q: Question): Question {
  const idx = shuffle(q.options.map((_, i) => i));
  return { ...q, options: idx.map((i) => q.options[i]!), answer: idx.indexOf(q.answer) };
}
/** Order: boss at every 4th wave and the final wave. */
export function arrangeWaves(qs: Question[]): Question[] {
  const bosses = qs.filter((q) => q.kind === "boss");
  const mobs = qs.filter((q) => q.kind === "mob");
  const n = qs.length;
  const out: Question[] = [];
  for (let i = 1; i <= n; i++) {
    const wantBoss = i % 4 === 0 || i === n;
    const pick = wantBoss ? bosses.shift() ?? mobs.shift() : mobs.shift() ?? bosses.shift();
    if (pick) out.push({ ...pick, kind: wantBoss ? "boss" : "mob" });
  }
  return out;
}
