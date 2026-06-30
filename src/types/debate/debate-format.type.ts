export interface Phase {
  name: string;
  duration: string;
  side: "proposition" | "opposition";
}

export interface PhaseConfig {
  phases: Phase[];
  speakers_per_team: number;
  teams_count: number;
}

export interface DebateFormat {
  id: number;
  name: string;
  description: string | null;
  phase_config: Phase[];
  created_at: string;
  updated_at: string;
}
