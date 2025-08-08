import type { PlayerName } from "@/components/PlayerAvatars";

export interface MatchEntry {
  id: string; // e.g., 2025-08-08-M1
  label: string; // M1, M2
  date: string; // YYYY-MM-DD
  screenshot?: string; // data URL
  teamKills?: number;
  teamPosition?: number;
  playerKills?: Partial<Record<PlayerName, number>>;
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD
  count: number; // number of matches assigned
}
