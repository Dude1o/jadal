import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex min-h-24 w-full rounded-[18px] bg-[var(--inset)] px-4 py-3 text-[length:var(--text-body)] font-semibold text-foreground outline-none transition-[box-shadow,background-color] duration-150 ease-in-out",
        "placeholder:font-semibold placeholder:text-muted-foreground/70",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]",
        "aria-invalid:shadow-[inset_0_0_0_2px_var(--destructive)]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
