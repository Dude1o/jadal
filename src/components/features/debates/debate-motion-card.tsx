// components/motion/debate-motion-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, Trash2, Quote } from "lucide-react";
import type { Motion } from "@/types";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

interface DebateMotionCardProps {
  motion: Motion;
  onEdit?: (motion: Motion) => void;
  onDelete?: (id: number) => void;
  onView?: (motion: Motion) => void;
}

export default function DebateMotionCard({
  motion,
  onEdit,
  onDelete,
  onView,
}: DebateMotionCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="group relative flex w-full flex-col overflow-hidden border border-border/60 bg-gradient-to-br from-primary/5 via-transparent to-transparent transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] dark:hover:shadow-[0_8px_30px_rgba(124,58,237,0.25)]">
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-2 text-lg font-semibold tracking-tight leading-tight">
              {motion.text}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 flex flex-1 flex-col space-y-5">
        {/* Frameworks */}
        {motion.frameworks && motion.frameworks.length > 0 && (
          <>
            <div>
              <p className="mb-2 text-sm font-medium flex items-center gap-2">
                <Quote className="h-4 w-4 text-primary" />
                {/* Using common or specific label if needed */}
                {getTranslation(t, "debateMotions.card.frameworks")}
              </p>
              <div className="flex flex-wrap gap-2">
                {motion.frameworks.map((framework) => (
                  <Badge
                    key={framework.id}
                    variant="outline"
                    className="font-medium"
                    style={{
                      borderColor: framework.color_hex || undefined,
                      color: framework.color_hex || undefined,
                    }}
                  >
                    {framework.name}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-border/50" />
          </>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            {getTranslation(t, "debateMotions.card.added")}{" "}
            {new Date(motion.created_at || "").toLocaleDateString()}
          </div>
          {motion.updated_at && (
            <div>
              {getTranslation(t, "debateMotions.card.updated")}{" "}
              {new Date(motion.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 mt-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit?.(motion)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => onDelete?.(motion.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
