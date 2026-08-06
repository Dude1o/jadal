import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, isRTL } from "@/lib/utils";

interface HeroBannerProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * The dashboard hero (section 11.2).
 *
 * A single continuous --grad-brand sweep: blue entering at the inline-start,
 * orange exiting at the inline-end, bridged through warmOrange so it never
 * goes muddy. This is NOT a 75/25 split of two flat blocks - there is no
 * boundary anywhere in it.
 *
 * A radial highlight at 18%/-20% gives it dimension, which is the difference
 * between "a gradient" and "a designed surface".
 *
 * Only one --grad-brand surface may be visible per screen, so screen headers
 * use --grad-blue instead (see AppHeader).
 */
export function HeroBanner({
  eyebrow,
  title,
  description,
  icon,
  onClick,
  className,
}: HeroBannerProps) {
  const Chevron = isRTL() ? ChevronLeft : ChevronRight;

  return (
    <section
      onClick={onClick}
      className={cn(
        "jd-grad-brand jd-hero-light animate-fade-up relative flex min-h-[168px] items-center gap-5 overflow-hidden rounded-[32px] px-6 py-7 text-white sm:min-h-[184px] sm:px-9",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {icon && (
        <span className="animate-scale-in relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full bg-white/[0.18] [&_svg]:size-7">
          {icon}
        </span>
      )}

      <div className="relative z-10 min-w-0 flex-1">
        {eyebrow && (
          <span className="mb-2.5 inline-flex h-7 items-center rounded-full bg-white/20 px-3 text-[length:var(--text-small)] font-bold text-white">
            {eyebrow}
          </span>
        )}
        <h1 className="truncate text-[length:var(--text-display)] font-extrabold text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 line-clamp-2 text-[length:var(--text-body)] font-semibold text-white/[0.82]">
            {description}
          </p>
        )}
      </div>

      {onClick && (
        <Chevron className="relative z-10 size-6 shrink-0 text-white/70" />
      )}
    </section>
  );
}
