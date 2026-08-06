import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Rendered as a count chip inside the pill. */
  count?: number;
  icon?: React.ReactNode;
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Blue for neutral dimensions, orange for the primary filter dimension. */
  tone?: "blue" | "orange";
  /** Shows a check glyph on the selected pill (multi-select filter rows). */
  showCheck?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Segmented control (§10.2).
 *
 * The trick that makes the mobile version work is that *unselected* pills are
 * genuinely elevated white objects floating on the card, not flat grey
 * rectangles — a flat unselected pill is exactly the "bland" being complained
 * about. Selected pills get a gradient fill, a coloured lift and a top inner
 * highlight. No borders, no squares, ever.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  tone = "blue",
  showCheck = false,
  className,
  ariaLabel,
}: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex h-[38px] cursor-pointer items-center gap-2 rounded-full px-[18px] text-[length:var(--text-small)] font-bold whitespace-nowrap outline-none",
              "transition-[transform,box-shadow,background-color,background-image,color] duration-200 ease-out",
              "focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? cn(
                    "-translate-y-px",
                    tone === "orange"
                      ? "bg-[var(--accent-btn)] text-[var(--accent-btn-fg)] shadow-[0_6px_16px_-5px_rgba(245,154,74,.5)]"
                      : "jd-grad-blue text-white shadow-[0_6px_16px_-5px_rgba(3,82,161,.50),inset_0_1px_0_rgba(255,255,255,.20)]",
                  )
                : cn(
                    "bg-white text-muted-foreground shadow-[0_3px_10px_-3px_rgba(26,56,104,.16)]",
                    "dark:bg-white/[0.05] dark:shadow-[0_3px_10px_-3px_rgba(0,0,0,.45)]",
                    "hover:-translate-y-px hover:text-foreground hover:shadow-[0_6px_14px_-4px_rgba(26,56,104,.22)]",
                  ),
            )}
          >
            {showCheck && selected && <Check className="size-3.5 shrink-0" />}
            {opt.icon}
            <span>{opt.label}</span>
            {typeof opt.count === "number" && (
              <span
                className={cn(
                  "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[length:var(--text-small)] font-bold tabular-nums",
                  selected
                    ? "bg-white/[0.22] text-white"
                    : "bg-primary/10 text-primary dark:bg-white/10",
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
