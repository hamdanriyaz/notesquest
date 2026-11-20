import { type Avatar, weaponColor } from "@/lib/avatar";

export function Hero({ avatar, className = "" }: { avatar: Avatar; className?: string }) {
  const c = avatar.color; const w = weaponColor(avatar.weapon);
  const skin = "oklch(0.82 0.06 60)"; const dark = "oklch(0.22 0.05 275)";
  return (
    <svg viewBox="0 0 160 200" className={className} style={{ filter: `drop-shadow(0 0 14px ${c})` }}>
      <ellipse cx="80" cy="192" rx="45" ry="7" fill="black" opacity=".4" />
      <circle cx="80" cy="110" r="70" fill={w} opacity=".08" />
      {/* legs */}
      <rect x="58" y="140" width="16" height="45" rx="5" fill={dark} /><rect x="86" y="140" width="16" height="45" rx="5" fill={dark} />
      <rect x="55" y="178" width="22" height="10" rx="4" fill={c} /><rect x="83" y="178" width="22" height="10" rx="4" fill={c} />
      {/* cape/robe */}
      {(avatar.cls === "mage" || avatar.cls === "scholar") && <path d="M45 75 L30 175 L130 175 L115 75 Z" fill={c} opacity=".55" />}
      {/* torso */}
      <rect x="48" y="72" width="64" height="74" rx="14" fill={avatar.cls === "ranger" ? "oklch(0.6 0.02 260)" : dark} />
      <path d="M52 80 H108 V105 Q80 120 52 105 Z" fill={c} />
      <circle cx="80" cy="96" r="6" fill={w} />
      {/* arm + weapon */}
      <rect x="108" y="82" width="14" height="40" rx="6" fill={c} />
      {avatar.cls === "knight" && <><rect x="118" y="40" width="7" height="80" rx="2" fill="oklch(0.9 0.02 250)" /><rect x="110" y="112" width="23" height="6" rx="2" fill={c} /><rect x="117" y="40" width="9" height="70" fill={w} opacity=".5" /></>}
      {avatar.cls === "mage" && <><rect x="119" y="45" width="5" height="105" fill="oklch(0.55 0.08 60)" /><circle cx="121" cy="42" r="10" fill={w} /></>}
      {avatar.cls === "scholar" && <><rect x="112" y="108" width="26" height="20" rx="3" fill={w} opacity=".8" /><path d="M115 113 H135 M115 118 H132 M115 123 H128" stroke={dark} strokeWidth="2" /></>}
      {avatar.cls === "ranger" && <><rect x="112" y="100" width="38" height="12" rx="4" fill="oklch(0.55 0.02 260)" /><circle cx="150" cy="106" r="5" fill={w} /></>}
      <rect x="38" y="82" width="14" height="40" rx="6" fill={c} />
      {/* head */}
      {avatar.cls === "ranger" ? (
        <><rect x="54" y="22" width="52" height="48" rx="12" fill="oklch(0.65 0.02 260)" /><rect x="60" y="36" width="40" height="12" rx="6" fill={w} /><rect x="77" y="10" width="6" height="14" fill={c} /><circle cx="80" cy="9" r="4" fill={w} /></>
      ) : (
        <>
          <circle cx="80" cy="46" r="24" fill={skin} />
          <circle cx="72" cy="46" r="3" fill={dark} /><circle cx="88" cy="46" r="3" fill={dark} />
          {avatar.cls === "knight" && <path d="M54 46 Q54 18 80 18 Q106 18 106 46 L106 40 L54 40 Z M78 18 L80 4 L82 18" fill={c} stroke={c} strokeWidth="3" />}
          {avatar.cls === "mage" && <path d="M50 30 L80 -8 L110 30 Z" fill={c} />}
          {avatar.cls === "scholar" && <><path d="M56 40 Q56 20 80 20 Q104 20 104 40 Q92 30 80 32 Q66 30 56 40Z" fill={dark} /><rect x="64" y="41" width="32" height="9" rx="4" fill="none" stroke={w} strokeWidth="2.5" /></>}
        </>
      )}
    </svg>
  );
}
