import { useEffect, useRef, useState } from "react";

const LINES = [
  "ANALYZING SEQUENCE...",
  "BYPASSING FIREWALL...",
  "CROSS-REFERENCING CIPHER...",
  "DECRYPTING NODE 0x7F...",
  "SCANNING FREQUENCY BAND...",
  "TRIANGULATING SIGNAL...",
  "PROBING MAINFRAME...",
  "INJECTING PAYLOAD...",
  "RECALIBRATING MATRIX...",
  "CHANNEL LOCKED",
  "HANDSHAKE ACCEPTED",
  "NODE 0xA3 RESOLVED",
  "ENTROPY 0.842",
  "RUNNING HEURISTIC PASS...",
  "QUANTUM SHIFT DETECTED",
];

const PREFIXES = ["[SYS]", "[NET]", "[CIPHER]", "[CORE]", "[AUTH]"];

interface Props {
  active: boolean;
}

export function TerminalLog({ active }: Props) {
  const [lines, setLines] = useState<{ id: number; text: string }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const tick = () => {
      const text = `${PREFIXES[Math.floor(Math.random() * PREFIXES.length)]} ${LINES[Math.floor(Math.random() * LINES.length)]}`;
      idRef.current += 1;
      setLines(prev => [...prev.slice(-4), { id: idRef.current, text }]);
    };
    tick();
    const id = window.setInterval(tick, 1200 + Math.random() * 800);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div className="w-full font-mono text-[10px] leading-snug text-[hsl(142_71%_55%)]/80">
      <div className="rounded-md border border-[hsl(142_71%_45%)]/25 bg-black/60 backdrop-blur-sm px-3 py-2 shadow-[0_0_18px_hsl(142_71%_45%/0.18)]">
        <div className="mb-1 flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-[hsl(142_71%_55%)]/60">
          <span>cipher://terminal</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(142_71%_55%)] animate-term-blink" />
            live
          </span>
        </div>
        <div className="space-y-0.5 min-h-[60px] max-h-[88px] overflow-hidden">
          {lines.map(l => (
            <div key={l.id} className="animate-term-line-in truncate">
              <span className="text-[hsl(142_71%_55%)]/50">&gt;</span> {l.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}