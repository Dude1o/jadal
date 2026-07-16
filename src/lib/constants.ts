import type {
  ParticipantRole,
  DebateStatus,
  UserRole,
  UserStatus,
  TeamStatus,
} from "@/types";

export const avatarPalette = [
  "bg-primary/15 text-primary",
  "bg-accent/15 text-accent",
  "bg-muted text-muted-foreground",
];

export const DEBATE_STATUSES: {
  value: DebateStatus;
  label: string;
  dot: string;
}[] = [
  {
    value: "scheduled",
    label: "debates.statuses.scheduled",
    dot: "bg-primary",
  },
  {
    value: "announced",
    label: "debates.statuses.announced",
    dot: "bg-chart-5",
  },
  {
    value: "teams-selected",
    label: "debates.statuses.teams-selected",
    dot: "bg-warning",
  },
  { value: "live", label: "debates.statuses.live", dot: "bg-destructive" },
  {
    value: "completed",
    label: "debates.statuses.completed",
    dot: "bg-success",
  },
  {
    value: "cancelled",
    label: "debates.statuses.cancelled",
    dot: "bg-muted-foreground",
  },
];

export const DEBATE_PHASE_ROLE = [
  { label: "debateFormats.roles.proposition", value: "proposition" },
  { label: "debateFormats.roles.opposition", value: "opposition" },
  { label: "debateFormats.roles.judge", value: "judge" },
];

export const ROLE_BADGE: Record<UserRole, string> = {
  debater: "bg-primary/15 text-primary border border-primary/20",
  trainer: "bg-success/15 text-success border border-success/20",
  judge: "bg-warning/15 text-warning border border-warning/20",
  admin: "bg-destructive/15 text-destructive border border-destructive/20",
};

export const ROLES: { value: UserRole; label: string }[] = [
  { value: "debater", label: "users.roles.debater" },
  { value: "trainer", label: "users.roles.trainer" },
  { value: "judge", label: "users.roles.judge" },
  { value: "admin", label: "users.roles.admin" },
];

export const STATUSES: { value: UserStatus; label: string; dot: string }[] = [
  { value: "active", label: "users.statuses.active", dot: "bg-success" },
  {
    value: "suspended",
    label: "users.statuses.suspended",
    dot: "bg-warning",
  },
  { value: "banned", label: "users.statuses.banned", dot: "bg-destructive" },
];

export const SURVEY_STATUSES: { value: string; label: string }[] = [
  { value: "open", label: "surveys.status.open" },
  {
    value: "closing-soon",
    label: "surveys.status.closingSoon",
  },
  { value: "closed", label: "surveys.status.closed" },
];

export const TEAM_STATUSES: {
  value: TeamStatus;
  label: string;
  dot: string;
}[] = [
  { value: "active", label: "teams.statuses.active", dot: "bg-success" },
  { value: "inactive", label: "teams.statuses.inactive", dot: "bg-warning" },
];

export const TEAM_TYPES = [
  { label: "teams.form.options.random", value: "random" },
  { label: "teams.form.options.manual", value: "manual" },
] as const;

export const DEBATE_TOPICS: {
  value: string;
  label: string;
}[] = [
  { label: "debates.work", value: "work" },
  { label: "debates.tech", value: "tech" },
  { label: "debates.finance", value: "finance" },
] as const;

/**
 * USERS
 */
export const userKeys = {
  all: ["users"] as const,

  list: (params?: {
    search?: string;
    role?: UserRole;
    page?: number;
    perPage?: number;
  }) => [...userKeys.all, { ...params }] as const,

  detail: (id?: string) => [...userKeys.all, "detail", id] as const,
};

/**
 * DEBATES
 */
export const debateKeys = {
  all: ["debates"] as const,

  list: (params?: {
    search?: string;
    status?: DebateStatus;
    tag?: string;
    page?: number;
    perPage?: number;
  }) => [...debateKeys.all, { ...params }] as const,

  detail: (id?: string) => [...debateKeys.all, "detail", id] as const,
};

/**
 * DEBATE FORMATS
 */
export const debateFormatKeys = {
  all: ["debate-formats"] as const,

  list: (params?: { search?: string; page?: number; perPage?: number }) =>
    [...debateFormatKeys.all, { ...params }] as const,

  detail: (id?: string) => [...debateFormatKeys.all, "detail", id] as const,
};

/**
 * DEBATE MOTIONS
 */
export const debateMotionKeys = {
  all: ["debate-motions"] as const,

  list: (params?: { search?: string; page?: number; perPage?: number }) =>
    [...debateMotionKeys.all, { ...params }] as const,

  detail: (id?: string) => [...debateMotionKeys.all, "detail", id] as const,
};

/**
 * DEBATE MOTION FRAMEWORKS
 */
export const debateMotionFrameworkKeys = {
  all: ["debate-motion-frameworks"] as const,

  list: (params?: { search?: string; page?: number; perPage?: number }) =>
    [...debateMotionFrameworkKeys.all, { ...params }] as const,

  detail: (id?: string) =>
    [...debateMotionFrameworkKeys.all, "detail", id] as const,
};

/**
 * BLOGS
 */
export const blogKeys = {
  all: ["blogs"] as const,
  list: (params?: { page?: number; perPage?: number }) =>
    [...blogKeys.all, { ...params }] as const,
  detail: (id: string) => [...blogKeys.all, id] as const,
};

export const blogCategoryKeys = {
  all: ["blog-categories"] as const,
  list: () => [...blogCategoryKeys.all] as const,
};

export const blogTagKeys = {
  all: ["blog-tags"] as const,
  list: () => [...blogTagKeys.all] as const,
};

/**
 * TEAMS
 */
export const teamKeys = {
  all: ["teams"] as const,
  list: (params?: {
    search?: string;
    page?: number;
    perPage?: number;
    status?: TeamStatus;
    type?: "random" | "manual";
  }) => [...teamKeys.all, { ...params }] as const,
  detail: (id: string) => [...teamKeys.all, id] as const,
};

/**
 * SURVEYS
 */
export const surveyKeys = {
  all: ["surveys"] as const,
  list: (params?: { search?: string; page?: number; status?: string }) =>
    [...surveyKeys.all, { ...params }] as const,
  detail: (id: string) => [...surveyKeys.all, id] as const,
  detailResults: (id: string) => [...surveyKeys.all, id, "results"] as const,
  questions: (id: string) => [...surveyKeys.all, id, "questions"] as const,
};

/**
 * COMPLAINTS
 */
export const complaintKeys = {
  all: ["complaints"] as const,
  list: () => [...complaintKeys.all] as const,
  detail: (id: string) => [...complaintKeys.all, id] as const,
};

/**
 * CATEGORIES
 */
export const categoryKeys = {
  all: ["blog-categories"] as const,
  list: () => [...categoryKeys.all] as const,
  detail: (id: string) => [...categoryKeys.all, id] as const,
};

/**
 * TAGS
 */
export const tagKeys = {
  all: ["blog-tags"] as const,
  list: () => [...categoryKeys.all] as const,
  detail: (id: string) => [...categoryKeys.all, id] as const,
};
