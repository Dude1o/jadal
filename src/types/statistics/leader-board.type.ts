import type { ImprovementBand, LeaderboardBoard } from "../shared/enums";

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  name: string;
  value: number;
  band?: ImprovementBand; // present only when board = most_improved
  n_debates: number;
}

export interface Leaderboard {
  stat: string;
  board: LeaderboardBoard;
  min_n_debates: number;
  entries: LeaderboardEntry[];
}
