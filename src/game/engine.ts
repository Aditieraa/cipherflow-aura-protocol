import { Feedback } from "./types";

/**
 * Strict two-pass Mastermind evaluation.
 * Pass 1: exact matches (black pegs).
 * Pass 2: from remaining unmatched, count color matches without double-counting (white pegs).
 */
export function evaluateGuess(secret: number[], guess: (number | null)[]): Feedback {
  if (guess.length !== secret.length) {
    throw new Error("Guess length must equal secret length");
  }

  const secretRem: (number | null)[] = [...secret];
  const guessRem: (number | null)[] = [...guess];

  let black = 0;
  // Pass 1
  for (let i = 0; i < secret.length; i++) {
    if (guessRem[i] !== null && guessRem[i] === secretRem[i]) {
      black++;
      secretRem[i] = null;
      guessRem[i] = null;
    }
  }

  let white = 0;
  // Pass 2
  for (let i = 0; i < guessRem.length; i++) {
    const g = guessRem[i];
    if (g === null) continue;
    const idx = secretRem.indexOf(g);
    if (idx !== -1) {
      white++;
      secretRem[idx] = null;
    }
  }

  return { black, white };
}

/** Generate a secret sequence with possible duplicates. */
export function generateSecret(slots: number, colors: number): number[] {
  const secret: number[] = [];
  for (let i = 0; i < slots; i++) {
    secret.push(Math.floor(Math.random() * colors));
  }
  return secret;
}