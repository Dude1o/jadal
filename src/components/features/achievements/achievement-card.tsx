import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Trash,
  Edit,
  Trophy,
  Medal,
  Award,
  Star,
  Heart,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import type { AchievementCatalog, AchievementType } from "@/types";
import { useDialogStore } from "@/services";
import DeleteItem from "@/components/common/delete-item";

const typeMeta: Record<
  AchievementType,
  {
    ring: string;
    ribbon: string;
    chip: string;
    gradient: string;
    icon: typeof Trophy;
  }
> = {
  GOLD: {
    ring: "border-amber-400",
    ribbon: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    gradient: "linear-gradient(135deg,#fde68a,#f59e0b)",
    icon: Trophy,
  },
  SILVER: {
    ring: "border-slate-400",
    ribbon: "bg-slate-400",
    chip: "bg-slate-50 text-slate-700 border-slate-200",
    gradient: "linear-gradient(135deg,#e2e8f0,#94a3b8)",
    icon: Medal,
  },
  BRONZE: {
    ring: "border-orange-400",
    ribbon: "bg-orange-500",
    chip: "bg-orange-50 text-orange-700 border-orange-200",
    gradient: "linear-gradient(135deg,#fdba74,#c2703d)",
    icon: Award,
  },
  HONORABLE: {
    ring: "border-blue-400",
    ribbon: "bg-blue-500",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
    gradient: "linear-gradient(135deg,#bfdbfe,#3b82f6)",
    icon: Star,
  },
  PARTICIPATION: {
    ring: "border-emerald-400",
    ribbon: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    gradient: "linear-gradient(135deg,#a7f3d0,#10b981)",
    icon: Heart,
  },
};

const ribbonClip = "polygon(0 0,100% 0,100% 72%,50% 100%,0 72%)";

export interface AchievementCardProps {
  catalog: AchievementCatalog;
  onEdit?: (catalog: AchievementCatalog) => void;
  onDelete?: (id: number, force?: boolean) => void;
}

export function AchievementCard({
  catalog,
  onEdit,
  onDelete,
}: AchievementCardProps) {
  const { t, i18n } = useTranslation();
  const dialog = useDialogStore();
  const isRTL = i18n.dir() === "rtl";
  const meta = typeMeta[catalog.type];
  const Icon = meta.icon;

  return (
    <Card className="group relative overflow-visible border-sidebar hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl bg-card">
      <div className={`absolute top-2 z-40 ${isRTL ? "left-2" : "right-2"}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-7 w-7 flex items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:border-foreground/30 transition-all duration-200">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isRTL ? "start" : "end"}
            className="w-[160px]"
          >
            <DropdownMenuLabel>
              {getTranslation(t, "common.labels.actions")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(catalog);
              }}
            >
              <Edit className="h-4 w-4" />
              {getTranslation(t, "common.actions.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                const id = dialog.open({
                  title: getTranslation(t, "achievements.actions.delete"),
                  children: (
                    <DeleteItem
                      itemName={catalog.name}
                      gender="male"
                      onDelete={() => {
                        onDelete?.(catalog.id);
                        dialog.close(id);
                      }}
                      onCancel={() => dialog.close(id)}
                    />
                  ),
                  closable: true,
                });
              }}
            >
              <Trash className="h-4 w-4" />
              {getTranslation(t, "common.actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="p-5 pt-9">
        <div className="flex flex-col items-center text-center gap-3">
          {/* medal */}
          <div className="relative pt-2">
            <div className="absolute -top-1 left-0 right-0 flex justify-center -z-0">
              <span
                className={`block w-3 h-8 -rotate-[14deg] translate-x-[3px] ${meta.ribbon}`}
                style={{ clipPath: ribbonClip }}
              />
              <span
                className={`block w-3 h-8 rotate-[14deg] -translate-x-[3px] ${meta.ribbon}`}
                style={{ clipPath: ribbonClip }}
              />
            </div>
            <div
              className={`relative z-10 w-16 h-16 rounded-full border-[3px] ${meta.ring} flex items-center justify-center shadow-sm ring-4 ring-background`}
              style={{ backgroundImage: meta.gradient }}
            >
              {catalog.image_url ? (
                <img
                  src={catalog.image_url}
                  alt={catalog.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Icon
                  className="w-7 h-7 text-white drop-shadow-sm"
                  strokeWidth={2.25}
                />
              )}
            </div>
          </div>

          <span
            className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${meta.chip}`}
          >
            {getTranslation(
              t,
              `achievements.types.${catalog.type.toLowerCase()}`,
            )}
          </span>

          <p className="text-sm font-bold text-foreground line-clamp-2 leading-snug min-h-[2.5rem]">
            {catalog.name}
          </p>

          <div className="w-full pt-2 border-t border-border/60 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{catalog.assigned_count}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
