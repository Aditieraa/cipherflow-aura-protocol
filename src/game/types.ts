export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  colors: number;   // available colors
  slots: number;    // sequence length
  attempts: number; // max guesses
  time: number;     // seconds per round
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy:   { id: "easy",   label: "Initiate",  colors: 4, slots: 4, attempts: 8,  time: 180 },
  medium: { id: "medium", label: "Operative", colors: 6, slots: 5, attempts: 10, time: 240 },
  hard:   { id: "hard",   label: "Cipher",    colors: 8, slots: 6, attempts: 12, time: 300 },
};

/** Color palette tokens — 8 distinct neon hues. Slice by difficulty. */
export interface ColorToken {
  id: number;
  name: string;
  /** Tailwind-friendly inline css for the orb gradient + glow */
  base: string;     // hsl
  glow: string;     // hsl with alpha
}

export const COLOR_PALETTE: ColorToken[] = [
  { id: 0, name: "Plasma",   base: "hsl(258 90% 66%)", glow: "hsl(258 90% 66% / 0.65)" },
  { id: 1, name: "Aether",   base: "hsl(217 91% 60%)", glow: "hsl(217 91% 60% / 0.65)" },
  { id: 2, name: "Vortex",   base: "hsl(190 95% 55%)", glow: "hsl(190 95% 55% / 0.65)" },
  { id: 3, name: "Pulse",    base: "hsl(142 71% 45%)", glow: "hsl(142 71% 45% / 0.65)" },
  { id: 4, name: "Solar",    base: "hsl(45 95% 58%)",  glow: "hsl(45 95% 58% / 0.65)"  },
  { id: 5, name: "Ember",    base: "hsl(18 90% 58%)",  glow: "hsl(18 90% 58% / 0.65)"  },
  { id: 6, name: "Crimson",  base: "hsl(0 84% 60%)",   glow: "hsl(0 84% 60% / 0.65)"   },
  { id: 7, name: "Magenta",  base: "hsl(320 85% 62%)", glow: "hsl(320 85% 62% / 0.65)" },
];

export interface Feedback {
  black: number; // exact matches (correct color & position)
  white: number; // partial matches (correct color, wrong position)
}

export interface GuessRow {
  guess: (number | null)[];
  feedback: Feedback | null;
  submitted: boolean;
}

export type GameStatus = "idle" | "playing" | "won" | "lost";

export interface LeaderboardEntry {
  name: string;
  attempts: number;
  timeTaken: number; // seconds
  difficulty: Difficulty;
  date: number;
}