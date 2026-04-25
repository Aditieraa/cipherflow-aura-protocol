import { useEffect, useRef, useState } from "react";
import { useGame } from "@/game/useGame";
import { Button } from "@/components/ui/button";
import { ColorPalette } from "./ColorPalette";
import { GuessRow } from "./GuessRow";
import { TimerArc } from "./TimerArc";
import { DifficultyPicker } from "./DifficultyPicker";
import { Leaderboard } from "./Leaderboard";
import { EndGameModal } from "./EndGameModal";
import { Confetti } from "./Confetti";
import { Difficulty } from "@/game/types";
import { Eraser, RotateCcw, Send, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function GameBoard() {
  const game = useGame("medium");
  const [pickerDiff, setPickerDiff] = useState<Difficulty>("medium");
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [showLB, setShowLB] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    if (game.status === "won" || game.status === "lost") {
      const t = setTimeout(() => setShowEnd(true), 700);
      return () => clearTimeout(t);
    }
  }, [game.status]);

  // Parallax tilt
  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = boardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 6, ry: x * 6 });
  }
  function handleLeave() { setTilt({ rx: 0, ry: 0 }); }

  const activeRow = game.rows[game.activeRow];
  const canSubmit = game.status === "playing" && activeRow && activeRow.guess.every(c => c !== null);

  function handlePick(colorId: number) {
    if (game.status !== "playing") return;
    const slot = selectedSlot;
    game.setSlot(slot, colorId);
    // advance selected slot
    const next = (slot + 1) % game.config.slots;
    setSelectedSlot(next);
  }

  function handleClearRow() {
    if (!activeRow) return;
    for (let i = 0; i < game.config.slots; i++) game.clearSlot(i);
    setSelectedSlot(0);
  }

  if (game.status === "idle") {
    return (
      <IdleScreen
        diff={pickerDiff}
        setDiff={setPickerDiff}
        onStart={() => game.start(pickerDiff)}
        onLeaderboard={() => setShowLB(true)}
      />
    );
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto scene-3d">
      {game.status === "won" && <Confetti />}

      {/* HUD */}
      <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-gradient-card shadow-3d px-4 sm:px-6 py-3 preserve-3d">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-accent shadow-[0_0_20px_hsl(258_90%_66%/0.6)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-display text-base sm:text-lg font-bold tracking-widest text-foreground">
              CIPHER<span className="text-glow-purple text-accent">FLOW</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {game.config.label} · {game.config.slots} slots · {game.config.colors} colors
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Attempts</div>
            <div className="font-display text-lg text-foreground">
              <span className="text-accent text-glow-purple">{game.config.attempts - game.activeRow}</span>
              <span className="text-muted-foreground text-sm"> / {game.config.attempts}</span>
            </div>
          </div>
          <TimerArc total={game.config.time} remaining={game.timeLeft} size={72} />
        </div>
      </div>

      {/* Board with parallax tilt */}
      <div
        ref={boardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cn(
          "relative rounded-3xl border border-white/10 bg-gradient-card shadow-3d p-3 sm:p-5 preserve-3d transition-transform duration-300",
          game.status === "won" && "animate-win-zoom",
        )}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* ambient orbs */}
        <div aria-hidden className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl animate-float-orb" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-[hsl(var(--accent-blue))]/20 blur-3xl animate-float-orb" style={{ animationDelay: "1.4s" }} />

        <div className="relative space-y-2.5 sm:space-y-3 preserve-3d">
          {game.rows.map((row, i) => (
            <GuessRow
              key={i}
              row={row}
              index={i}
              isActive={i === game.activeRow && game.status === "playing"}
              slots={game.config.slots}
              onSlotClick={(slot) => setSelectedSlot(slot)}
              onSlotClear={(slot) => game.clearSlot(slot)}
              selectedSlot={i === game.activeRow ? selectedSlot : undefined}
              onSelectSlot={setSelectedSlot}
            />
          ))}
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearRow}
            disabled={game.status !== "playing"}
            className="border-white/15 bg-black/30 hover:bg-black/50"
          >
            <Eraser className="h-4 w-4 mr-1.5" /> Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => game.reset()}
            className="border-white/15 bg-black/30 hover:bg-black/50"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" /> New Game
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLB(true)}
            className="border-white/15 bg-black/30 hover:bg-black/50"
          >
            <Trophy className="h-4 w-4 mr-1.5" /> Ranks
          </Button>
        </div>
        <Button
          size="lg"
          disabled={!canSubmit}
          onClick={() => game.submitRow()}
          className={cn(
            "bg-gradient-accent border-0 font-display tracking-widest px-6",
            canSubmit && "shadow-[0_0_28px_hsl(258_90%_66%/0.6)]",
          )}
        >
          <Send className="h-4 w-4 mr-2" /> Submit
        </Button>
      </div>

      {/* Color palette */}
      <div className="mt-5 preserve-3d">
        <ColorPalette
          available={game.config.colors}
          onPick={handlePick}
          disabled={game.status !== "playing"}
          hint={`Slot ${selectedSlot + 1} of ${game.config.slots}`}
        />
      </div>

      <Leaderboard open={showLB} onOpenChange={setShowLB} initialDifficulty={game.difficulty} />
      <EndGameModal
        open={showEnd}
        status={game.status === "lost" ? "lost" : "won"}
        secret={game.secret}
        attemptsUsed={game.activeRow + (game.status === "won" ? 1 : 1)}
        timeTaken={game.elapsed}
        difficulty={game.difficulty}
        onClose={() => setShowEnd(false)}
        onShowLeaderboard={() => { setShowEnd(false); setShowLB(true); }}
        onPlayAgain={() => { setShowEnd(false); game.start(game.difficulty); setSelectedSlot(0); }}
      />
    </div>
  );
}

function IdleScreen({
  diff, setDiff, onStart, onLeaderboard,
}: {
  diff: Difficulty;
  setDiff: (d: Difficulty) => void;
  onStart: () => void;
  onLeaderboard: () => void;
}) {
  return (
    <div className="relative w-full max-w-2xl mx-auto scene-3d">
      <div className="rounded-3xl border border-white/10 bg-gradient-card shadow-3d p-6 sm:p-10 preserve-3d text-center relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-accent/30 blur-3xl animate-float-orb" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[hsl(var(--accent-blue))]/25 blur-3xl animate-float-orb" style={{ animationDelay: "1.2s" }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
            Mainframe Online
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
            CIPHER<span className="text-glow-purple text-accent">FLOW</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm sm:text-base text-muted-foreground">
            A cinematic Mastermind protocol. Decode the hidden color sequence before the system locks down.
          </p>

          <div className="mt-8">
            <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Select Protocol</div>
            <DifficultyPicker value={diff} onChange={setDiff} />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={onStart}
              className="bg-gradient-accent border-0 font-display tracking-widest px-8 shadow-[0_0_30px_hsl(258_90%_66%/0.55)] hover:shadow-[0_0_44px_hsl(258_90%_66%/0.75)]"
            >
              <Sparkles className="h-4 w-4 mr-2" /> Initiate Decode
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onLeaderboard}
              className="border-white/15 bg-black/30 hover:bg-black/50 font-display tracking-widest"
            >
              <Trophy className="h-4 w-4 mr-2" /> Leaderboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}