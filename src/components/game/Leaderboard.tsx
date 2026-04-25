import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DIFFICULTIES, Difficulty, LeaderboardEntry } from "@/game/types";
import { getLeaderboard } from "@/game/leaderboard";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface LeaderboardProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initialDifficulty?: Difficulty;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

export function Leaderboard({ open, onOpenChange, initialDifficulty = "medium" }: LeaderboardProps) {
  const [diff, setDiff] = useState<Difficulty>(initialDifficulty);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (open) setEntries(getLeaderboard(diff));
  }, [open, diff]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-white/10 bg-card/95 backdrop-blur-xl shadow-3d">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display tracking-widest">
            <Trophy className="h-5 w-5 text-accent" />
            <span className="text-glow-purple">Leaderboard</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map(k => (
            <button
              key={k}
              onClick={() => setDiff(k)}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-display uppercase tracking-widest transition-all",
                diff === k
                  ? "border-accent/60 bg-accent/15 text-accent text-glow-purple"
                  : "border-white/10 text-muted-foreground hover:border-white/20",
              )}
            >
              {DIFFICULTIES[k].label}
            </button>
          ))}
        </div>

        <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
          {entries.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No records yet. Crack the cipher to claim your rank.
            </p>
          )}
          {entries.map((e, i) => (
            <div
              key={`${e.date}-${i}`}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-white/5 bg-black/30 px-3 py-2",
                i === 0 && "border-accent/40 bg-accent/10",
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md font-display text-sm",
                i === 0 ? "bg-gradient-accent text-white" : "bg-white/5 text-muted-foreground",
              )}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate font-display text-sm text-foreground">{e.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {new Date(e.date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-sm text-foreground">{e.attempts} attempts</div>
                <div className="text-[11px] text-muted-foreground">{fmtTime(e.timeTaken)}</div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}