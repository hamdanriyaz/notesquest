import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DEFAULT_AVATAR, loadAvatar, saveAvatar, type Avatar } from "@/lib/avatar";
import { Home } from "@/components/game/Home";
import { Battle, type RunResult } from "@/components/game/Battle";
import { recordPlay } from "@/lib/daily";
import { Summary } from "@/components/game/Summary";
import { arrangeWaves, shuffleQuestion, type Question } from "@/lib/game";
import { generateQuestions } from "@/lib/questionGen";
import { isMuted, setMuted } from "@/lib/sound";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NoteQuest: Syllabus Monster Slayer" },
      { name: "description", content: "Turn your study notes into an arcade monster-slaying quiz battle. Upload PDF, Word or text notes, or play 5 built-in quests." },
      { property: "og:title", content: "NoteQuest: Syllabus Monster Slayer" },
      { property: "og:description", content: "Slay monsters by answering questions made from your own study notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Screen = { s: "home" } | { s: "forge"; title: string } | { s: "battle"; qs: Question[]; title: string; run: number } | { s: "end"; r: RunResult; qs: Question[]; title: string };

function Index() {
  const [screen, setScreen] = useState<Screen>({ s: "home" });
  const [mute, setMute] = useState(false);
  const [forgeErr, setForgeErr] = useState("");
  const [avatar, setAvatar] = useState<Avatar>(DEFAULT_AVATAR);
  useEffect(() => setAvatar(loadAvatar()), []);
  useEffect(() => { window.scrollTo(0, 0); }, [screen.s]);
  const changeAvatar = (a: Avatar) => { setAvatar(a); saveAvatar(a); };

  const start = (qs: Question[], title: string) => setScreen({ s: "battle", qs, title, run: Date.now() });
  const fromNotes = (text: string, title: string) => {
    setForgeErr(""); setScreen({ s: "forge", title });
    setTimeout(() => {
      const qs = generateQuestions(text, 10);
      if (qs.length < 4) { setForgeErr("Couldn't forge enough monsters — try longer notes with clear definitions."); setScreen({ s: "home" }); return; }
      start(qs, title);
    }, 2200);
  };

  return (
    <main className="min-h-screen">
      <button aria-label={mute ? "Unmute sound" : "Mute sound"} onClick={() => { setMuted(!isMuted()); setMute(isMuted()); }} className="panel fixed right-3 top-3 z-50 h-10 w-10 text-lg">{mute ? "🔇" : "🔊"}</button>
      {screen.s !== "home" && screen.s !== "forge" && <button onClick={() => setScreen({ s: "home" })} className="panel fixed left-3 top-3 z-50 px-3 py-2 text-sm">← Home</button>}
      {screen.s === "home" && <>
        {forgeErr && <p className="mx-auto mt-6 max-w-xl rounded-lg bg-crimson/20 p-3 text-center text-sm">{forgeErr}</p>}
        <Home onQuest={(q) => start(arrangeWaves(q.questions.map(shuffleQuestion)), q.title)} onNotes={fromNotes} avatar={avatar} onAvatar={changeAvatar} />
      </>}
      {screen.s === "forge" && (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="anim-bob text-7xl">⚒️</div>
          <h2 className="mt-6 text-2xl text-gold glow-gold">Forging Monsters from your notes...</h2>
          <p className="mt-2 text-sm text-muted-foreground">{screen.title}</p>
          <div className="mt-6 h-5 w-80 max-w-full overflow-hidden rounded-full border border-gold bg-muted">
            <div className="forge-bar h-full transition-all duration-[2000ms] ease-out" style={{ width: "100%", animationName: "forge" }} />
          </div>
        </div>
      )}
      {screen.s === "battle" && <Battle key={screen.run} avatar={avatar} questions={screen.qs} topic={screen.title} onEnd={(r) => { recordPlay(); setScreen({ s: "end", r, qs: screen.qs, title: screen.title }); }} />}
      {screen.s === "end" && <Summary r={screen.r} topic={screen.title} onHome={() => setScreen({ s: "home" })} onRetry={() => start(screen.qs.map(shuffleQuestion), screen.title)} />}
    </main>
  );
}
