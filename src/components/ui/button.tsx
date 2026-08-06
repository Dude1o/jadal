import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Every button carries all five of §16.1's requirements, because a flat fill
 * with one text colour is a placeholder, not a design:
 *   1. a radius from the scale (18px, or a pill for filter/tab controls)
 *   2. a depth cue — gradient fill, inner top highlight, or coloured shadow
 *   3. weight 700 minimum, and a leading icon on anything but a text link
 *   4. distinct hover AND press states — hover lifts, press compresses
 *   5. a colour that means something
 *
 * No variant has a border: outline buttons are banned by the no-border rule,
 * and `secondary` is the tinted-fill replacement for them.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[18px] text-[length:var(--text-button)] font-bold whitespace-nowrap transition-[transform,box-shadow,background-color,background-image,filter,opacity] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-[0.38] disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px] active:scale-[0.97]",
  {
    variants: {
      variant: {
        /** The brand sweep. Max one per surface. */
        default:
          "jd-grad-brand text-white shadow-[0_6px_18px_-6px_rgba(3,82,161,.45),inset_0_1px_0_rgba(255,255,255,.22)] hover:-translate-y-0.5 hover:brightness-[1.04] hover:shadow-[0_10px_24px_-8px_rgba(3,82,161,.55),inset_0_1px_0_rgba(255,255,255,.22)]",
        /** Screen-header and card primaries that shouldn't burn the sweep. */
        primary:
          "jd-grad-blue text-white shadow-[0_6px_18px_-6px_rgba(3,82,161,.45),inset_0_1px_0_rgba(255,255,255,.20)] hover:-translate-y-0.5 hover:brightness-[1.06] hover:shadow-[0_10px_24px_-8px_rgba(3,82,161,.55),inset_0_1px_0_rgba(255,255,255,.20)]",
        /**
         * The ONE orange button in the app (§6). Flat #F59A4A with navy text —
         * navy is 5.29:1 on this orange and white is 2.19:1, which is why white
         * is never used here. No gradient, in either theme, ever again.
         */
        accent:
          "bg-[var(--accent-btn)] text-[var(--accent-btn-fg)] shadow-[0_2px_4px_-2px_rgba(234,124,28,.28),0_8px_18px_-6px_rgba(234,124,28,.40)] hover:-translate-y-0.5 hover:bg-[var(--accent-btn-hover)] hover:shadow-[0_4px_8px_-3px_rgba(234,124,28,.32),0_12px_24px_-8px_rgba(234,124,28,.48)]",
        /** Tinted fill — replaces the banned outline button. */
        secondary:
          "bg-primary/[0.09] text-primary hover:bg-primary/[0.15] hover:-translate-y-px hover:shadow-[0_4px_12px_-4px_rgba(26,56,104,.20)] dark:bg-white/[0.08] dark:hover:bg-white/[0.14]",
        outline:
          "bg-primary/[0.09] text-primary hover:bg-primary/[0.15] hover:-translate-y-px hover:shadow-[0_4px_12px_-4px_rgba(26,56,104,.20)] dark:bg-white/[0.08] dark:hover:bg-white/[0.14]",
        /** Low-stakes only: Cancel, Reset, Clear filters. */
        ghost:
          "text-muted-foreground hover:bg-primary/[0.07] hover:text-foreground dark:hover:bg-white/[0.07]",
        destructive:
          "bg-destructive/[0.10] text-destructive hover:bg-destructive/[0.18] hover:-translate-y-px",
        /** Solid destructive — confirm buttons inside destructive dialogs. */
        "destructive-solid":
          "bg-destructive text-destructive-foreground shadow-[0_6px_16px_-6px_rgba(216,72,87,.5),inset_0_1px_0_rgba(255,255,255,.2)] hover:-translate-y-0.5 hover:brightness-[1.05]",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        xs: "h-8 gap-1.5 rounded-full px-3 text-[length:var(--text-small)] [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-1.5 rounded-[14px] px-4 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12 px-7",
        cta: "h-14 w-full px-7",
        icon: "size-11 rounded-[14px]",
        "icon-xs":
          "size-8 rounded-[10px] [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9 rounded-[12px] [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-12 rounded-[16px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
