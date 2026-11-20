export interface Daily { streak: number; last: string | null; }
const KEY = "notequest-daily";
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
/** Playing on consecutive days grows the streak; a missed day resets it to 1; same day keeps it. */
export function nextDaily(d: Daily, today: string): Daily {
  if (!d.last) return { streak: 1, last: today };
  const gap = daysBetween(d.last, today);
  if (gap <= 0) return d;
  return { streak: gap === 1 ? d.streak + 1 : 1, last: today };
}
/** Streak as shown today (0 if last play was before yesterday). */
export const currentStreak = (d: Daily, today: string) => (!d.last || daysBetween(d.last, today) > 1 ? 0 : d.streak);
export function loadDaily(): Daily {
  try { return { streak: 0, last: null, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return { streak: 0, last: null }; }
}
export function recordPlay(): Daily {
  const n = nextDaily(loadDaily(), dayKey());
  try { localStorage.setItem(KEY, JSON.stringify(n)); } catch { /* ignore */ }
  return n;
}
