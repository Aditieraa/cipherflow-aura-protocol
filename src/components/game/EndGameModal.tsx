import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorOrb } from "./ColorOrb";
import { addEntry } from "@/game/leaderboard";
import { Difficulty } from "@/game/types";
import { Sparkles, Skull, Trophy } from "lucide-react";

interface EndGameModalProps {
  open: boolean;
  status: "won" | "lost";
  secret: number[];
  attemptsUsed: number;
  timeTaken: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
  onShowLeaderboard: () => void;
  onClose: () => void;
}

export function EndGameModal({
  open, status, secret, attemptsUsed, timeTaken, difficulty,
  onPlayAgain, onShowLeaderboard, onClose,
}: EndGameModalProps) {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) { setName(""); setSaved(false); }
  }, [open]);

  function handleSave() {
    const trimmed = name.trim() || "Anonymous";
    addEntry({
      name: trimmed.slice(0, 24),
      attempts: attemptsUsed,
      timeTaken,
      difficulty,
      date: Date.now(),
    });
    setSaved(true);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md border-white/10 bg-card/95 backdrop-blur-xl shadow-3d">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display tracking-widest">
            {status === "won" ? (
              <>
                <Sparkles className="h-5 w-5 text-[hsl(var(--primary))]" />
                <span className="text-glow-green">Cipher Cracked</span>
              </>
            ) : (
              <>
                <Skull className="h-5 w-5 text-destructive" />
                <span className="text-destructive" style={{ textShadow: "0 0 14px hsl(0 84% 60% / 0.6)" }}>
                  Cipher Locked
                </span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3 text-center">
            Hidden Sequence
          </div>
          <div className="flex items-center justify-center gap-2">
            {secret.map((c, i) => (
              <div key={i} className="animate-slot-drop" style={{ animationDelay: `${i * 80}ms` }}>
                <ColorOrb colorId={c} size="md" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg border border-white/10 bg-black/30 p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Attempts</div>
            <div className="font-display text-2xl text-foreground">{attemptsUsed}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/30 p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Time</div>
            <div className="font-display text-2xl text-foreground">
              {Math.floor(timeTaken / 60).toString().padStart(2, "0")}:
              {(timeTaken % 60).toString().padStart(2, "0")}
            </div>
          </div>
        </div>

        {status === "won" && !saved && (
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Codename</label>
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your codename"
                maxLength={24}
                className="bg-black/40 border-white/10"
              />
              <Button onClick={handleSave} className="bg-gradient-accent border-0">
                <Trophy className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </div>
        )}

        {saved && (
          <p className="text-center text-sm text-[hsl(var(--primary))] text-glow-green">
            Score saved to the archive.
          </p>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 border-white/15 bg-black/30" onClick={onShowLeaderboard}>
            Leaderboard
          </Button>
          <Button className="flex-1 bg-gradient-accent border-0" onClick={onPlayAgain}>
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}