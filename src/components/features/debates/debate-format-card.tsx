// components/debate-format/debate-format-card.tsx
"use client";

import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Edit, Trash2, Users, Layers } from "lucide-react";
import { getTranslation } from "@/lib/utils";
import type { DebateFormat, Phase } from "@/types";
import { useDialogStore } from "@/services";
import DebateFormatDetails from "./debate-format-details";

interface DebateFormatCardProps {
  format: DebateFormat;
  onEdit?: (format: DebateFormat) => void;
  onDelete?: (id: number) => void;
  onView?: (format: DebateFormat) => void;
}

export default function DebateFormatCard({
  format,
  onEdit,
  onDelete,
  onView,
}: DebateFormatCardProps) {
  const { t } = useTranslation();
  const phases = Array.isArray(format.phase_config) ? format.phase_config : [];

  const uniqueSides = new Set(phases.map((p) => p.side).filter(Boolean)).size;

  const dialog = useDialogStore();

  const openViewDialog = () => {
    const id = dialog.open({
      title: getTranslation(t, "debateFormats.single"),
      children: <DebateFormatDetails debate_format_id={format.id} />,
      closable: true,
    });
  };

  return (
    <Card className="group relative w-full max-w-sm flex flex-col overflow-hidden border border-border shadow-md bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20">
      {/* Top accent gradient */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-chart-5 to-primary opacity-80" />

      <CardHeader className="relative pb-3 pt-6 px-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-bold tracking-tight text-card-foreground">
              {format.name}
            </CardTitle>
            {format.description && (
              <CardDescription className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                {format.description}
              </CardDescription>
            )}
          </div>
          {/* Optional: a subtle icon or badge for type */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-chart-5/15 flex items-center justify-center">
            <Layers className="w-5 h-5 text-chart-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col px-6 pb-6 pt-0 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 border border-border p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {getTranslation(t, "debateFormats.fields.phases")}
              </span>
            </div>
            <p className="text-2xl font-bold text-card-foreground tabular-nums">
              {phases.length}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 border border-border p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {getTranslation(t, "debateFormats.fields.sides")}
              </span>
            </div>
            <p className="text-2xl font-bold text-card-foreground tabular-nums">
              {uniqueSides}
            </p>
          </div>
        </div>

        {/* Quick phase preview (if any) */}
        {phases.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {getTranslation(t, "debateFormats.fields.phases")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {phases.slice(0, 3).map((phase, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="capitalize text-xs px-2.5 py-0.5 bg-card border border-border font-medium"
                  style={{
                    borderLeftWidth: "3px",
                    borderLeftColor:
                      phase.side === "proposition" ? "var(--primary)" : "var(--accent)",
                  }}
                >
                  {phase.name ?? phase.side}
                </Badge>
              ))}
              {phases.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 font-medium"
                >
                  +{phases.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <Separator className="bg-border" />

        {/* Action buttons */}
        <div className="mt-auto flex gap-2 pt-1">
          <Button
            onClick={() => onView?.(format) || openViewDialog()}
            className="flex-1 font-medium shadow-sm"
            title={getTranslation(t, "debateFormats.single")}
          >
            {getTranslation(t, "common.actions.view")}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit?.(format)}
            className="hover:bg-primary/10 hover:text-primary transition-colors"
            title={getTranslation(t, "common.actions.edit")}
            aria-label={getTranslation(t, "common.actions.edit")}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete?.(format.id)}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            title={getTranslation(t, "common.delete.title")}
            aria-label={getTranslation(t, "common.delete.title")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
