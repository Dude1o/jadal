"use client";

import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

import type { MotionFramework } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

type Props = {
  framework: MotionFramework;
  onEdit: (framework: MotionFramework) => void;
  onDelete: (id: number) => void;
};

export default function DebateMotionFrameworkCard({
  framework,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const accentColor = framework.color_hex || "#6366f1";

  return (
    <Card
      className="group relative overflow-hidden border border-border shadow-sm bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
      style={{
        background: `linear-gradient(135deg, ${accentColor}08 0%, ${accentColor}03 40%, transparent 100%)`,
      }}
    >
      {/* Coloured top accent */}
      <div
        className="absolute inset-x-0 top-0 h-1.5 opacity-80"
        style={{ backgroundColor: accentColor }}
      />

      <CardHeader className="relative pb-3 pt-6 px-6">
        <div className="flex items-start gap-4">
          {/* Colour swatch */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl shadow-inner ring-1 ring-black/5 dark:ring-white/10"
            style={{ backgroundColor: accentColor }}
          />
          <div className="min-w-0 space-y-1">
            <h3 className="font-bold text-lg text-card-foreground leading-tight line-clamp-2">
              {framework.name}
            </h3>
            {framework.color_hex && (
              <p className="font-mono text-xs text-muted-foreground">
                {framework.color_hex}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-2 text-sm text-muted-foreground">
        {framework.created_at
          ? format(new Date(framework.created_at), "dd MMM yyyy")
          : getTranslation(t, "common.labels.unknown")}
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-border hover:bg-muted font-medium"
          onClick={() => onEdit(framework)}
        >
          <Edit className="w-4 h-4 mr-2" />
          {getTranslation(t, "common.actions.edit")}
        </Button>

        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => onDelete(framework.id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {getTranslation(t, "common.actions.delete")}
        </Button>
      </CardFooter>
    </Card>
  );
}
