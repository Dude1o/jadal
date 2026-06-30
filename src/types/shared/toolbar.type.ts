export interface ToolbarFilterOption {
  label: string;
  value: string;
}

export interface ToolbarFilter {
  id: string;
  title: string;
  options: ToolbarFilterOption[];
}