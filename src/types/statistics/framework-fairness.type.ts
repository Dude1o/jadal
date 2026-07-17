export interface Framework {
  framework_id: number;
  label: string;
  prop_win_rate: number;
  opp_win_rate: number;
  imbalance_score: number;
  flagged: boolean;
  n_debates: number;
}

export interface FrameworkFairness {
  stat: string;
  min_n_debates: number;
  frameworks: Framework[];
}
