import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/common/mode-toggle";
import { LangToggle } from "@/components/common/lang-toggle";
import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import { entityIcons, type EntityKey } from "@/lib/entity-icons";

/** Route prefix maps to the entity it represents, so the badge never drifts. */
const ROUTE_ENTITY: [string, EntityKey, string][] = [
  ["/users", "users", "navigation.sidebar.users"],
  ["/debate-formats", "debateFormats", "navigation.sidebar.debateFormats"],
  [
    "/debate-motion-frameworks",
    "motionFrameworks",
    "navigation.sidebar.debateMotionFrameworks",
  ],
  ["/debate-motions", "motions", "navigation.sidebar.debateMotions"],
  ["/debates", "debates", "navigation.sidebar.debates"],
  ["/statistics", "statistics", "navigation.sidebar.statistics"],
  ["/blogs", "blog", "navigation.sidebar.blogs"],
  ["/achievements", "achievements", "navigation.sidebar.achievements"],
  ["/teams", "teams", "navigation.sidebar.teams"],
  ["/surveys", "surveys", "navigation.sidebar.surveys"],
  ["/complaints", "complaints", "navigation.sidebar.complaints"],
  ["/settings", "settings", "navigation.sidebar.settings"],
];

/**
 * Translucent bar floating over the well. Separation from the content below is
 * the blur plus the scrim fade (section 9) - there is no border and no opaque
 * fill, so content visibly softens as it passes underneath.
 */
export function TopBar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const match = ROUTE_ENTITY.find(([prefix]) => pathname.startsWith(prefix));
  const entity: EntityKey = match?.[1] ?? "home";
  const titleKey = match?.[2] ?? "navigation.sidebar.home";
  const Icon = entityIcons[entity].outline;

  return (
    <div className="sticky top-0 z-30">
      <div
        className="flex h-[68px] items-center gap-3 px-4 backdrop-blur-[16px] backdrop-saturate-150 sm:px-6"
        style={{ background: "var(--topbar-bg)" }}
      >
        <SidebarTrigger className="shrink-0" />

        <span className="flex size-8 shrink-0 items-center justify-center rounded-[12px] bg-primary/12 text-primary">
          <Icon className="size-[18px]" />
        </span>
        <span className="truncate text-[length:var(--text-title)] font-extrabold text-foreground">
          {getTranslation(t, titleKey)}
        </span>

        <div className="ms-auto flex shrink-0 items-center gap-1">
          <LangToggle />
          <ModeToggle />
        </div>
      </div>

      {/* Content dissolves under the bar instead of hitting an edge. */}
      <div className="jd-scrim-top" />
    </div>
  );
}
