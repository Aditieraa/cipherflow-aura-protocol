import { COLOR_PALETTE, GuessRow as GuessRowType } from "@/game/types";
import { cn } from "@/lib/utils";
import { ColorOrb } from "./ColorOrb";
import { FeedbackPegs } from "./FeedbackPegs";

interface GuessRowProps {
  row: GuessRowType;
  index: number;
  isActive: boolean;
  slots: number;
  onSlotClick?: (slot: number) => void;
  onSlotClear?: (slot: number) => void;
  selectedSlot?: number;
  onSelectSlot?: (slot: number) => void;
  computing?: boolean;
  resultGlow?: "green" | "red" | null;
}

export function GuessRow({
  row, index, isActive, slots,
  onSlotClick, onSlotClear, selectedSlot, onSelectSlot,
  computing, resultGlow,
}: GuessRowProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl preserve-3d transition-all duration-500",
        "border bg-gradient-card shadow-3d animate-row-reveal",
        isActive
          ? "border-accent/60 ring-1 ring-accent/40 animate-pulse-glow"
          : "border-white/5 opacity-80",
        computing && "animate-row-compute",
        resultGlow === "green" && "animate-result-green",
        resultGlow === "red" && "animate-result-red",
      )}
      style={{
        transform: isActive ? "translateZ(36px)" : row.submitted ? "translateZ(0)" : "translateZ(8px)",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Row index */}
      <div
        className={cn(
          "flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 font-display text-xs sm:text-sm",
          isActive ? "bg-accent/20 text-accent text-glow-purple" : "bg-black/30 text-muted-foreground",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Slots */}
      <div className="flex flex-1 items-center justify-center gap-2 sm:gap-3">
        {row.guess.map((c, slotIdx) => {
          const interactive = isActive && !row.submitted;
          const isSelected = interactive && selectedSlot === slotIdx;
          return (
            <button
              key={slotIdx}
              type="button"
              disabled={!interactive}
              onClick={() => {
                if (!interactive) return;
                if (c !== null && onSlotClear) onSlotClear(slotIdx);
                onSelectSlot?.(slotIdx);
                onSlotClick?.(slotIdx);
              }}
              className={cn(
                "relative rounded-full transition-all duration-300 preserve-3d",
                interactive && "hover:scale-110 hover:-translate-y-0.5 cursor-pointer",
                isSelected && "ring-2 ring-accent ring-offset-2 ring-offset-background scale-105",
                !interactive && "cursor-default",
              )}
              aria-label={`Slot ${slotIdx + 1}${c !== null ? `, ${COLOR_PALETTE[c].name}` : ", empty"}`}
            >
              <ColorOrb colorId={c} size="md" />
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <div className="shrink-0">
        <FeedbackPegs feedback={row.feedback} slots={slots} reveal={row.submitted} />
      </div>
    </div>
  );
}