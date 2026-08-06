// components/motion/debate-motion-card.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Edit, Layers, Quote, Trash2 } from "lucide-react";
import type { Motion } from "@/types";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

interface DebateMotionCardProps {
  motion: Motion;
  onEdit?: (motion: Motion) => void;
  onDelete?: (id: number) => void;
  onView?: (motion: Motion) => void;
}

/**
 * Motion card, built on the debate-format card: one white surface, a banner
 * across the top, header, a two-up stat block, then the action row.
 *
 * The banner takes the first framework's colour when the motion has one, so a
 * grid of motions groups visually by framework without needing a legend. With
 * no framework it falls back to the same navy→blue sweep the format card uses.
 */
export default function DebateMotionCard({
  motion,
  onEdit,
  onDelete,
}: DebateMotionCardProps) {
  const { t } = useTranslation();
  const frameworks = motion.frameworks ?? [];
  const bannerColor = frameworks[0]?.color_hex || null;

  const added = motion.created_at
    ? new Date(motion.created_at).toLocaleDateString()
    : "—";

  return (
    <Card className="jd-card jd-interactive group relative flex h-full w-full flex-col overflow-hidden bg-[var(--table-row)]">
      {/* Top banner */}
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={
          bannerColor
            ? {
                backgroundImage: `linear-gradient(90deg, ${bannerColor} 0%, color-mix(in oklab, ${bannerColor} 45%, transparent) 100%)`,
              }
            : { backgroundImage: "var(--banner-format)" }
        }
      />

      <CardHeader className="relative px-6 pt-6 pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="bidi-plaintext line-clamp-3 text-lg leading-snug font-bold tracking-tight text-card-foreground">
            {motion.text}
          </CardTitle>

          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={
              bannerColor
                ? {
                    background: `color-mix(in oklab, ${bannerColor} 16%, transparent)`,
                    color: bannerColor,
                  }
                : undefined
            }
          >
            <Quote className="size-5" />
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-5 px-6 pt-0 pb-6">
        {/* Two-up metrics, identical shape to the format card. */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {getTranslation(t, "debateMotions.card.frameworks")}
              </span>
            </div>
            <p className="text-2xl font-bold text-card-foreground tabular-nums">
              {frameworks.length}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />
              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {getTranslation(t, "debateMotions.card.added")}
              </span>
            </div>
            <p className="text-sm font-bold text-card-foreground tabular-nums">
              {added}
            </p>
          </div>
        </div>

        {frameworks.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {getTranslation(t, "debateMotions.card.frameworks")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {frameworks.slice(0, 3).map((framework) => (
                <span
                  key={framework.id}
                  className="inline-flex h-7 items-center gap-2 rounded-full px-3 text-xs font-bold"
                  style={{
                    // A tint plus a dot. The old chip drew a coloured outline,
                    // which the no-border rule made invisible anyway.
                    background: `color-mix(in oklab, ${framework.color_hex || "#EA7C1C"} 14%, transparent)`,
                    color: `color-mix(in oklab, ${framework.color_hex || "#EA7C1C"} 74%, var(--foreground))`,
                  }}
                >
                  <span
                    aria-hidden
                    className="size-2 rounded-full"
                    style={{ background: framework.color_hex || "#EA7C1C" }}
                  />
                  {framework.name}
                </span>
              ))}
              {frameworks.length > 3 && (
                <span className="inline-flex h-7 items-center rounded-full bg-muted px-3 text-xs font-bold text-muted-foreground">
                  +{frameworks.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action row. Motions have no detail screen, so Edit is the primary. */}
        <div className="mt-auto flex gap-2 pt-1">
          <Button
            variant="accent"
            className="flex-1"
            onClick={() => onEdit?.(motion)}
            title={getTranslation(t, "common.actions.edit")}
          >
            <Edit className="size-4" />
            {getTranslation(t, "common.actions.edit")}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete?.(motion.id)}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            title={getTranslation(t, "common.delete.title")}
            aria-label={getTranslation(t, "common.delete.title")}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
