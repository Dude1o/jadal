import { IdCard, Table } from "lucide-react";
import { cn, getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type View = "cards" | "table";

interface ViewToggleProps {
  theView: View;
  setView: (view: View) => void;
  /** Styles the control for the gradient page header. */
  onHeader?: boolean;
  className?: string;
}

/**
 * Segmented cards/table switch. Two options do not warrant a dropdown - a
 * segmented control shows the current state without a click.
 */
export default function ViewToggle({
  theView,
  setView,
  onHeader = true,
  className,
}: ViewToggleProps) {
  const { t } = useTranslation();

  const options: { value: View; icon: typeof IdCard; label: string }[] = [
    {
      value: "cards",
      icon: IdCard,
      label: getTranslation(t, "navigation.view.cards"),
    },
    {
      value: "table",
      icon: Table,
      label: getTranslation(t, "navigation.view.table"),
    },
  ];

  return (
    <div
      role="group"
      aria-label={getTranslation(t, "navigation.view.toggle")}
      className={cn(
        "inline-flex items-center gap-1 rounded-full p-1",
        onHeader ? "bg-white/[0.16]" : "bg-[var(--inset)]",
        className,
      )}
    >
      {options.map(({ value, icon: Icon, label }) => {
        const active = theView === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setView(value)}
            title={label}
            aria-pressed={active}
            className={cn(
              "flex size-8 cursor-pointer items-center justify-center rounded-full outline-none transition-[background-color,color,box-shadow] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring",
              onHeader
                ? active
                  ? "bg-white text-primary shadow-[0_3px_10px_-3px_rgba(0,0,0,.35)]"
                  : "text-white/70 hover:bg-white/[0.14] hover:text-white"
                : active
                  ? "jd-grad-blue text-white shadow-[0_4px_12px_-4px_rgba(3,82,161,.5)]"
                  : "text-muted-foreground hover:bg-primary/[0.08] hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
