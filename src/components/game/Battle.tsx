import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { type Question, applyAnswer, hpFor, timeFor, MAX_SHIELDS, rollLoot, specialFill, SPECIAL_AT, SPECIAL_BONUS, WEAK_POINT_SECS, LOOT_TIME_BONUS } from "@/lib/game";
import { type Avatar, weaponColor } from "@/lib/avatar";
import { sfx, sfxSpecial, sfxLoot, startMusic, stopMusic, setMusicBoss } from "@/lib/sound";
import { Monster, Particles, MOB_NAMES, BOSS_NAMES } from "./Monster";
import { Shield } from "./Shield";
import { Hero } from "./Hero";
import { Environment, sceneFor, SCENE_NAMES } from "./Environment";

export interface RunResult { score: number; correct: number; total: number; mobs: number; bosses: number; missed: { q: Question; picked: number | null }[]; won: boolean; }
interface Float { id: number; text: string; tone: "gold" | "crimson" | "cyan"; side: "hero" | "mon"; }
const RUNES = ["ᚠ", "ᚱ", "ᛟ", "ᛉ", "∑", "λ", "π", "∫", "ᚦ", "Ω"];

export function Battle({ questions, topic, avatar, onEnd }: { questions: Question[]; topic: string; avatar: Avatar; onEnd: (r: RunResult) => void }) {
  const [idx, setIdx] = useState(0);
  const [run, setRun] = useState({ shields: MAX_SHIELDS, streak: 0, score: 0 });
  const [phase, setPhase] = useState<"banner" | "ask" | "result">("ask");
  const [picked, setPicked] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(() => timeFor(questions[0]!.kind));
  const [mState, setMState] = useState<"idle" | "hit" | "dead">("idle");
  const [hp, setHp] = useState(100);
  const [floats, setFloats] = useState<Float[]>([]);
  const [shake, setShake] = useState(0);
  const [flash, setFlash] = useState(0);
  const [breaking, setBreaking] = useState<number | null>(null);
  const [heroAnim, setHeroAnim] = useState("");
  const [monAnim, setMonAnim] = useState("");
  const [shot, setShot] = useState<{ dir: "r" | "l"; id: number } | null>(null);
  const [boom, setBoom] = useState<{ side: "hero" | "mon"; id: number } | null>(null);
  const [glass, setGlass] = useState(0);
  const [end, setEnd] = useState<null | "won" | "lost">(null);
  const [special, setSpecial] = useState(0);
  const [specialWave, setSpecialWave] = useState(-1);
  const [loot, setLoot] = useState<{ kind: "shield" | "time"; id: number } | null>(null);
  const [extra, setExtra] = useState(0);
  const pendingTime = useRef(0);
  const stats = useRef({ correct: 0, mobs: 0, bosses: 0, missed: [] as RunResult["missed"] });
  const q = questions[idx]!;
  const total = timeFor(q.kind) + extra;
  const isBoss = q.kind === "boss";
  const wColor = weaponColor(avatar.weapon);
  const monColor = `oklch(0.62 0.2 ${((idx + topic.length) * 67) % 360})`;
  const name = isBoss ? BOSS_NAMES[Math.floor(idx / 4) % BOSS_NAMES.length] : MOB_NAMES[(idx * 5 + topic.length) % MOB_NAMES.length];

  const addFloat = (text: string, tone: Float["tone"], side: Float["side"]) => {
    const id = Math.random();
    setFloats((f) => [...f, { id, text, tone, side }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1200);
  };

  useEffect(() => {
    setPicked(null); setMState("idle"); setHp(hpFor(q.kind)); const bonus = pendingTime.current; pendingTime.current = 0; setExtra(bonus); setTimeLeft(timeFor(q.kind) + bonus);
    setHeroAnim(""); setMonAnim(""); setShot(null); setBoom(null);
    if (q.kind === "boss") { setPhase("banner"); sfx.siren(); sfx.whoosh(); const t = setTimeout(() => setPhase("ask"), 2000); return () => clearTimeout(t); }
    setPhase("ask"); if (idx > 0) sfx.wave();
    return undefined;
  }, [idx, q.kind]);
  useEffect(() => { startMusic(); return () => stopMusic(); }, []);
  useEffect(() => { setMusicBoss(isBoss); }, [isBoss]);
  useEffect(() => { if (end) stopMusic(); }, [end]);

  const resolve = useCallback((choice: number | null) => {
    if (phase !== "ask") return;
    setPicked(choice); setPhase("result");
    const correct = choice === q.answer;
    const next = applyAnswer(run, correct, q.kind, timeLeft / total, total - timeLeft);
    const IMPACT = 500;
    if (correct) {
      stats.current.correct++;
      q.kind === "boss" ? stats.current.bosses++ : stats.current.mobs++;
      setHeroAnim("anim-hero-lunge"); sfx.laser(); setShot({ dir: "r", id: Math.random() });
      setTimeout(() => {
        setShot(null); setBoom({ side: "mon", id: Math.random() }); setShake((s) => s + 1);
        setMonAnim("anim-recoil"); setMState("hit"); setHp(0);
        setRun({ shields: next.shields, streak: next.streak, score: next.score });
        if (next.weak) setTimeout(() => addFloat("WEAK POINT! x2", "crimson", "mon"), 150);
        if (next.special) { setSpecial((n) => n + 1); setSpecialWave(idx); sfxSpecial(); setTimeout(() => addFloat(`FINISHER +${SPECIAL_BONUS}`, "gold", "hero"), 300); }
        const drop = rollLoot(next.shields);
        if (drop) setTimeout(() => {
          setLoot({ kind: drop, id: Math.random() }); sfxLoot(); sfx.coin();
          if (drop === "shield") { setRun((r) => ({ ...r, shields: Math.min(MAX_SHIELDS, r.shields + 1) })); addFloat("LOOT: SHIELD +1", "cyan", "hero"); }
          else { pendingTime.current = LOOT_TIME_BONUS; addFloat(`LOOT: +${LOOT_TIME_BONUS}s NEXT WAVE`, "cyan", "hero"); }
        }, 900);
        if (q.kind === "boss") { sfx.crit(); addFloat(`-${hpFor("boss")} CRITICAL HIT!`, "gold", "mon"); confetti({ particleCount: 160, spread: 100, origin: { x: 0.75, y: 0.4 } }); }
        else { sfx.hit(); addFloat(`-${hpFor("mob")} CRIT!`, "gold", "mon"); }
        if (next.streak > 1) setTimeout(() => sfx.combo(Math.min(5, next.streak)), 200);
        if (next.streak > 1) setTimeout(() => addFloat(`COMBO x${Math.min(3, next.streak)}`, "cyan", "hero"), 200);
        if (next.recharged) setTimeout(() => { sfx.recharge(); addFloat("SHIELD RECHARGED!", "cyan", "hero"); }, 450);
        setTimeout(() => setMState("dead"), 350);
      }, IMPACT);
    } else {
      stats.current.missed.push({ q, picked: choice });
      setMonAnim("anim-mob-lunge"); sfx.roar(); setShot({ dir: "l", id: Math.random() });
      setTimeout(() => {
        setShot(null); setBoom({ side: "hero", id: Math.random() });
        setRun({ shields: next.shields, streak: next.streak, score: next.score });
        sfx.impact(); sfx.shield(); setShake((s) => s + 1); setFlash((f) => f + 1); setGlass((g) => g + 1);
        setHeroAnim("anim-hero-hurt"); setBreaking(run.shields - 1);
        setTimeout(() => setBreaking(null), 650);
        addFloat(choice === null ? "TIME UP! SHIELD SHATTERED" : "SHIELD SHATTERED!", "crimson", "hero");
      }, IMPACT);
    }
    setTimeout(() => {
      const last = idx === questions.length - 1;
      if (next.shields <= 0 || last) {
        const won = next.shields > 0;
        setEnd(won ? "won" : "lost");
        if (won) { sfx.passed(); confetti({ particleCount: 250, spread: 140, origin: { y: 0.5 } }); } else sfx.wasted();
        const result = { score: next.score, correct: stats.current.correct, total: idx + 1, mobs: stats.current.mobs, bosses: stats.current.bosses, missed: stats.current.missed, won };
        setTimeout(() => onEnd(result), 4200);
      } else setIdx((i) => i + 1);
    }, 3000);
  }, [phase, q, run, timeLeft, total, idx, questions.length, onEnd]);

  useEffect(() => {
    if (phase !== "ask" || end) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 0.1)), 100);
    return () => clearInterval(t);
  }, [phase, end]);
  useEffect(() => { if (phase === "ask" && timeLeft <= 0) resolve(null); }, [timeLeft, phase, resolve]);
  const sec = Math.ceil(timeLeft);
  useEffect(() => { if (phase === "ask" && sec <= 5 && sec > 0) sfx.tick(); }, [sec, phase]);

  const nextBossIn = questions.findIndex((x, i) => i > idx && x.kind === "boss");
  const correct = picked === q.answer;
  const toneCls = (t: Float["tone"]) => (t === "gold" ? "text-gold glow-gold" : t === "crimson" ? "text-crimson glow-crimson" : "text-primary glow-cyan");

  return (
    <div className="relative h-[100svh] min-h-[440px] w-full overflow-hidden">
      {/* World (gets desaturated on WASTED) */}
      <div key={`s${shake}`} className={`absolute inset-0 ${shake ? "anim-shake" : ""} ${end === "lost" ? "wasted-filter" : ""}`}>
        <div className={`absolute inset-0 ${isBoss ? "arena-sky-boss" : "arena-sky"}`} />
        <Environment scene={sceneFor(idx, isBoss)} />
        <div className="anim-scene-in absolute left-3 top-[7.5rem] z-10 hidden md:block rounded-full bg-background/60 px-3 py-1 font-display text-[10px] tracking-widest text-gold md:top-28 md:text-xs">📍 {SCENE_NAMES[sceneFor(idx, isBoss)]}</div>
        {/* runes & particles */}
        {RUNES.map((r, i) => (
          <span key={i} className={`anim-rune pointer-events-none absolute font-display text-2xl ${isBoss ? "text-crimson" : "text-primary"}`} style={{ left: `${(i * 37) % 95}%`, bottom: `${20 + (i * 13) % 40}%`, animationDelay: `${i * 0.7}s` }}>{r}</span>
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={`p${i}`} className={`anim-rune pointer-events-none absolute h-1 w-1 rounded-full ${isBoss ? "bg-crimson" : "bg-gold"}`} style={{ left: `${(i * 53) % 100}%`, bottom: `${(i * 17) % 50}%`, animationDelay: `${i * 0.4}s`, animationDuration: `${5 + (i % 4)}s` }} />
        ))}
        {/* floor */}
        <div className="absolute inset-x-[-50%] bottom-0 h-[45%] arena-floor" />

        {/* Hero (left) */}
        <div className="absolute bottom-[40%] left-[4%] md:left-[10%]">
          <div key={`h${heroAnim}${idx}${glass}`} className={heroAnim}>
            <div className="anim-breathe"><Hero avatar={avatar} className="h-[min(26svh,34vw,220px)] w-auto" /></div>
          </div>
          <div className="mt-1 flex justify-center gap-1">
            {Array.from({ length: MAX_SHIELDS }).map((_, i) => <Shield key={i} active={i < run.shields} breaking={breaking === i} />)}
          </div>
          {boom?.side === "hero" && <div key={boom.id}><Particles color="var(--cyan)" /></div>}
        </div>

        {/* Monster (right) */}
        <div className="absolute bottom-[40%] right-[4%] flex flex-col items-center md:right-[10%]">
          <div className="mb-1 text-center">
            <div className={`font-display ${isBoss ? "text-base text-crimson glow-crimson md:text-2xl" : "text-sm text-primary md:text-lg"}`}>{phase !== "banner" ? name : "???"}</div>
            {isBoss ? (
              <div className="mx-auto mt-1 flex w-40 gap-1 md:w-64">
                {[0, 1, 2].map((s) => <div key={s} className="h-3 flex-1 rounded-sm bg-muted"><div className="h-full rounded-sm bg-crimson transition-all duration-500" style={{ width: hp > s * 100 ? "100%" : "0%" }} /></div>)}
              </div>
            ) : (
              <div className="mx-auto mt-1 h-3 w-32 rounded-sm bg-muted"><div className="h-full rounded-sm bg-success transition-all duration-300" style={{ width: `${hp}%` }} /></div>
            )}
          </div>
          <div className="relative">
            {phase !== "banner" && (
              <div key={`m${monAnim}${idx}${shake}`} className={monAnim}>
                <Monster kind={q.kind} seed={idx + topic.length} state={mState} className={isBoss ? "h-[min(36svh,48vw,300px)] w-[min(36svh,48vw,300px)]" : "h-[min(24svh,36vw,190px)] w-[min(24svh,36vw,190px)]"} />
              </div>
            )}
            {mState === "dead" && <Particles color={monColor} />}
          </div>
        </div>

        {/* Projectile */}
        {shot && (
          <div key={shot.id} className={`pointer-events-none absolute bottom-[52%] z-20 ${shot.dir === "r" ? "anim-shoot-r" : "anim-shoot-l"}`}>
            <div className="h-6 w-16 rounded-full md:h-8 md:w-24" style={shot.dir === "r"
              ? { background: `radial-gradient(circle at 80% 50%, white, ${wColor} 40%, transparent 75%)`, boxShadow: `0 0 30px 10px ${wColor}` }
              : { background: "radial-gradient(circle at 20% 50%, oklch(0.9 0.1 40), var(--crimson) 40%, transparent 75%)", boxShadow: "0 0 30px 12px var(--crimson)" }} />
          </div>
        )}
        {boom && (
          <div key={`b${boom.id}`} className="anim-boom pointer-events-none absolute bottom-[52%] z-20 h-40 w-40 rounded-full" style={{ left: boom.side === "mon" ? "80%" : "20%", background: `radial-gradient(circle, white, ${boom.side === "mon" ? wColor : "var(--crimson)"} 40%, transparent 70%)` }} />
        )}

        {floats.map((f, i) => (
          <div key={f.id} className={`anim-float pointer-events-none absolute top-[22%] z-30 whitespace-nowrap font-display text-xl md:text-3xl ${toneCls(f.tone)}`} style={{ left: f.side === "mon" ? "72%" : "25%", marginTop: i * 34 }}>{f.text}</div>
        ))}
      </div>

      {/* Special finishing move */}
      {special > 0 && specialWave === idx && phase === "result" && (
        <div key={`sp${special}`} className="pointer-events-none absolute inset-0 z-40">
          <div className="anim-flash absolute inset-0 bg-gold" />
          <div className="anim-special-beam absolute inset-x-0 top-[38%] h-24 md:h-36" style={{ background: `linear-gradient(90deg, transparent, ${wColor}, white, ${wColor})`, boxShadow: `0 0 80px 30px ${wColor}` }} />
          <div className="anim-banner absolute inset-x-0 top-[20%] text-center font-display text-3xl text-gold glow-gold md:text-6xl">⚡ VICE CITY FINISHER ⚡</div>
        </div>
      )}
      {loot && (
        <div key={`l${loot.id}`} className="anim-loot pointer-events-none absolute bottom-[50%] right-[22%] z-40 text-4xl md:text-5xl">{loot.kind === "shield" ? "🛡️" : "⏱️"}</div>
      )}

      {/* red border flash */}
      {flash > 0 && <div key={`f${flash}`} className="anim-border-flash pointer-events-none absolute inset-0 z-30" />}

      {/* Boss banner */}
      {phase === "banner" && (
        <>
          <div className="anim-flash pointer-events-none absolute inset-0 z-30 bg-crimson" />
          <div className="anim-banner absolute inset-x-0 top-1/3 z-40 bg-crimson/90 py-4 text-center font-display text-2xl text-destructive-foreground md:text-5xl">⚠️ BOSS APPROACHING ⚠️</div>
        </>
      )}

      {/* Top HUD */}
      <div className="glass-hud absolute inset-x-2 top-14 z-30 mx-auto grid max-w-4xl grid-cols-3 items-center gap-2 px-3 py-2 md:top-3 md:inset-x-24">
        <div className="font-display text-lg">
          <span className={run.streak >= 3 ? "text-gold glow-gold" : "text-primary glow-cyan"}>x{Math.max(1, Math.min(3, run.streak))}</span>
          <span className="ml-1 text-[10px] text-muted-foreground md:text-xs">STREAK {run.streak}</span>
        </div>
        <div className="text-center">
          <div className="font-display text-xs md:text-sm">Wave {idx + 1}/{questions.length}</div>
          <div className="text-[10px] text-muted-foreground md:text-xs">{isBoss ? <span className="text-crimson">BOSS WAVE</span> : nextBossIn > 0 ? (nextBossIn === idx + 1 ? <span className="text-crimson">Next: BOSS</span> : `Boss in ${nextBossIn - idx}`) : "Final stretch"}</div>
        </div>
        <div className="text-right font-display text-lg text-gold glow-gold">{run.score.toLocaleString()}</div>
        <div className="col-span-3 flex items-center gap-2">
          <span className={`font-display text-[10px] md:text-xs ${specialFill(run.streak) >= 1 ? "text-gold glow-gold" : "text-muted-foreground"}`}>⚡ SPECIAL</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gradient-vice transition-all duration-500" style={{ width: `${specialFill(run.streak) * 100}%` }} /></div>
          <span className="text-[10px] text-muted-foreground">{Math.round(specialFill(run.streak) * SPECIAL_AT)}/{SPECIAL_AT}</span>
          {isBoss && phase === "ask" && total - timeLeft <= WEAK_POINT_SECS && <span className="animate-pulse font-display text-[10px] text-crimson md:text-xs">🎯 WEAK POINT {Math.ceil(WEAK_POINT_SECS - (total - timeLeft))}s</span>}
        </div>
        <div className="col-span-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full transition-[width] duration-100 ease-linear" style={{ width: `${(timeLeft / total) * 100}%`, background: timeLeft / total < 0.3 ? "var(--crimson)" : "var(--cyan)" }} />
        </div>
      </div>

      {/* MCQ glass overlay */}
      {phase !== "banner" && !end && (
        <div className="glass-hud-strong absolute inset-x-2 bottom-2 z-30 mx-auto max-h-[44%] max-w-4xl overflow-y-auto p-3 md:bottom-4 md:p-5">
          <p className={`mb-2 font-bold leading-snug text-foreground md:mb-3 ${isBoss ? "text-sm md:text-lg" : "text-sm md:text-base"}`}>{q.q}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {q.options.map((o, i) => {
              const show = phase === "result";
              const st = show && i === q.answer ? "!border-success !bg-success/35" : show && i === picked ? "!border-crimson !bg-crimson/35" : "";
              return (
                <button key={i} disabled={phase !== "ask"} onMouseEnter={() => phase === "ask" && sfx.hover()} onClick={() => { sfx.click(); resolve(i); }} className={`btn-option btn-option-strong flex items-start gap-2 px-3 py-2 text-left text-sm ${st}`}>
                  <span className="font-display text-primary">{"ABCD"[i]}</span><span>{o}</span>
                </button>
              );
            })}
          </div>
          {phase === "result" && (
            <div className={`mt-2 rounded-lg border p-2 text-xs md:text-sm ${correct ? "border-success/50 bg-success/10" : "border-crimson/50 bg-crimson/10"}`}>
              <span className="font-display">{correct ? "⚔️ COMBAT LOG: " : "🛡️ COMBAT LOG: "}</span>{q.explain}
            </div>
          )}
        </div>
      )}

      {/* GTA-style end screens */}
      {end === "lost" && (
        <div className="anim-slow-fade absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/30">
          <div className="w-full bg-background/70 py-6 text-center">
            <div className="anim-slam font-wasted text-6xl tracking-wider text-crimson glow-crimson md:text-9xl">WASTED</div>
            <div className="mt-2 text-sm tracking-[0.3em] text-muted-foreground md:text-base">SYLLABUS OVERWHELMED YOU</div>
          </div>
        </div>
      )}
      {end === "won" && (
        <div className="anim-slow-fade absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/40">
          <div className="w-full bg-background/70 py-6 text-center">
            <div className="anim-slam font-wasted text-4xl tracking-wider text-gold glow-gold md:text-8xl">MISSION PASSED!</div>
            <div className="mt-2 font-display text-lg text-foreground md:text-2xl">RESPECT +{run.score.toLocaleString()}</div>
            <div className="mt-1 text-sm tracking-[0.3em] text-muted-foreground">SYLLABUS CONQUERED</div>
          </div>
        </div>
      )}
    </div>
  );
}
