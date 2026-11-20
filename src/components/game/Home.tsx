import { useEffect, useRef, useState } from "react";
import { currentStreak, dayKey, loadDaily } from "@/lib/daily";
import { QUESTS, type Quest } from "@/lib/quests";
import { extractText } from "@/lib/parseFile";
import { CLASSES, type Avatar } from "@/lib/avatar";
import { AvatarCustomizer } from "./AvatarCustomizer";
import { Hero } from "./Hero";
import { LeaderboardList } from "./LeaderboardList";
import { getBoard, type Entry } from "@/lib/leaderboard";

export function Home({ onQuest, onNotes, avatar, onAvatar }: { onQuest: (q: Quest) => void; onNotes: (text: string, title: string) => void; avatar: Avatar; onAvatar: (a: Avatar) => void }) {
  const [path, setPath] = useState<"instant" | "notes" | "board">("instant");
  const [tab, setTab] = useState<"upload" | "paste">("upload");
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const [board, setBoard] = useState<Entry[] | null>(null);
  const [boardErr, setBoardErr] = useState(false);
  useEffect(() => { if (path === "board") getBoard().then(setBoard).catch(() => setBoardErr(true)); }, [path]);
  const [top, setTop] = useState<Entry[] | null>(null);
  useEffect(() => { getBoard(3).then(setTop).catch(() => setTop([])); }, []);
  const [daily, setDaily] = useState<{ n: number; today: boolean } | null>(null);
  useEffect(() => { const d = loadDaily(); setDaily({ n: currentStreak(d, dayKey()), today: d.last === dayKey() }); }, []);

  const handle = async (f?: File) => {
    if (!f) return;
    setErr(""); setBusy(true);
    try {
      const t = await extractText(f);
      if (t.trim().length < 200) throw new Error("Not enough readable text in that file (scanned PDFs aren't supported).");
      onNotes(t, f.name.replace(/\.\w+$/, ""));
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not read file"); }
    finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-16">
      <header className="mb-6 text-center">
        <div className="mb-2 text-sm tracking-[0.3em] text-muted-foreground">⚔️ INSERT NOTES TO PLAY ⚔️</div>
        <h1 className="text-gradient-vice text-5xl md:text-7xl">NoteQuest</h1>
        <p className="mt-2 font-display text-lg text-gold glow-gold md:text-2xl">Syllabus Monster Slayer</p>
        {daily && (
          <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-accent/60 bg-card px-4 py-1.5 font-display text-sm">
            <span className="text-xl">🔥</span>
            <span className="text-gold glow-gold">{daily.n} day streak</span>
            <span className="text-xs text-muted-foreground">{daily.today ? "· done today ✓" : daily.n ? "· play today to keep it!" : "· play a quest to start"}</span>
          </div>
        )}
        {top && (
          <button onClick={() => { setPath("board"); setTimeout(() => document.getElementById("path-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }} aria-label="Open leaderboard" className="mx-auto mt-3 flex max-w-xl flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border border-border/60 bg-card/60 px-3 py-1.5 text-xs transition hover:border-primary">
            <span className="font-display text-[10px] tracking-widest text-muted-foreground">TOP 3</span>
            {top.length === 0 ? <span className="text-muted-foreground">No champions yet — claim #1!</span>
              : top.map((e, i) => (
                <span key={e.id ?? i} className="flex items-center gap-1">
                  <span>{["👑", "🥈", "🥉"][i]}</span>
                  <span className="max-w-[7rem] truncate font-semibold text-foreground">{e.name}</span>
                  <span className="font-display text-primary">{e.score.toLocaleString()}</span>
                </span>
              ))}
          </button>
        )}
      </header>

      {/* Hero showcase */}
      <section className="relative mx-auto mb-8 flex max-w-xl flex-col items-center overflow-hidden rounded-2xl arena-sky px-4 pb-5 pt-6">
        <div className="absolute inset-x-[-50%] bottom-0 h-1/2 arena-floor" />
        <div className="anim-breathe relative"><Hero avatar={avatar} className="h-[min(56svh,360px)] w-auto" /></div>
        <div className="relative mt-2 font-display text-lg text-foreground">{CLASSES.find((c) => c.id === avatar.cls)!.name}</div>
        <button onClick={() => setEditing(true)} className="relative mt-2 rounded-full border border-primary/60 bg-background/70 px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">✎ Edit Avatar</button>
      </section>

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-3 backdrop-blur-sm" onClick={() => setEditing(false)}>
          <div className="max-h-[92svh] w-full max-w-3xl overflow-y-auto" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Edit avatar">
            <AvatarCustomizer avatar={avatar} onChange={onAvatar} />
            <button onClick={() => setEditing(false)} className="btn-arcade -mt-3 w-full py-3">Done</button>
          </div>
        </div>
      )}

      {/* Path tabs */}
      <div id="path-tabs" className="mx-auto mb-5 flex max-w-2xl rounded-full border border-border bg-card p-1">
        {([["instant", "Path A · Instant Play"], ["notes", "Path B · Your Notes"], ["board", "🏆 Leaderboard"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setPath(id)} className={`flex-1 rounded-full px-2 py-2 font-display text-[10px] leading-tight sm:text-xs transition md:text-sm ${path === id ? "bg-gradient-vice text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{label}</button>
        ))}
      </div>

      {path === "board" ? (
        <section className="panel mx-auto max-w-2xl p-4 md:p-6">
          <h2 className="mb-1 text-center text-2xl text-primary glow-cyan">🌍 Global Respect Leaderboard</h2>
          <p className="mb-4 text-center text-xs text-muted-foreground">Top players from everywhere · finish a match to claim your spot</p>
          {boardErr ? <p className="text-center text-sm text-crimson">Could not load the leaderboard — try again later.</p>
            : board === null ? <p className="text-center text-sm text-muted-foreground animate-pulse">Loading champions…</p>
            : <LeaderboardList board={board} limit={50} />}
        </section>
      ) : path === "instant" ? (
        <section>
          <p className="mb-4 text-center text-sm text-muted-foreground">{QUESTS.length} built-in quests · 6 mobs + 2 bosses each</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUESTS.map((q) => (
              <button key={q.id} onClick={() => onQuest(q)} className="panel group flex items-center gap-4 p-4 text-left transition hover:-translate-y-1 hover:border-primary">
                <div className="text-4xl transition group-hover:scale-125">{q.icon}</div>
                <div className="flex-1">
                  <div className="font-bold leading-tight">{q.title}</div>
                  <div className="text-xs text-muted-foreground">{q.blurb}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold ${q.difficulty === "Hard" ? "bg-crimson/25 text-crimson" : q.difficulty === "Medium" ? "bg-gold/25 text-gold" : "bg-success/25 text-success"}`}>{q.difficulty}</span>
                    <span className="font-display text-xs text-primary">PLAY NOW ▶</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="panel mx-auto max-w-2xl p-5">
          <p className="mb-4 text-sm text-muted-foreground">PDF, Word or text. Read right in your browser.</p>
          <div className="mb-3 flex gap-2">
            {(["upload", "paste"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-1 text-sm font-semibold ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{t === "upload" ? "Upload File" : "Paste Notes Text"}</button>
            ))}
          </div>
          {tab === "upload" ? (
            <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }} onClick={() => input.current?.click()}
              className={`flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition ${drag ? "border-gold bg-gold/10" : "border-primary/50 hover:border-primary hover:bg-primary/5"}`}>
              <div className="text-5xl">📜</div>
              <div className="mt-3 font-display">{busy ? "Reading scroll…" : "Drop your notes here"}</div>
              <div className="mt-1 text-xs text-muted-foreground">.pdf · .docx · .txt</div>
              <input ref={input} type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
            </div>
          ) : (
            <div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your lecture notes here… (definitions like “Overfitting is …” work best)" className="h-44 w-full rounded-xl border border-input bg-input/40 p-3 text-sm outline-none focus:border-primary" />
              <button disabled={text.trim().length < 200} onClick={() => onNotes(text, "Pasted Notes")} className="btn-arcade mt-3 w-full py-3 disabled:opacity-40">Forge Monsters</button>
              <div className="mt-1 text-xs text-muted-foreground">{text.trim().length < 200 ? `${200 - text.trim().length} more characters needed` : "Ready!"}</div>
            </div>
          )}
          {err && <p className="mt-3 text-sm text-crimson">{err}</p>}
        </section>
      )}
    </div>
  );
}
