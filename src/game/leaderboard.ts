import { Difficulty, LeaderboardEntry } from "./types";

const KEY = "cipherflow:leaderboard:v1";

function read(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr as LeaderboardEntry[];
  } catch { return []; }
}

function write(entries: LeaderboardEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function getLeaderboard(difficulty?: Difficulty): LeaderboardEntry[] {
  const all = read();
  const filtered = difficulty ? all.filter(e => e.difficulty === difficulty) : all;
  // Better = fewer attempts, then less time
  return [...filtered].sort((a, b) =>
    a.attempts !== b.attempts ? a.attempts - b.attempts : a.timeTaken - b.timeTaken
  );
}

export function addEntry(entry: LeaderboardEntry) {
  const all = read();
  all.push(entry);
  // Keep top 10 per difficulty
  const grouped: Record<string, LeaderboardEntry[]> = {};
  for (const e of all) {
    grouped[e.difficulty] ??= [];
    grouped[e.difficulty].push(e);
  }
  const trimmed: LeaderboardEntry[] = [];
  for (const diff of Object.keys(grouped)) {
    const sorted = grouped[diff].sort((a, b) =>
      a.attempts !== b.attempts ? a.attempts - b.attempts : a.timeTaken - b.timeTaken
    );
    trimmed.push(...sorted.slice(0, 10));
  }
  write(trimmed);
}