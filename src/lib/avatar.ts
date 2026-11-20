export type HeroClass = "scholar" | "knight" | "mage" | "ranger";
export type Weapon = "plasma" | "fireball" | "lightning" | "void";
export interface Avatar { cls: HeroClass; color: string; weapon: Weapon; }
export const CLASSES: { id: HeroClass; name: string }[] = [
  { id: "scholar", name: "Cyber Scholar" }, { id: "knight", name: "Neon Knight" },
  { id: "mage", name: "AI Mage" }, { id: "ranger", name: "Robo-Ranger" },
];
export const COLORS = ["oklch(0.82 0.15 200)", "oklch(0.84 0.16 85)", "oklch(0.7 0.25 350)", "oklch(0.8 0.22 145)", "oklch(0.7 0.2 300)", "oklch(0.72 0.2 40)"];
export const WEAPONS: { id: Weapon; name: string; color: string }[] = [
  { id: "plasma", name: "Cyan Plasma Bolt", color: "oklch(0.85 0.16 200)" },
  { id: "fireball", name: "Golden Fireball", color: "oklch(0.85 0.17 80)" },
  { id: "lightning", name: "Emerald Lightning", color: "oklch(0.82 0.22 150)" },
  { id: "void", name: "Purple Void Beam", color: "oklch(0.65 0.25 300)" },
];
export const DEFAULT_AVATAR: Avatar = { cls: "knight", color: COLORS[2]!, weapon: "fireball" };
export const weaponColor = (w: Weapon) => WEAPONS.find((x) => x.id === w)!.color;
const KEY = "notequest-avatar";
export function loadAvatar(): Avatar {
  try { const r = localStorage.getItem(KEY); if (r) return { ...DEFAULT_AVATAR, ...JSON.parse(r) }; } catch { /* ignore */ }
  return DEFAULT_AVATAR;
}
export const saveAvatar = (a: Avatar) => localStorage.setItem(KEY, JSON.stringify(a));
