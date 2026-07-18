import type { SideBarItem } from "@/types";
import {
  Activity,
  Calendar,
  ChartPie,
  CheckCircle,
  CircleAlert,
  FileText,
  Form,
  HeartPulse,
  Home,
  Megaphone,
  MessagesSquare,
  Presentation,
  Radio,
  Scale,
  ShieldAlert,
  Sparkles,
  Swords,
  Trophy,
  User,
  Users,
  XCircle,
} from "lucide-react";

export const sidebarItems: SideBarItem[] = [
  {
    title: "navigation.sidebar.home",
    url: "/",
    icon: Home,
    hasPlusIcon: false,
  },

  {
    title: "navigation.sidebar.users",
    url: "/users",
    icon: User,
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
    icon: MessagesSquare,
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
    icon: ChartPie,
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
    icon: Swords,
  },

  {
    title: "navigation.sidebar.debateMotions",
    url: "/debate-motions",
    icon: Sparkles,
  },

  {
    title: "navigation.sidebar.debateMotionFrameworks",
    url: "/debate-motion-frameworks",
    icon: Scale,
  },

  {
    title: "navigation.sidebar.blogs",
    url: "/blogs",
    icon: FileText,
    hasPlusIcon: false,
  },

  {
    title: "navigation.sidebar.teams",
    url: "/teams",
    icon: Users,
    hasPlusIcon: false,
  },

  {
    title: "navigation.sidebar.surveys",
    url: "/surveys",
    icon: Form,
  },

  {
    title: "navigation.sidebar.complaints",
    url: "/complaints",
    icon: CircleAlert,
  },
];
