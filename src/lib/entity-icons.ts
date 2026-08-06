import {
  Award,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Flag,
  Gavel,
  Home,
  Layers,
  ListChecks,
  MessagesSquare,
  Scale,
  SlidersHorizontal,
  User,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * The single source of entity iconography.
 *
 * Every surface that represents an entity — sidebar, top bar, page header,
 * card badge, form/detail header, empty state, dialog, toast, menu item —
 * imports from here. No component picks its own icon, which is how the
 * sidebar ended up showing chat bubbles for a debate while the form showed a
 * gavel.
 *
 * `outline` is for inactive/neutral placements, `filled` for active/selected/
 * emphasis. Lucide has no true filled set, so "filled" means the denser glyph
 * plus a heavier stroke, applied via `strokeWidth` at the call site.
 *
 * A gavel means *judging*, never *debating*. It appears once, as `judge`.
 */
export type EntityKey =
  | "home"
  | "debates"
  | "debateFormats"
  | "motions"
  | "motionFrameworks"
  | "users"
  | "teams"
  | "statistics"
  | "blog"
  | "achievements"
  | "surveys"
  | "complaints"
  | "profile"
  | "settings"
  | "judge";

export interface EntityIcon {
  outline: LucideIcon;
  filled: LucideIcon;
}

export const entityIcons: Record<EntityKey, EntityIcon> = {
  home: { outline: Home, filled: Home },
  // Debates are a conversation, not a courtroom.
  debates: { outline: MessagesSquare, filled: MessagesSquare },
  debateFormats: { outline: SlidersHorizontal, filled: SlidersHorizontal },
  motions: { outline: ListChecks, filled: ListChecks },
  motionFrameworks: { outline: Layers, filled: Layers },
  users: { outline: User, filled: User },
  teams: { outline: Users, filled: Users },
  statistics: { outline: BarChart3, filled: BarChart3 },
  blog: { outline: BookOpen, filled: BookOpen },
  achievements: { outline: Award, filled: Award },
  surveys: { outline: ClipboardCheck, filled: ClipboardCheck },
  complaints: { outline: Flag, filled: Flag },
  profile: { outline: UserCircle, filled: UserCircle },
  settings: { outline: SlidersHorizontal, filled: SlidersHorizontal },
  // The only gavel in the product: the judging/verdict action.
  judge: { outline: Gavel, filled: Scale },
};

/** Icon for an entity, defaulting to the outline variant. */
export function entityIcon(key: EntityKey, active = false): LucideIcon {
  const pair = entityIcons[key];
  return active ? pair.filled : pair.outline;
}

/** Accent each entity carries wherever it needs a tint (§4.3 / §12.2). */
export const entityAccent: Record<EntityKey, string> = {
  home: "var(--brand-blue)",
  debates: "var(--brand-blue)",
  debateFormats: "var(--brand-blue)",
  motions: "var(--brand-orange)",
  motionFrameworks: "var(--brand-deep)",
  users: "var(--brand-orange)",
  teams: "var(--brand-blue)",
  statistics: "var(--brand-blue)",
  blog: "var(--brand-orange)",
  achievements: "var(--brand-orange)",
  surveys: "var(--brand-blue)",
  complaints: "var(--destructive)",
  profile: "var(--brand-orange)",
  settings: "var(--brand-deep)",
  judge: "var(--judges)",
};
