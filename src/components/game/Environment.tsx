/** Layered scenery behind the arena. Changes every wave; bosses get a lightning storm. */
const SCENES = ["skyline", "beach", "highway", "mountains"] as const;
export const sceneFor = (idx: number, boss: boolean) => (boss ? "storm" : SCENES[idx % SCENES.length]!);
export const SCENE_NAMES: Record<string, string> = { skyline: "Neon Downtown", beach: "Vice Beach", highway: "Midnight Highway", mountains: "Synth Peaks", storm: "Crimson Storm" };

function Sun({ color = "var(--gold)" }: { color?: string }) {
  return (
    <div className="absolute left-1/2 top-[18%] h-[30vh] w-[30vh] max-h-60 max-w-60 -translate-x-1/2 rounded-full opacity-80"
      style={{ background: `linear-gradient(to bottom, ${color}, var(--primary))`, maskImage: "repeating-linear-gradient(to bottom, black 0 14px, transparent 14px 18px)", WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0 70%, transparent 70% 100%)", WebkitMaskSize: "100% 16px", boxShadow: "0 0 80px 20px color-mix(in oklab, var(--primary) 40%, transparent)" }} />
  );
}
function Stars({ n = 40 }: { n?: number }) {
  return <>{Array.from({ length: n }).map((_, i) => <span key={i} className="anim-twinkle absolute h-0.5 w-0.5 rounded-full bg-foreground" style={{ left: `${(i * 47) % 100}%`, top: `${(i * 29) % 45}%`, animationDelay: `${(i % 7) * 0.4}s` }} />)}</>;
}
function Skyline() {
  const b = Array.from({ length: 22 }).map((_, i) => ({ x: i * 4.6, w: 3 + (i * 7) % 4, h: 12 + ((i * 37) % 30) }));
  return (
    <svg className="absolute inset-x-0 bottom-[44%] h-[34%] w-full" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden>
      {b.map((r, i) => <g key={i}>
        <rect x={r.x} y={50 - r.h} width={r.w} height={r.h} fill="var(--background)" opacity="0.9" />
        {Array.from({ length: Math.floor(r.h / 4) }).map((_, j) => (j + i) % 3 !== 0 && <rect key={j} x={r.x + 0.8} y={50 - r.h + 2 + j * 4} width="0.8" height="1" fill={(i + j) % 2 ? "var(--primary)" : "var(--gold)"} opacity="0.8" />)}
      </g>)}
    </svg>
  );
}
function Palms() {
  const palm = (x: number, s: number, flip = false) => (
    <g transform={`translate(${x} 50) scale(${flip ? -s : s} ${s})`} fill="var(--background)">
      <path d="M0 0 Q2 -18 4 -30 L5 -30 Q3 -18 2 0Z" />
      {[-60, -25, 10, 40, 75, 120].map((a) => <path key={a} d="M4.5 -30 q8 -4 14 2 q-7 -2 -14 0z" transform={`rotate(${a} 4.5 -30)`} />)}
    </g>
  );
  return (
    <svg className="absolute inset-x-0 bottom-[44%] h-[40%] w-full" viewBox="0 0 100 50" preserveAspectRatio="xMidYMax meet" aria-hidden>
      <rect x="0" y="46" width="100" height="4" fill="var(--accent)" opacity="0.25" />
      {palm(6, 1)}{palm(18, 0.7, true)}{palm(82, 0.8)}{palm(94, 1.1, true)}
    </svg>
  );
}
function Highway() {
  return (
    <svg className="absolute inset-x-0 bottom-[44%] h-[22%] w-full" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden>
      <path d="M0 30 L0 22 Q25 12 50 18 T100 14 L100 30Z" fill="var(--background)" opacity="0.85" />
      <path d="M0 26 Q25 18 50 22 T100 19" stroke="var(--primary)" strokeWidth="0.4" fill="none" className="anim-dash" strokeDasharray="3 3" />
    </svg>
  );
}
function Mountains() {
  return (
    <svg className="absolute inset-x-0 bottom-[44%] h-[30%] w-full" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
      <path d="M0 40 L12 14 L22 28 L36 6 L50 30 L62 12 L76 26 L88 8 L100 24 L100 40Z" fill="var(--background)" opacity="0.9" />
      <path d="M0 40 L12 14 L22 28 L36 6 L50 30 L62 12 L76 26 L88 8 L100 24" stroke="var(--accent)" strokeWidth="0.4" fill="none" />
    </svg>
  );
}
function Storm() {
  return (
    <>
      <div className="anim-lightning absolute inset-0 bg-foreground" />
      <svg className="anim-lightning absolute left-[30%] top-0 h-[45%] w-16" viewBox="0 0 20 100" aria-hidden><path d="M12 0 L4 45 L11 45 L6 100 L18 38 L10 38 L16 0Z" fill="var(--gold)" /></svg>
      <svg className="anim-lightning absolute right-[25%] top-0 h-[38%] w-12" style={{ animationDelay: "1.7s" }} viewBox="0 0 20 100" aria-hidden><path d="M12 0 L4 45 L11 45 L6 100 L18 38 L10 38 L16 0Z" fill="var(--crimson)" /></svg>
      {Array.from({ length: 30 }).map((_, i) => <span key={i} className="anim-rain absolute h-6 w-px bg-foreground/40" style={{ left: `${(i * 31) % 100}%`, animationDelay: `${(i % 10) * 0.12}s` }} />)}
      <Mountains />
    </>
  );
}
export function Environment({ scene }: { scene: string }) {
  return (
    <div key={scene} className="anim-scene-in pointer-events-none absolute inset-0 overflow-hidden">
      {scene !== "storm" && <Stars n={scene === "highway" ? 60 : 30} />}
      {scene === "highway" ? <div className="absolute right-[15%] top-[14%] h-16 w-16 rounded-full bg-foreground/80 shadow-[0_0_40px_10px] shadow-foreground/30" /> : scene !== "storm" && <Sun />}
      {scene === "skyline" && <Skyline />}
      {scene === "beach" && <Palms />}
      {scene === "highway" && <Highway />}
      {scene === "mountains" && <Mountains />}
      {scene === "storm" && <Storm />}
    </div>
  );
}
