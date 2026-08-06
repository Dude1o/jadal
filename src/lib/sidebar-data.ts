import type { SideBarItem } from "@/types";
import { entityIcons } from "./entity-icons";
import {
  Activity,
  Calendar,
  CheckCircle,
  HeartPulse,
  Megaphone,
  MessagesSquare,
  Presentation,
  Radio,
  Scale,
  ShieldAlert,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";

export const sidebarItems: SideBarItem[] = [
  {
    title: "navigation.sidebar.home",
    url: "/",
    icon: entityIcons.home.outline,
    hasPlusIcon: false,
  },

  {
    title: "navigation.sidebar.users",
    url: "/users",
    icon: entityIcons.users.outline,
    subItems: [
      {
        title: "navigation.submenu.admins",
        url: "/users",
        icon: ShieldAlert,
        search: { role: "admin" },
      },
      {
        title: "navigation.submenu.judges",
        url: "/users",
        icon: Scale,
        search: { role: "judge" },
      },
      {
        title: "navigation.submenu.coaches",
        url: "/users",
        icon: Presentation,
        search: { role: "trainer" },
      },
      {
        title: "navigation.submenu.debaters",
        url: "/users",
        icon: MessagesSquare,
        search: { role: "debater" },
      },
    ],
  },

  {
    title: "navigation.sidebar.debates",
    url: "/debates",
    icon: entityIcons.debates.outline,
    subItems: [
      {
        title: "navigation.submenu.scheduled",
        url: "/debates",
        icon: Calendar,
        search: { state: "scheduled" },
      },
      {
        title: "navigation.submenu.announced",
        url: "/debates",
        icon: Megaphone,
        search: { state: "announced" },
      },
      {
        title: "navigation.submenu.teamsSelected",
        url: "/debates",
        icon: Users,
        search: { state: "teams-selected" },
      },
      {
        title: "navigation.submenu.live",
        url: "/debates",
        icon: Radio,
        search: { state: "live" },
      },
      {
        title: "navigation.submenu.completed",
        url: "/debates",
        icon: CheckCircle,
        search: { state: "completed" },
      },
      {
        title: "navigation.submenu.cancelled",
        url: "/debates",
        icon: XCircle,
        search: { state: "cancelled" },
      },
    ],
  },

  {
    title: "navigation.sidebar.statistics",
    url: "/statistics",
    icon: entityIcons.statistics.outline,
    subItems: [
      {
        title: "navigation.submenu.frameworkFairness",
        url: "/statistics",
        icon: Scale,
        search: { tab: "framework-fairness" },
      },
      {
        title: "navigation.submenu.leaderboard",
        url: "/statistics",
        icon: Trophy,
        search: { tab: "leaderboard" },
      },
      {
        title: "navigation.submenu.platformHealth",
        url: "/statistics",
        icon: Activity,
        search: { tab: "platform-health" },
      },
      {
        title: "navigation.submenu.engagementChurn",
        url: "/statistics",
        icon: HeartPulse,
        search: { tab: "engagement-churn" },
      },
      {
        title: "navigation.submenu.complaintAccountability",
        url: "/statistics",
        icon: ShieldAlert,
        search: { tab: "complaint-accountability" },
      },
    ],
  },

  {
    title: "navigation.sidebar.debateFormats",
    url: "/debate-formats",
    icon: entityIcons.debateFormats.outline,
  },

  {
    title: "navigation.sidebar.debateMotions",
    url: "/debate-motions",
    icon: entityIcons.motions.outline,
  },

  {
    title: "navigation.sidebar.debateMotionFrameworks",
    url: "/debate-motion-frameworks",
    icon: entityIcons.motionFrameworks.outline,
  },

  {
    title: "navigation.sidebar.blogs",
    url: "/blogs",
    icon: entityIcons.blog.outline,
    hasPlusIcon: false,
  },

  {
    title: "navigation.sidebar.achievements",
    url: "/achievements",
    icon: entityIcons.achievements.outline,
  },

  {
    title: "navigation.sidebar.teams",
    url: "/teams",
    icon: entityIcons.teams.outline,
    hasPlusIcon: false,
  },

  {
    title: "navigation.sidebar.surveys",
    url: "/surveys",
    icon: entityIcons.surveys.outline,
  },

  {
    title: "navigation.sidebar.complaints",
    url: "/complaints",
    icon: entityIcons.complaints.outline,
  },
];
