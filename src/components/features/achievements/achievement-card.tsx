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

/**
 * §19.3 — a single flat hex cannot look metallic. Each metal is a multi-stop
 * ramp (highlight, saturated body, shadow, rim catch-light), because that value
 * swing is what the eye reads as metal.
 *
 * The critical test is gold versus bronze. Gold's body #D4A017 is yellow-warm;
 * bronze's body #9A5A28 is brown-red. Bronze was previously orange-400/500,
 * which is a UI colour, not a metal — that is the reported failure.
 */
const typeMeta: Record<
  AchievementType,
  {
    ring: string;
    ribbon: string;
    chip: string;
    gradient: string;
    glow: string;
    core: string;
    icon: typeof Trophy;
  }
> = {
  GOLD: {
    ring: "",
    ribbon: "bg-[linear-gradient(180deg,#F5DE93_0%,#D4A017_55%,#A9741B_100%)]",
    chip: "bg-[#D4A017]/12 text-[#8A6410] dark:text-[#E8C55A]",
    gradient:
      "linear-gradient(135deg,#FBEFB8 0%,#E8C55A 26%,#D4A017 52%,#A9741B 78%,#F5DE93 100%)",
    glow: "0 0 20px -4px rgba(212,160,23,.45)",
    core: "#D4A017",
    icon: Trophy,
  },
  SILVER: {
    ring: "",
    ribbon: "bg-[linear-gradient(180deg,#F0F5FA_0%,#A9B6C4_55%,#75828F_100%)]",
    chip: "bg-[#A9B6C4]/16 text-[#5B6875] dark:text-[#DCE4EC]",
    gradient:
      "linear-gradient(135deg,#FFFFFF 0%,#DCE4EC 26%,#A9B6C4 52%,#75828F 78%,#F0F5FA 100%)",
    glow: "0 0 20px -4px rgba(169,182,196,.45)",
    core: "#A9B6C4",
    icon: Medal,
  },
  BRONZE: {
    ring: "",
    ribbon: "bg-[linear-gradient(180deg,#D89A64_0%,#9A5A28_55%,#6B3A18_100%)]",
    chip: "bg-[#9A5A28]/12 text-[#7A4620] dark:text-[#D89A64]",
    gradient:
      "linear-gradient(135deg,#E6B189 0%,#C07E43 26%,#9A5A28 52%,#6B3A18 78%,#D89A64 100%)",
    glow: "0 0 20px -4px rgba(154,90,40,.45)",
    core: "#9A5A28",
    icon: Award,
  },
  HONORABLE: {
    ring: "",
    ribbon: "bg-[linear-gradient(180deg,#8FB4E0_0%,#2E7DD1_55%,#12294D_100%)]",
    chip: "bg-primary/12 text-primary",
    gradient:
      "linear-gradient(135deg,#DCE9F8 0%,#8FB4E0 26%,#2E7DD1 52%,#12294D 78%,#B9D3EF 100%)",
    glow: "0 0 20px -4px rgba(46,125,209,.45)",
    core: "#2E7DD1",
    icon: Star,
  },
  PARTICIPATION: {
    ring: "",
    ribbon: "bg-[linear-gradient(180deg,#8FD9B6_0%,#1FA463_55%,#0E5734_100%)]",
    chip: "bg-success/12 text-success",
    gradient:
      "linear-gradient(135deg,#D8F2E5 0%,#8FD9B6 26%,#1FA463 52%,#0E5734 78%,#B4E7CF 100%)",
    glow: "0 0 20px -4px rgba(31,164,99,.45)",
    core: "#1FA463",
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
      <Card className="jd-card jd-interactive jd-tint-orange group relative h-full overflow-hidden">
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
                className="h-8 w-8 flex items-center justify-center rounded-full /70 bg-background/90 backdrop-blur-sm text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:border-foreground/25 hover:bg-background transition-all duration-200 shadow-sm"
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
                  className={`block w-4 h-12 -rotate-[16deg] translate-x-[5px] shadow-[var(--shadow-card)] ${meta.ribbon}`}
                  style={{ clipPath: ribbonClip }}
                  initial={{ y: -6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12, type: "spring", stiffness: 300 }}
                />
                <motion.span
                  className={`block w-4 h-12 rotate-[16deg] -translate-x-[5px] shadow-[var(--shadow-card)] ${meta.ribbon}`}
                  style={{ clipPath: ribbonClip }}
                  initial={{ y: -6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18, type: "spring", stiffness: 300 }}
                />
              </div>

              {/* medal — bumped from 4.75rem to 6rem */}
              <motion.div
                className={`allow-border relative z-10 flex size-[104px] cursor-default items-center justify-center overflow-hidden rounded-full border-[6px] ${meta.ring}`}
                style={{
                  backgroundImage: meta.gradient,
                  borderColor: meta.core,
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
              className={`inline-flex h-[26px] items-center rounded-full px-3 text-[length:var(--text-small)] font-bold ${meta.chip}`}
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
