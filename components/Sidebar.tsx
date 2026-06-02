"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Layers,
  History,
  BarChart3,
  Shield,
} from "lucide-react";
import MarylandLogo from "@/components/MarylandLogo";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    isActive: (pathname: string) => pathname === "/dashboard",
  },
  {
    href: "/practice",
    label: "Practice Exams",
    icon: FileText,
    isActive: (pathname: string) =>
      pathname === "/practice" ||
      pathname === "/quiz" ||
      pathname === "/ai-quiz",
  },
  {
    href: "/study-areas",
    label: "Study Areas",
    icon: BookOpen,
    isActive: (pathname: string) =>
      pathname === "/study-areas" || pathname.startsWith("/study-areas/"),
  },
  {
    href: "/flashcards",
    label: "Flashcards",
    icon: Layers,
    isActive: (pathname: string) =>
      pathname === "/flashcards" || pathname.startsWith("/flashcards/"),
  },
  {
    href: "/results",
    label: "Exam History",
    icon: History,
    isActive: (pathname: string) =>
      pathname === "/results" || pathname.startsWith("/results/"),
  },
  {
    href: "/performance",
    label: "Performance",
    icon: BarChart3,
    isActive: (pathname: string) =>
      pathname === "/performance" || pathname.startsWith("/performance/"),
  },
];

const adminNavItems = [
  {
    href: "/admin/concepts",
    label: "Admin · Concepts",
    icon: Shield,
    isActive: (pathname: string) => pathname.startsWith("/admin/concepts"),
  },
  {
    href: "/admin/review",
    label: "Admin · Review",
    icon: Shield,
    isActive: (pathname: string) => pathname.startsWith("/admin/review"),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isLoggedIn, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsAdmin(false);
      return;
    }
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setIsAdmin(Boolean(data.isAdmin)))
      .catch(() => setIsAdmin(false));
  }, [isLoggedIn]);

  const allNavItems = isAdmin ? [...navItems, ...adminNavItems] : navItems;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-stone-800 bg-md-black">
      <div className="border-b border-stone-800 p-5">
        <MarylandLogo href="/dashboard" size="sm" wordmark darkNav />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {allNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive(pathname);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive ? "sidebar-nav-active" : "sidebar-nav-link"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {!loading && !isLoggedIn && (
        <div className="border-t border-stone-800 p-4">
          <div className="space-y-2">
            <Link
              href="/login"
              className="landing-nav-cta block w-full py-2 text-center text-xs"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="landing-nav-login-dark block w-full py-2 text-center text-xs"
            >
              Create account
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
