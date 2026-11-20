export function Shield({ active, breaking }: { active: boolean; breaking?: boolean }) {
  return (
    <svg viewBox="0 0 24 28" className={`h-8 w-7 ${breaking ? "anim-shatter" : active ? "anim-glow" : "opacity-25"}`}>
      <path d="M12 1 L22 5 V13 C22 20 17 25 12 27 C7 25 2 20 2 13 V5 Z" fill={active || breaking ? "color-mix(in oklab, var(--cyan) 35%, transparent)" : "transparent"} stroke={active || breaking ? "var(--cyan)" : "var(--muted-foreground)"} strokeWidth="2" />
      {breaking && <path d="M12 4 L10 11 L14 14 L11 22" stroke="var(--foreground)" strokeWidth="1.5" fill="none" />}
    </svg>
  );
}
