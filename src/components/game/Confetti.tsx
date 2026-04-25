import { useMemo } from "react";
import { COLOR_PALETTE } from "@/game/types";

/** Lightweight CSS particle confetti — no JS animation loop. */
export function Confetti({ count = 60 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const c = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
        return {
          left: Math.random() * 100,
          delay: Math.random() * 600,
          drift: (Math.random() - 0.5) * 220,
          color: c.base,
          glow: c.glow,
          size: 6 + Math.random() * 10,
          rot: Math.random() * 360,
          key: i,
        };
      }),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map(p => (
        <span
          key={p.key}
          className="absolute top-0 animate-confetti rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            boxShadow: `0 0 8px ${p.glow}`,
            transform: `rotate(${p.rot}deg)`,
            // @ts-expect-error css var
            "--cx": `${p.drift}px`,
            "--c-delay": `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}