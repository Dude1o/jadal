import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Filled input. No rest border — the fill's tonal step against the card is the
 * separation. Focus is an inset orange ring, one of the four permitted strokes,
 * and it never shifts layout (§5.1, §16.3).
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-13 w-full min-w-0 rounded-[18px] bg-[var(--inset)] px-4 text-[length:var(--text-body)] font-semibold text-foreground outline-none transition-[box-shadow,background-color] duration-150 ease-in-out",
        "placeholder:font-semibold placeholder:text-muted-foreground/70",
        "file:inline-flex file:h-8 file:bg-transparent file:text-[length:var(--text-caption)] file:font-bold file:text-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]",
        "aria-invalid:shadow-[inset_0_0_0_2px_var(--destructive)]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
