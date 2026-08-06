import { Button } from "../ui/button";
import ViewToggle from "./view-toggle";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { entityIcons, type EntityKey } from "@/lib/entity-icons";

interface ActionButton {
  label: string;
  onClick?: () => void;
  variant?:
    | "default"
    | "primary"
    | "accent"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

interface AppHeaderProps {
  title: string;
  description?: string;
  /** Pulls the icon from entityIcons so it can never drift from the sidebar. */
  entity?: EntityKey;
  icon?: ReactNode;
  /** Inline stat strip, e.g. 128 users . 12 active today. */
  meta?: { label: string; value: ReactNode }[];
  view?: "cards" | "table";
  setView?: (view: "cards" | "table") => void;
  actions?: ActionButton[];
  buttonLabel?: string;
  onCreate?: () => void;
  showCreateButton?: boolean;
  className?: string;
}

/**
 * Screen header band (section 11.3).
 *
 * A --grad-header band (section 5): one gradient, identical in both themes,
 * because the light-theme two-shade blue was invisible while the dark one
 * worked. The brand sweep stays on the Home hero and the Login CTA only.
 * Orange arrives here through the flat .btn-accent CTA.
 */
export default function AppHeader({
  title,
  description,
  entity,
  icon,
  meta,
  view,
  setView,
  actions = [],
  buttonLabel,
  onCreate,
  showCreateButton = true,
  className,
}: AppHeaderProps) {
  const allActions = [...actions];

  if (showCreateButton && buttonLabel && onCreate) {
    allActions.push({
      label: buttonLabel,
      onClick: onCreate,
      variant: "accent",
    });
  }

  const EntityIcon = entity ? entityIcons[entity].outline : null;

  return (
    <header
      className={cn(
        "jd-grad-header jd-hero-light animate-fade-up relative mb-7 overflow-hidden rounded-[32px] px-6 py-6 text-white sm:px-8 sm:py-7",
        className,
      )}
    >
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {(EntityIcon || icon) && (
            <span className="animate-scale-in flex size-14 shrink-0 items-center justify-center rounded-full bg-white/[0.18] text-white [&_svg]:size-6">
              {EntityIcon ? <EntityIcon /> : icon}
            </span>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="truncate text-[length:var(--text-display)] font-extrabold text-white">
                {title}
              </h1>
              {view && setView && (
                <ViewToggle theView={view} setView={setView} onHeader />
              )}
            </div>
            {description && (
              <p className="mt-1 text-[length:var(--text-body)] font-semibold text-white/[0.82]">
                {description}
              </p>
            )}
            {meta && meta.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[length:var(--text-caption)] font-semibold text-white/[0.75]">
                {meta.map((m, i) => (
                  <span key={m.label} className="flex items-center gap-2">
                    {i > 0 && (
                      <span aria-hidden className="text-white/40">
                        &middot;
                      </span>
                    )}
                    <span>
                      <span className="font-extrabold text-white tabular-nums">
                        {m.value}
                      </span>{" "}
                      {m.label}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {allActions.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            {allActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || "accent"}
                disabled={action.disabled}
                className={cn(
                  (action.variant === "outline" ||
                    action.variant === "ghost" ||
                    action.variant === "secondary") &&
                    "bg-white/[0.16] text-white hover:bg-white/[0.26] dark:bg-white/[0.16] dark:hover:bg-white/[0.26]",
                  // On the blue header band the orange button's label is white,
                  // matching the title and eyebrow above it. Elsewhere the
                  // accent button keeps its navy label.
                  (action.variant ?? "accent") === "accent" && "text-white",
                  action.className,
                )}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
