import type { Entry } from "@/lib/leaderboard";
export function LeaderboardList({ board, highlight, limit = 10 }: { board: Entry[]; highlight?: string | null; limit?: number }) {
  if (board.length === 0) return <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No champions yet — be the first to defeat the Boss and claim #1!</p>;
  return (
    <ol className="space-y-2">
      {board.slice(0, limit).map((b, i) => (
        <li key={b.id ?? i} className={`flex items-center gap-3 rounded-lg p-2 ${highlight && b.id === highlight ? "bg-gold/20 ring-1 ring-gold" : "bg-secondary"}`}>
          <span className={`w-8 text-center font-display ${i === 0 ? "text-gold" : "text-muted-foreground"}`}>{i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
          <div className="min-w-0 flex-1"><div className="truncate font-semibold">{b.name} {b.won ? "🏅" : ""}</div><div className="truncate text-xs text-muted-foreground">{b.major} · {b.topic}</div></div>
          <div className="text-right"><div className="font-display text-primary">{b.score.toLocaleString()}</div><div className="text-xs text-muted-foreground">{b.accuracy}%</div></div>
        </li>
      ))}
    </ol>
  );
}
