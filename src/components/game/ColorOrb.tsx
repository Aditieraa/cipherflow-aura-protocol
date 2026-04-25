import { COLOR_PALETTE } from "@/game/types";
import { cn } from "@/lib/utils";

interface ColorOrbProps {
  colorId: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  glow?: boolean;
  empty?: boolean;
}

const SIZE_MAP = {
  sm: "h-8 w-8",
  md: "h-12 w-12 sm:h-14 sm:w-14",
  lg: "h-14 w-14 sm:h-16 sm:w-16",
};

export function ColorOrb({ colorId, size = "md", className, glow = true, empty = false }: ColorOrbProps) {
  const token = colorId !== null ? COLOR_PALETTE[colorId] : null;

  if (!token || empty) {
    return (
      <div
        className={cn(
          "rounded-full shadow-slot border border-white/5",
          "bg-[radial-gradient(circle_at_30%_25%,hsl(220_30%_22%/0.6),hsl(222_50%_4%/0.9))]",
          SIZE_MAP[size],
          className
        )}
      />
    );
  }

  return (
    <div className={cn("relative rounded-full preserve-3d", SIZE_MAP[size], className)}>
      {glow && (
        <div
          aria-hidden
          className="absolute inset-0 rounded-full -z-10 blur-md"
          style={{ background: token.glow, opacity: 0.9 }}
        />
      )}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 25%, hsl(0 0% 100% / 0.55), ${token.base} 45%, hsl(0 0% 0% / 0.5) 100%)`,
          boxShadow: `inset 0 -3px 6px hsl(0 0% 0% / 0.45), inset 0 2px 3px hsl(0 0% 100% / 0.35), 0 6px 16px ${token.glow}`,
        }}
      />
      <div
        aria-hidden
        className="absolute top-[12%] left-[22%] h-[28%] w-[34%] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(0 0% 100% / 0.65), transparent 70%)" }}
      />
    </div>
  );
}