import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Home,
  User,
} from "lucide-react";

export type DashboardNavTab = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
};

export const mobileBottomNavTabs: DashboardNavTab[] = [
  {
    href: "/dashboard",
    label: "Home",
    icon: Home,
    isActive: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/practice",
    label: "Practice",
    icon: ClipboardList,
    isActive: (pathname) =>
      pathname === "/practice" ||
      pathname.startsWith("/practice/") ||
      pathname === "/quiz" ||
      pathname.startsWith("/quiz/") ||
      pathname === "/ai-quiz" ||
      pathname.startsWith("/ai-quiz/"),
  },
  {
    href: "/performance",
    label: "Progress",
    icon: BarChart3,
    isActive: (pathname) =>
      pathname === "/performance" ||
      pathname.startsWith("/performance/") ||
      pathname === "/results" ||
      pathname.startsWith("/results/"),
  },
  {
    href: "/study-areas",
    label: "Study Plan",
    icon: BookOpen,
    isActive: (pathname) =>
      pathname === "/study-areas" ||
      pathname.startsWith("/study-areas/") ||
      pathname === "/flashcards" ||
      pathname.startsWith("/flashcards/"),
  },
  {
    href: "/account",
    label: "Account",
    icon: User,
    isActive: (pathname) =>
      pathname === "/account" ||
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/subscribe",
  },
];
