import { useDialogStore } from "./useDialogStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

/**
 * Widths apply from the `sm` breakpoint UP.
 *
 * Unprefixed they were the last `max-w-*` in the merge, so they replaced
 * DialogContent's own `max-w-[calc(100%-2rem)]`. On a phone `max-w-xl` is
 * 576px — wider than the viewport — so `w-full` took over and every dialog
 * went edge to edge. Prefixed, the two live in different tailwind-merge
 * groups and the mobile clamp survives.
 */
const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-xl",
  lg: "sm:max-w-3xl",
  xl: "sm:max-w-5xl",
  full: "sm:max-w-[95vw] sm:h-[90vh]",
};

export function DialogProvider() {
  const { dialogs, close } = useDialogStore();
  const { i18n } = useTranslation();

  return (
    <>
      {dialogs.map((d) => (
        <Dialog
          key={d.id}
          open
          onOpenChange={(open) => {
            if (!open && d.closeOnOutsideClick !== false) close(d.id);
          }}
        >
          <DialogContent
            className={cn(
              "flex h-auto w-full flex-col gap-4",
              !d.width && sizeClasses[d.size ?? "md"],
              i18n.dir() === "rtl" &&
                "[&>button:last-of-type]:left-4 [&>button:last-of-type]:right-auto",
            )}
            style={{
              width: d.width,
              height: d.height,
              // An explicit width still has to respect the screen gutter, or a
              // caller asking for 900px pins a phone dialog to both edges.
              maxWidth: d.width
                ? `min(${d.width}, calc(100% - 2rem))`
                : undefined,
            }}
            onPointerDownOutside={(e) => {
              if (d.closeOnOutsideClick === false) e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              if (d.closeOnOutsideClick === false) e.preventDefault();
              else close(d.id);
            }}
            showCloseButton={d.closable !== false}
            dir={i18n.dir()}
          >
            {(d.title || d.description) && (
              <DialogHeader
                className={cn(i18n.dir() === "rtl" && "text-right")}
              >
                {d.title && (
                  <DialogTitle className="text-start">{d.title}</DialogTitle>
                )}
                {d.description && (
                  <DialogDescription className="text-start">
                    {d.description}
                  </DialogDescription>
                )}
              </DialogHeader>
            )}

            {d.children && (
              <div className="overflow-y-auto max-h-[70vh]">{d.children}</div>
            )}

            {d.actions && d.actions.length > 0 && (
              <DialogFooter
                className={cn(
                  "gap-2",
                  d.actions.length === 1
                    ? "flex" // single button stretches full width
                    : "flex-col-reverse sm:flex-row sm:justify-end",
                )}
              >
                {d.actions.map((action, i) => (
                  <Button
                    key={i}
                    variant={action.variant ?? "default"}
                    disabled={action.disabled}
                    onClick={async () => {
                      await action.onClick();
                      if (action.closeOnClick !== false) close(d.id);
                    }}
                    className={cn(
                      d.actions?.length === 1 && "w-full", // full width when alone
                      action.variant === "ghost" &&
                        "hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {action.label}
                  </Button>
                ))}
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
