import { Button } from "../ui/button";
import ViewToggle from "./view-toggle";
import type { ReactNode } from "react";

interface ActionButton {
  label: string;
  onClick?: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

interface AppHeaderProps {
  title: string;
  view?: "cards" | "table";
  setView?: (view: "cards" | "table") => void;

  // New: Support multiple buttons
  actions?: ActionButton[];

  // Keep backward compatibility (optional)
  buttonLabel?: string;
  onCreate?: () => void;
  showCreateButton?: boolean;
}

export default function AppHeader({
  title,
  view,
  setView,
  actions = [],
  buttonLabel,
  onCreate,
  showCreateButton = true,
}: AppHeaderProps) {
  // Support legacy single button
  const allActions = [...actions];

  if (showCreateButton && buttonLabel && onCreate) {
    allActions.push({
      label: buttonLabel,
      onClick: onCreate,
      className: "bg-accent hover:bg-accent/80",
    });
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
      <div className="flex gap-3 items-center">
        <h1 className="text-3xl font-bold text-primary">{title}</h1>
        {view && setView && <ViewToggle view={view} setView={setView} />}
      </div>

      {/* Render all buttons */}
      {allActions.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {allActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || "default"}
              disabled={action.disabled}
              className={action.className}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
