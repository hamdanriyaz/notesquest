import { useEffect, useState } from "react";
import { addEntry, getBoard, type Entry } from "@/lib/leaderboard";
import type { RunResult } from "./Battle";
import { LeaderboardList } from "./LeaderboardList";

export function Summary({ r, topic, onHome, onRetry }: { r: RunResult; topic: string; onHome: () => void; onRetry: () => void }) {
  const acc = r.total ? Math.round((r.correct / r.total) * 100) : 0;
  const [board, setBoard] = useState<Entry[]>([]);
  const [name, setName] = useState(""); const [major, setMajor] = useState("");
  const [saved, setSaved] = useState<Entry | null>(null);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { getBoard().then(setBoard).catch(() => setErr("Could not load the global leaderboard.")); }, []);
  const rank = board.filter((b) => b.score > r.score).length + 1;

  const save = async () => { setBusy(true); setErr(""); try { const e = await addEntry({ name, major, score: r.score, accuracy: acc, topic, won: r.won }); setSaved(e); setBoard(await getBoard()); } catch { setErr("Could not save your score — try again."); } finally { setBusy(false); } };

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 pb-10 pt-16 lg:grid-cols-2">
      <section className="panel min-w-0 p-4 md:p-6">
        <h1 className={`text-center text-3xl md:text-4xl ${r.won ? "text-gold glow-gold" : "text-crimson glow-crimson"}`}>{r.won ? "VICTORY!" : "GAME OVER"}</h1>
        <p className="mb-5 text-center text-sm text-muted-foreground">{topic}</p>
        <div className="grid grid-cols-2 gap-3">
          {[["Final Score", r.score.toLocaleString()], ["Accuracy", `${acc}%`], ["Monsters Slain", r.mobs], ["Bosses Defeated", r.bosses]].map(([l, v]) => (
            <div key={l} className="rounded-lg bg-secondary p-3 text-center"><div className="font-display text-2xl text-primary">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>
          ))}
        </div>
        {r.missed.length > 0 && (
          <div className="mt-5">
            <button onClick={() => setOpen(!open)} className="w-full rounded-lg border border-border p-3 text-left font-semibold">📖 Review Missed Questions ({r.missed.length}) {open ? "▲" : "▼"}</button>
            {open && <ul className="mt-3 space-y-3">{r.missed.map(({ q, picked }, i) => (
              <li key={i} className="rounded-lg bg-secondary p-3 text-sm">
                <p className="font-semibold">{q.q}</p>
                {picked !== null && <p className="mt-1 text-crimson">✗ {q.options[picked]}</p>}
                <p className="text-success">✓ {q.options[q.answer]}</p>
                <p className="mt-1 text-muted-foreground">{q.explain}</p>
              </li>))}</ul>}
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <button onClick={onRetry} className="flex-1 rounded-lg border border-primary py-3 text-xs font-display text-primary md:text-base">Retry</button>
          <button onClick={onHome} className="btn-arcade flex-1 px-2 py-3 text-xs md:text-base">Play Another Topic</button>
        </div>
      </section>

      <section className="panel min-w-0 p-4 md:p-6">
        <h2 className="mb-4 text-center text-2xl text-primary glow-cyan">🌍 Global Respect Leaderboard</h2>
        {!saved && (
          <div className="mb-4 rounded-lg border border-gold/50 bg-gold/10 p-3">
            <p className="mb-2 text-sm">You'd rank <span className="font-display text-gold">#{rank}</span>! Claim your spot:</p>
            <input value={name} onChange={(e) => setName(e.target.value.slice(0, 30))} placeholder="Your name" className="mb-2 w-full rounded-md border border-input bg-input/40 p-2 text-sm" />
            <input value={major} onChange={(e) => setMajor(e.target.value.slice(0, 40))} placeholder="Major · University" className="mb-2 w-full rounded-md border border-input bg-input/40 p-2 text-sm" />
            <button disabled={busy || !name.trim() || !major.trim()} onClick={save} className="btn-arcade w-full py-2 disabled:opacity-40">Claim Rank</button>
          </div>
        )}
        {err && <p className="mb-2 text-sm text-crimson">{err}</p>}
        <LeaderboardList board={board} highlight={saved?.id ?? null} />
      </section>
    </div>
  );
}
