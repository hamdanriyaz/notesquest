import { CLASSES, COLORS, WEAPONS, type Avatar } from "@/lib/avatar";
import { Hero } from "./Hero";
import { sfx } from "@/lib/sound";

export function AvatarCustomizer({ avatar, onChange }: { avatar: Avatar; onChange: (a: Avatar) => void }) {
  const set = (p: Partial<Avatar>) => { sfx.click(); onChange({ ...avatar, ...p }); };
  return (
    <section className="panel mb-6 grid gap-5 p-5 md:grid-cols-[220px_1fr]">
      <div className="relative flex flex-col items-center justify-end overflow-hidden rounded-xl arena-sky p-3">
        <div className="absolute inset-x-[-50%] bottom-0 h-1/2 arena-floor" />
        <div className="anim-breathe relative"><Hero avatar={avatar} className="h-48 w-auto" /></div>
        <div className="relative mt-1 font-display text-sm text-primary">{CLASSES.find((c) => c.id === avatar.cls)!.name}</div>
      </div>
      <div>
        <h2 className="mb-3 text-xl text-gold">Avatar Customizer</h2>
        <div className="mb-3">
          <div className="mb-1 text-xs tracking-widest text-muted-foreground">HERO CLASS</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CLASSES.map((c) => (
              <button key={c.id} onClick={() => set({ cls: c.id })} className={`btn-option flex flex-col items-center p-2 text-xs font-semibold ${avatar.cls === c.id ? "border-primary bg-primary/15" : ""}`}>
                <Hero avatar={{ ...avatar, cls: c.id }} className="h-14 w-auto" />{c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <div className="mb-1 text-xs tracking-widest text-muted-foreground">ARMOR COLOR</div>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button key={c} aria-label="Armor color" onClick={() => set({ color: c })} className={`h-9 w-9 rounded-full border-2 transition hover:scale-110 ${avatar.color === c ? "scale-110 border-foreground" : "border-transparent"}`} style={{ background: c, boxShadow: `0 0 14px ${c}` }} />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs tracking-widest text-muted-foreground">WEAPON / AURA</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {WEAPONS.map((w) => (
              <button key={w.id} onClick={() => set({ weapon: w.id })} className={`btn-option flex items-center gap-2 p-2 text-left text-xs font-semibold ${avatar.weapon === w.id ? "border-primary bg-primary/15" : ""}`}>
                <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: w.color, boxShadow: `0 0 10px ${w.color}` }} />{w.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
