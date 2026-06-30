export interface MotionFramework {
  id: number;
  name: string;
  color_hex: string | null;
  created_at: string | null;
}

export interface Motion {
  id: number;
  added_by?: number;
  text: string;
  frameworks: MotionFramework[];
  created_at?: string;
  updated_at?: string;
}

export interface MotionFrameworkPivot {
  motion_id: number;
  framework_id: number;
}
