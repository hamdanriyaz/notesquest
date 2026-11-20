import type { Kind } from "@/lib/game";

export const MOB_NAMES = ["Syntax Goblin", "Overfitting Ogre", "NullPointer Slime", "Bug Imp", "Cache Miss Bat", "Typo Troll", "Off-By-One Orc", "Deadline Wraith", "Memory Leak Leech"];
export const BOSS_NAMES = ["The Grand Neural Overlord", "Arch-Demon of Legacy Code", "Final Exam Colossus", "The Syllabus Leviathan"];

export function Monster({ kind, seed, state, className = "" }: { kind: Kind; seed: number; state: "idle" | "hit" | "dead"; className?: string }) {
  const hue = (seed * 67) % 360;
  const body = `oklch(0.62 0.2 ${hue})`;
  const dark = `oklch(0.4 0.17 ${hue})`;
  const variant = seed % 3;
  const cls = state === "dead" ? "anim-explode" : state === "hit" ? "anim-hit" : "anim-bob";
  return (
    <div className={`${cls} ${className}`} key={state + seed}>
      <svg viewBox="0 0 200 200" className="h-full w-full" style={{ filter: `drop-shadow(0 0 22px ${body})` }}>
        <ellipse cx="100" cy="188" rx="60" ry="8" fill="black" opacity=".35" />
        {kind === "boss" && (
          <>
            <path d="M40 70 L20 10 L65 52 Z M160 70 L180 10 L135 52 Z" fill="oklch(0.84 0.16 85)" />
            <path d="M70 40 L80 15 L90 38 L100 8 L110 38 L120 15 L130 40 Z" fill="oklch(0.84 0.16 85)" />
            <path d="M20 110 Q-5 80 15 60 Q30 95 45 100 Z M180 110 Q205 80 185 60 Q170 95 155 100 Z" fill={dark} />
          </>
        )}
        {variant === 0 && <path d="M30 180 Q20 70 100 50 Q180 70 170 180 Q150 165 135 180 Q118 165 100 180 Q82 165 65 180 Q50 165 30 180Z" fill={body} />}
        {variant === 1 && <rect x="38" y="55" width="124" height="125" rx="45" fill={body} />}
        {variant === 2 && <path d="M100 40 L170 110 Q175 180 100 182 Q25 180 30 110 Z" fill={body} />}
        {variant !== 2 && kind === "mob" && <path d="M60 62 L48 30 L80 54 Z M140 62 L152 30 L120 54 Z" fill={dark} />}
        <ellipse cx="72" cy="105" rx="17" ry={state === "hit" ? 4 : 19} fill="white" />
        <ellipse cx="128" cy="105" rx="17" ry={state === "hit" ? 4 : 19} fill="white" />
        {state !== "hit" && <><circle cx="76" cy="109" r="8" fill="oklch(0.2 0.05 275)" /><circle cx="124" cy="109" r="8" fill="oklch(0.2 0.05 275)" /></>}
        <path d="M58 82 L88 92 M142 82 L112 92" stroke={dark} strokeWidth="6" strokeLinecap="round" />
        <path d="M65 140 Q100 168 135 140 Z" fill={dark} />
        <path d="M75 142 L82 154 L89 145 L96 156 L104 145 L111 156 L118 145 L125 152 L130 142Z" fill="white" />
      </svg>
    </div>
  );
}

export function Particles({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2">
      {Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2; const d = 90 + (i % 5) * 30;
        return <span key={i} className="anim-particle absolute h-3 w-3 rounded-full" style={{ background: i % 3 ? color : "var(--gold)", ["--dx" as string]: `${Math.cos(a) * d}px`, ["--dy" as string]: `${Math.sin(a) * d}px`, boxShadow: `0 0 10px ${color}` }} />;
      })}
    </div>
  );
}
