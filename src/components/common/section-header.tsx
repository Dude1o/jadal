import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn, isRTL } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  /** Section accent, which tints the icon badge. */
  tone?: "blue" | "orange" | "deep" | "green" | "red";
  action?: {
    label: string;
    to?: string;
    search?: Record<string, unknown>;
    onClick?: () => void;
  };
  className?: string;
}

const toneClass: Record<string, string> = {
  blue: "bg-primary/12 text-primary",
  orange: "bg-accent/[0.16] text-[var(--chip-orange-fg)]",
  deep: "bg-brand-deep/12 text-brand-deep dark:bg-white/10 dark:text-foreground",
  green: "bg-success/12 text-success",
  red: "bg-destructive/12 text-destructive",
};

/**
 * [32x32 tinted icon badge] [title] ----- [orange action link >]
 *
 * Replaces every bare "text + link" heading row, and every place a divider is
 * currently doing the job of a heading (section 12.5). The action link is
 * orange, which is one of the five orange touchpoints every screen must
 * carry (section 4.6).
 */
export function SectionHeader({
  title,
  subtitle,
  icon,
  tone = "blue",
  action,
  className,
}: SectionHeaderProps) {
  const Chevron = isRTL() ? ChevronLeft : ChevronRight;

  const actionInner = (
    <>
      {action?.label}
      <Chevron className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
    </>
  );

  const actionClass =
    "group inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-[length:var(--text-caption)] font-bold text-accent outline-none transition-colors duration-150 ease-in-out hover:bg-accent/[0.10] focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-[12px] [&_svg]:size-[18px]",
              toneClass[tone],
            )}
          >
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-[length:var(--text-subtitle)] font-extrabold text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="truncate text-[length:var(--text-caption)] font-semibold text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action &&
        (action.to ? (
          <Link
            to={action.to}
            search={action.search as never}
            className={actionClass}
          >
            {actionInner}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className={actionClass}
          >
            {actionInner}
          </button>
        ))}
    </div>
  );
}
