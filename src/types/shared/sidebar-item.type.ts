import type { LucideProps } from "lucide-react";

export type SideBarItem = {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  > | null;
  subItems?: SideBarItem[];
  search?: Record<string, string>;
  hasPlusIcon?: boolean;
};
