import { MatchEntry } from "@/types/match";

const STORAGE_KEYS = {
  schedule: "havoc:schedule",
  matches: "havoc:matches",
} as const;

export function getToday(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function saveSchedule(date: string, count: number) {
  const map = getScheduleMap();
  map[date] = count;
  localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(map));
}

export function getSchedule(date: string): number | undefined {
  const map = getScheduleMap();
  return map[date];
}

function getScheduleMap(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.schedule) || "{}");
  } catch {
    return {};
  }
}

export function getMatches(): MatchEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.matches) || "[]");
  } catch {
    return [];
  }
}

export function saveMatches(list: MatchEntry[]) {
  localStorage.setItem(STORAGE_KEYS.matches, JSON.stringify(list));
}

export function upsertMatch(entry: MatchEntry) {
  const list = getMatches();
  const idx = list.findIndex((m) => m.id === entry.id);
  if (idx >= 0) list[idx] = entry; else list.push(entry);
  saveMatches(list);
}

export function buildMatchId(date: string, index: number) {
  return `${date}-M${index}`;
}
