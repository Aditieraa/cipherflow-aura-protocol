import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DIFFICULTIES,
  Difficulty,
  GameStatus,
  GuessRow,
} from "./types";
import { evaluateGuess, generateSecret } from "./engine";

export interface UseGameApi {
  difficulty: Difficulty;
  config: typeof DIFFICULTIES[Difficulty];
  status: GameStatus;
  rows: GuessRow[];
  activeRow: number;
  secret: number[];
  timeLeft: number;
  elapsed: number;
  start: (d: Difficulty) => void;
  reset: () => void;
  setSlot: (slotIndex: number, colorId: number) => void;
  clearSlot: (slotIndex: number) => void;
  submitRow: () => void;
}

function makeRows(attempts: number, slots: number): GuessRow[] {
  return Array.from({ length: attempts }, () => ({
    guess: Array.from({ length: slots }, () => null),
    feedback: null,
    submitted: false,
  }));
}

export function useGame(initial: Difficulty = "medium"): UseGameApi {
  const [difficulty, setDifficulty] = useState<Difficulty>(initial);
  const config = DIFFICULTIES[difficulty];

  const [secret, setSecret] = useState<number[]>(() => generateSecret(config.slots, config.colors));
  const [rows, setRows] = useState<GuessRow[]>(() => makeRows(config.attempts, config.slots));
  const [activeRow, setActiveRow] = useState(0);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(config.time);
  const [elapsed, setElapsed] = useState(0);

  const startedAt = useRef<number | null>(null);

  const start = useCallback((d: Difficulty) => {
    const cfg = DIFFICULTIES[d];
    setDifficulty(d);
    setSecret(generateSecret(cfg.slots, cfg.colors));
    setRows(makeRows(cfg.attempts, cfg.slots));
    setActiveRow(0);
    setTimeLeft(cfg.time);
    setElapsed(0);
    startedAt.current = Date.now();
    setStatus("playing");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setRows(makeRows(config.attempts, config.slots));
    setActiveRow(0);
    setTimeLeft(config.time);
    setElapsed(0);
    startedAt.current = null;
  }, [config.attempts, config.slots, config.time]);

  // Timer
  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1;
        if (next <= 0) {
          setStatus("lost");
          return 0;
        }
        return next;
      });
      setElapsed(e => e + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [status]);

  const setSlot = useCallback((slotIndex: number, colorId: number) => {
    if (status !== "playing") return;
    setRows(prev => {
      const next = prev.map(r => ({ ...r, guess: [...r.guess] }));
      const r = next[activeRow];
      if (!r || r.submitted) return prev;
      r.guess[slotIndex] = colorId;
      return next;
    });
  }, [activeRow, status]);

  const clearSlot = useCallback((slotIndex: number) => {
    if (status !== "playing") return;
    setRows(prev => {
      const next = prev.map(r => ({ ...r, guess: [...r.guess] }));
      const r = next[activeRow];
      if (!r || r.submitted) return prev;
      r.guess[slotIndex] = null;
      return next;
    });
  }, [activeRow, status]);

  const submitRow = useCallback(() => {
    if (status !== "playing") return;
    const row = rows[activeRow];
    if (!row || row.guess.some(g => g === null)) return;

    const fb = evaluateGuess(secret, row.guess);
    const nextRows = rows.map((r, i) =>
      i === activeRow ? { ...r, submitted: true, feedback: fb } : r
    );
    setRows(nextRows);

    if (fb.black === config.slots) {
      setStatus("won");
      return;
    }
    if (activeRow + 1 >= config.attempts) {
      setStatus("lost");
      return;
    }
    setActiveRow(activeRow + 1);
  }, [activeRow, rows, secret, status, config.attempts, config.slots]);

  return useMemo(() => ({
    difficulty, config, status, rows, activeRow, secret,
    timeLeft, elapsed, start, reset, setSlot, clearSlot, submitRow,
  }), [difficulty, config, status, rows, activeRow, secret, timeLeft, elapsed, start, reset, setSlot, clearSlot, submitRow]);
}