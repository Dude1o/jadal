import { motion } from "framer-motion";
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
  Sparkle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import type { AchievementCatalog, AchievementType } from "@/types";
import { useDialogStore } from "@/services";
import DeleteItem from "@/components/common/delete-item";

import achievementImage from "@/assets/achievement_placeholder.png";

const typeMeta: Record<
  AchievementType,
  {
    ring: string;
    ribbon: string;
    chip: string;
    gradient: string;
    glow: string;
    icon: typeof Trophy;
  }
> = {
  GOLD: {
    ring: "border-amber-400/90",
    ribbon: "bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700",
    chip: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    gradient: "linear-gradient(145deg,#fef3c7 0%,#fbbf24 50%,#b45309 100%)",
    glow: "0 0 32px -6px rgba(245,158,11,0.55)",
    icon: Trophy,
  },
  SILVER: {
    ring: "border-slate-300/90",
    ribbon: "bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600",
    chip: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-400/30",
    gradient: "linear-gradient(145deg,#f8fafc 0%,#cbd5e1 50%,#475569 100%)",
    glow: "0 0 32px -6px rgba(148,163,184,0.5)",
    icon: Medal,
  },
  BRONZE: {
    ring: "border-orange-400/90",
    ribbon: "bg-gradient-to-b from-orange-300 via-orange-500 to-orange-800",
    chip: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30",
    gradient: "linear-gradient(145deg,#ffedd5 0%,#fb923c 50%,#9a3412 100%)",
    glow: "0 0 32px -6px rgba(234,88,12,0.5)",
    icon: Award,
  },
  HONORABLE: {
    ring: "border-blue-400/90",
    ribbon: "bg-gradient-to-b from-blue-300 via-blue-500 to-blue-700",
    chip: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    gradient: "linear-gradient(145deg,#dbeafe 0%,#60a5fa 50%,#1d4ed8 100%)",
    glow: "0 0 32px -6px rgba(59,130,246,0.5)",
    icon: Star,
  },
  PARTICIPATION: {
    ring: "border-emerald-400/90",
    ribbon: "bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-700",
    chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    gradient: "linear-gradient(145deg,#d1fae5 0%,#34d399 50%,#047857 100%)",
    glow: "0 0 32px -6px rgba(16,185,129,0.5)",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden border border-border/50 bg-card rounded-2xl shadow-sm hover:shadow-xl hover:border-border transition-shadow duration-300">
        {/* ambient type glow — now always breathing, not hover-gated */}
        <motion.div
          className="pointer-events-none absolute -top-10 left-1/2 h-28 w-40 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: meta.gradient }}
          animate={{ opacity: [0.22, 0.42, 0.22] }}
          transition={{
            duration: 3.2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* top wash */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-[0.1]"
          style={{ background: meta.gradient }}
        />

        {/* floating sparkle accent — creative touch */}
        <motion.div
          className="pointer-events-none absolute top-4 left-6 text-foreground/20"
          animate={{ opacity: [0, 1, 0], y: [4, -4, 4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkle className="h-3 w-3" />
        </motion.div>

        {/* actions */}
        <div className={`absolute top-3 z-40 ${isRTL ? "left-3" : "right-3"}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="h-8 w-8 flex items-center justify-center rounded-full border border-border/70 bg-background/90 backdrop-blur-sm text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:border-foreground/25 hover:bg-background transition-all duration-200 shadow-sm"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </motion.button>
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

        <CardContent className="relative p-5 pt-9">
          <div className="flex flex-col items-center text-center gap-3">
            {/* medal + ribbons — enlarged, card overall trimmed down */}
            <div className="relative">
              {/* ribbons */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex justify-center z-0">
                <motion.span
                  className={`block w-4 h-12 -rotate-[16deg] translate-x-[5px] shadow-md ${meta.ribbon}`}
                  style={{ clipPath: ribbonClip }}
                  initial={{ y: -6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12, type: "spring", stiffness: 300 }}
                />
                <motion.span
                  className={`block w-4 h-12 rotate-[16deg] -translate-x-[5px] shadow-md ${meta.ribbon}`}
                  style={{ clipPath: ribbonClip }}
                  initial={{ y: -6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18, type: "spring", stiffness: 300 }}
                />
              </div>

              {/* medal — bumped from 4.75rem to 6rem */}
              <motion.div
                className={`relative z-10 w-24 h-24 rounded-full border-[3px] ${meta.ring} flex items-center justify-center ring-[5px] ring-background overflow-hidden cursor-default`}
                style={{
                  backgroundImage: meta.gradient,
                  boxShadow: meta.glow,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -6, 6, -3, 0],
                  transition: { duration: 0.55, ease: "easeInOut" },
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* specular shine */}
                <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/45 via-white/5 to-black/15" />

                {/* moving highlight — now runs continuously instead of on hover */}
                <motion.div
                  className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-40%", "60%"] }}
                  transition={{
                    duration: 1.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                    repeatDelay: 1,
                  }}
                />

                {catalog.image_url ? (
                  <img
                    src={catalog.image_url}
                    alt={catalog.name}
                    className="relative z-10 w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={achievementImage}
                    alt={catalog.name}
                    className="relative z-10 w-full h-full rounded-full object-cover"
                  />
                )}
              </motion.div>
            </div>

            {/* type chip */}
            <motion.span
              className={`text-[10px] font-bold uppercase tracking-[0.09em] px-2.5 py-1 rounded-full border ${meta.chip}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
            >
              {getTranslation(
                t,
                `achievements.types.${catalog.type.toLowerCase()}`,
              )}
            </motion.span>

            {/* name */}
            <motion.p
              className="text-sm font-semibold text-foreground line-clamp-2 leading-snug min-h-[2.4rem] tracking-tight"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              {catalog.name}
            </motion.p>

            {/* assigned count */}
            <motion.div
              className="w-full mt-0.5 pt-2.5 border-t border-border/40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.34 }}
            >
              <motion.div
                className="flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs text-muted-foreground"
                whileHover={{
                  scale: 1.04,
                  backgroundColor: "hsl(var(--muted))",
                }}
              >
                <Users className="h-3.5 w-3.5 opacity-70" />
                <span className="font-semibold tabular-nums text-foreground/80">
                  {catalog.assigned_count}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
