import { cn } from "@/lib/utils";

interface TimerArcProps {
  total: number;
  remaining: number;
  size?: number;
}

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

export function TimerArc({ total, remaining, size = 96 }: TimerArcProps) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? Math.max(0, remaining / total) : 0;
  const offset = circumference * (1 - ratio);

  const color =
    ratio > 0.5 ? "hsl(142 71% 45%)"
    : ratio > 0.25 ? "hsl(45 95% 58%)"
    : "hsl(0 84% 60%)";

  const glow =
    ratio > 0.5 ? "drop-shadow(0 0 10px hsl(142 71% 45% / 0.7))"
    : ratio > 0.25 ? "drop-shadow(0 0 10px hsl(45 95% 58% / 0.7))"
    : "drop-shadow(0 0 12px hsl(0 84% 60% / 0.8))";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ filter: glow }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="hsl(220 30% 22% / 0.6)" strokeWidth={6} fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={6} fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s linear, stroke 0.4s ease" }}
        />
      </svg>
      <div className={cn(
        "absolute inset-0 flex flex-col items-center justify-center font-display",
        ratio <= 0.25 && "animate-pulse",
      )}>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Time</span>
        <span className="text-base sm:text-lg font-bold text-foreground">{fmt(remaining)}</span>
      </div>
    </div>
  );
}