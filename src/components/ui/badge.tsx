import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Chips and badges: fully rounded, tinted fill plus matching text colour.
 * No border, no emoji (§16.2). Dark fills reuse the app's own snackbar
 * backgrounds so warm chips stay warm on navy instead of going grey.
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full font-semibold whitespace-nowrap transition-[background-color,color] duration-150 ease-in-out focus-visible:ring-2 focus-visible:ring-ring [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-[var(--chip-blue-bg)] text-[var(--chip-blue-fg)]",
        tint: "bg-[var(--chip-blue-bg)] text-[var(--chip-blue-fg)]",
        "tint-accent":
          "bg-[var(--chip-orange-bg)] text-[var(--chip-orange-fg)]",
        "tint-success": "bg-[var(--chip-green-bg)] text-[var(--chip-green-fg)]",
        "tint-destructive": "bg-[var(--chip-red-bg)] text-[var(--chip-red-fg)]",
        "tint-warning":
          "bg-[var(--chip-orange-bg)] text-[var(--chip-orange-fg)]",
        "tint-neutral":
          "bg-[var(--chip-neutral-bg)] text-[var(--chip-neutral-fg)]",
        secondary: "bg-[var(--chip-neutral-bg)] text-[var(--chip-neutral-fg)]",
        outline: "bg-[var(--chip-neutral-bg)] text-[var(--chip-neutral-fg)]",
        ghost: "bg-transparent text-muted-foreground",
        destructive: "bg-[var(--chip-red-bg)] text-[var(--chip-red-fg)]",
        /** Saturated — for the one state that must be unmissable. */
        solid: "bg-primary text-primary-foreground",
        "solid-accent":
          "bg-[var(--accent-btn)] text-[var(--accent-btn-fg)] shadow-[0_4px_14px_-4px_rgba(245,154,74,.5)]",
        "solid-destructive":
          "bg-destructive text-destructive-foreground shadow-[0_4px_14px_-4px_rgba(216,72,87,.5)]",
        "solid-success":
          "bg-success text-success-foreground shadow-[0_4px_14px_-4px_rgba(31,164,99,.5)]",
        /** On a saturated banner. */
        onDark: "bg-white/20 text-white",
        link: "text-accent underline-offset-4",
      },
      size: {
        default: "h-7 px-3 text-[length:var(--text-small)]",
        sm: "h-6 px-2.5 text-[length:var(--text-small)] [&>svg]:size-3",
        lg: "h-8 px-3.5 text-[length:var(--text-caption)] [&>svg]:size-4",
        /** The user-type chip, per v1 §7.3. */
        chip: "h-8 px-4 text-[length:var(--text-caption)] font-bold [&>svg]:size-4",
        /** The debate card's state pill — unmissable, per the v2 note. */
        state:
          "h-9 gap-2 px-4 text-[length:var(--text-caption)] font-extrabold [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

/** A leading status dot (§16.2). Pulses for live states. */
function BadgeDot({
  className,
  pulse,
  ...props
}: React.ComponentProps<"span"> & { pulse?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-2 shrink-0 rounded-full bg-current",
        pulse && "animate-pulse-dot",
        className,
      )}
      {...props}
    />
  );
}

export { Badge, BadgeDot, badgeVariants };
