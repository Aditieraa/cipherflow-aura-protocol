import { Feedback } from "@/game/types";
import { cn } from "@/lib/utils";

interface FeedbackPegsProps {
  feedback: Feedback | null;
  slots: number;
  reveal: boolean;
}

/**
 * Renders feedback pegs in a compact grid:
 *  • black peg = exact match (glowing green)
 *  • white peg = partial match (glowing white)
 *  • empty = no match
 * Pegs animate in sequentially using CSS custom delays.
 */
export function FeedbackPegs({ feedback, slots, reveal }: FeedbackPegsProps) {
  const totalPegs = slots;
  const black = feedback?.black ?? 0;
  const white = feedback?.white ?? 0;

  // Build peg list: black first, then white, then empty fillers
  const pegs: ("black" | "white" | "none")[] = [];
  for (let i = 0; i < black; i++) pegs.push("black");
  for (let i = 0; i < white; i++) pegs.push("white");
  while (pegs.length < totalPegs) pegs.push("none");

  // Lay out as 2 rows
  const cols = Math.ceil(totalPegs / 2);

  return (
    <div
      className="grid gap-1.5 sm:gap-2 p-2 rounded-lg border border-white/5 bg-black/30 backdrop-blur-sm preserve-3d"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {pegs.map((p, i) => (
        <div
          key={i}
          className={cn(
            "h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full",
            reveal ? "animate-peg-pop" : "opacity-0",
            p === "black" && "bg-[hsl(var(--primary))] shadow-[0_0_10px_hsl(var(--primary)/0.85),inset_0_-1px_2px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)]",
            p === "white" && "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.6)]",
            p === "none"  && "bg-white/5 border border-white/10",
          )}
          style={
            reveal
              ? ({ ["--peg-delay" as string]: `${i * 100 + 80}ms` } as React.CSSProperties)
              : undefined
          }
        />
      ))}
    </div>
  );
}