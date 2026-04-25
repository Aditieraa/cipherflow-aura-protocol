import { DIFFICULTIES, Difficulty } from "@/game/types";
import { cn } from "@/lib/utils";

interface DifficultyPickerProps {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  compact?: boolean;
}

export function DifficultyPicker({ value, onChange, compact }: DifficultyPickerProps) {
  const items = (Object.keys(DIFFICULTIES) as Difficulty[]).map(k => DIFFICULTIES[k]);
  return (
    <div className={cn("grid gap-3", compact ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3")}>
      {items.map(d => {
        const active = value === d.id;
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => onChange(d.id)}
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-gradient-card p-4 text-left transition-all duration-300 preserve-3d",
              "hover:-translate-y-1 hover:[transform:translateY(-4px)_translateZ(20px)]",
              active
                ? "border-accent/70 shadow-[0_0_24px_hsl(258_90%_66%/0.45)] [transform:translateZ(18px)]"
                : "border-white/10 hover:border-accent/40",
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn(
                "font-display text-xs uppercase tracking-[0.25em]",
                active ? "text-accent text-glow-purple" : "text-muted-foreground",
              )}>
                {d.id}
              </span>
              <span className="text-[10px] text-muted-foreground">{d.colors}c × {d.slots}s</span>
            </div>
            <div className="font-display text-lg sm:text-xl font-bold text-foreground">{d.label}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {d.attempts} attempts · {Math.floor(d.time / 60)}:{(d.time % 60).toString().padStart(2,"0")}
            </div>
            {active && (
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}