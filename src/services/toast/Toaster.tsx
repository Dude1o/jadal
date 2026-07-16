import { useEffect, useRef } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useToastStore } from "./useToastStore";
import type { Toast, ToastPosition } from "./useToastStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Position classes ────────────────────────────────────────────────────────

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-4 right-4 items-end",
  "center-center":
    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center",
  "right-center": "top-1/2 right-4 -translate-y-1/2 items-end",
  "left-center": "top-1/2 left-4 -translate-y-1/2 items-start",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
};

// ─── Variant styles ──────────────────────────────────────────────────────────

const variantStyles = {
  default: "bg-card border border-border text-card-foreground",
  success: "bg-card border border-success/40 text-card-foreground",
  error: "bg-card border border-destructive/40 text-card-foreground",
  warning: "bg-card border border-warning/40 text-card-foreground",
  info: "bg-card border border-primary/40 text-card-foreground",
};

const variantIconColor = {
  default: "text-muted-foreground",
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
  info: "text-primary",
};

const defaultIcons = {
  default: null,
  success: <CheckCircle2 className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

// ─── Single Toast Item ───────────────────────────────────────────────────────

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useToastStore((s) => s.remove);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!toast.duration) return;
    timerRef.current = setTimeout(() => remove(toast.id), toast.duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, toast.duration, remove]);

  const variant = toast.variant ?? "default";
  const icon = toast.icon ?? defaultIcons[variant];

  return (
    <div
      className={cn(
        "relative flex w-full max-w-sm gap-3 rounded-lg p-4 shadow-lg",
        "animate-in slide-in-from-bottom-2 fade-in duration-300",
        variantStyles[variant],
      )}
      role="alert"
    >
      {/* Icon */}
      {icon && (
        <span className={cn("mt-0.5 shrink-0", variantIconColor[variant])}>
          {icon}
        </span>
      )}

      {/* Content */}
      <div className="flex-1 space-y-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold leading-tight">{toast.title}</p>
        )}
        {toast.description && (
          <p className="text-sm text-muted-foreground leading-snug">
            {toast.description}
          </p>
        )}

        {/* Action */}
        {toast.action && (
          <div className="pt-2">
            <Button
              size="sm"
              variant={toast.action.variant ?? "outline"}
              onClick={() => {
                toast.action!.onClick();
                remove(toast.id);
              }}
              className="h-7 text-xs"
            >
              {toast.action.label}
            </Button>
          </div>
        )}
      </div>

      {/* Close button */}
      {toast.closable !== false && (
        <button
          onClick={() => remove(toast.id)}
          className="shrink-0 rounded-sm opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Progress bar */}
      {!!toast.duration && (
        <div
          className="absolute bottom-0 left-0 h-0.5 rounded-b-lg bg-current opacity-20"
          style={{
            animation: `shrink ${toast.duration}ms linear forwards`,
            width: "100%",
          }}
        />
      )}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

// ─── Toaster (mount once in layout) ─────────────────────────────────────────

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const defaultPosition = useToastStore((s) => s.defaultPosition);

  // Group toasts by position
  const groups = toasts.reduce<Record<ToastPosition, Toast[]>>(
    (acc, t) => {
      const pos = t.position ?? defaultPosition;
      acc[pos] = [...(acc[pos] ?? []), t];
      return acc;
    },
    {} as Record<ToastPosition, Toast[]>,
  );

  return (
    <>
      {(Object.entries(groups) as [ToastPosition, Toast[]][]).map(
        ([position, items]) => (
          <div
            key={position}
            className={cn(
              "fixed z-[100] flex flex-col gap-2 pointer-events-none",
              positionClasses[position],
            )}
          >
            {items.map((t) => (
              <div key={t.id} className="pointer-events-auto w-full">
                <ToastItem toast={t} />
              </div>
            ))}
          </div>
        ),
      )}
    </>
  );
}
