import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, isRTL } from "@/lib/utils";
import { entityIcons, type EntityKey } from "@/lib/entity-icons";

interface OrangeBandProps {
  title: string;
  /** One supporting line. Metadata chips belong BELOW the band, not on it. */
  description?: string;
  entity?: EntityKey;
  icon?: ReactNode;
  onBack?: () => void;
  /** Rendered at the trailing edge — actions only, never status chips. */
  actions?: ReactNode;
  /**
   * Metadata rendered UNDER the title, on the band. Must be built from
   * `<BandChip>` so everything on the orange stays in the navy/white family —
   * a red "live" or green "active" pill on this surface was rejected twice.
   */
  chips?: ReactNode;
  /** Set when the band is the top of a panel rather than a floating header. */
  attached?: boolean;
  className?: string;
}

/**
 * The shared orange band (§13), used by the debate form, the survey form and
 * the complaint form.
 *
 * One definition for both themes — the light-theme version was the correct one,
 * so dark mode uses the same band rather than a darkened variant.
 *
 * Hard rules, all of which were specific complaints:
 *   - Text on this band is NAVY. Never orange, never green, never a coloured
 *     status word. Orange-on-orange and green-on-orange were both rejected.
 *   - No chips, badges or status pills sit on the band. They render below it on
 *     the page surface. The only exception is a translucent white chip whose
 *     content is genuinely part of the title.
 */
export function OrangeBand({
  title,
  description,
  entity,
  icon,
  onBack,
  actions,
  chips,
  attached = false,
  className,
}: OrangeBandProps) {
  const Back = isRTL() ? ChevronRight : ChevronLeft;
  const EntityIcon = entity ? entityIcons[entity].outline : null;

  return (
    <header
      className={cn(
        "jd-band-orange animate-fade-up relative flex min-h-[132px] items-center gap-4 overflow-hidden px-6 py-6 sm:px-8",
        attached ? "rounded-t-[32px]" : "rounded-[32px]",
        className,
      )}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="relative z-10 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/[0.35] text-[#1a3868] transition-colors duration-150 ease-in-out hover:bg-white/[0.5]"
        >
          <Back className="size-5" />
        </button>
      )}

      {(EntityIcon || icon) && (
        <span className="animate-scale-in relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-white/[0.35] text-[#1a3868] [&_svg]:size-6">
          {EntityIcon ? <EntityIcon /> : icon}
        </span>
      )}

      <div className="relative z-10 min-w-0 flex-1">
        <h1 className="line-clamp-2 text-[length:var(--text-display)] font-extrabold text-[#1a3868]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 line-clamp-2 text-[length:var(--text-body)] font-semibold text-[#1a3868]/[0.78]">
            {description}
          </p>
        )}
        {chips && (
          <div className="mt-3 flex flex-wrap items-center gap-2">{chips}</div>
        )}
      </div>

      {actions && (
        <div className="relative z-10 flex shrink-0 items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}

/**
 * The only chip permitted on the orange band.
 *
 * Everything that lands here — status, counts, host, dates — is a translucent
 * white tile with navy type. Status still reads, because the *word* is the
 * signal; what it may not do is bring its own hue. Semantic red/green/orange
 * pills over this surface were the specific complaint on the debate and survey
 * headers: they vibrate against the orange and read as an error state.
 *
 * `strong` is for the one chip that is the item's actual state, so it still
 * wins the row without changing family.
 */
export function BandChip({
  children,
  strong = false,
  className,
}: {
  children: ReactNode;
  strong?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[length:var(--text-small)] font-bold whitespace-nowrap text-[#1a3868] [&_svg]:size-3.5",
        strong ? "bg-white/[0.62]" : "bg-white/[0.32]",
        className,
      )}
    >
      {children}
    </span>
  );
}
