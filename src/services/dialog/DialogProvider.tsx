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

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-[95vw] h-[90vh]",
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
              "w-full h-auto flex flex-col gap-4 mx-0.5",
              !d.width && sizeClasses[d.size ?? "md"],
              i18n.dir() === "rtl" &&
                "[&>button:last-of-type]:left-4 [&>button:last-of-type]:right-auto",
            )}
            style={{
              width: d.width,
              height: d.height,
              maxWidth: !d.width ? undefined : d.width, // let style override if explicit width
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
                        "hover:bg-gray-300 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white",
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
