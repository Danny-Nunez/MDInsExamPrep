"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  BookOpen,
  Layers,
  History,
  BarChart3,
  LogOut,
  ClipboardList,
  Shield,
} from "lucide-react";
import MarylandLogo from "@/components/MarylandLogo";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "Practice Exams", icon: FileText },
  { href: "/quiz", label: "Question Bank Quiz", icon: ClipboardList },
  { href: "/ai-quiz", label: "AI Quiz Generator", icon: Sparkles },
  { href: "/study-areas", label: "Study Areas", icon: BookOpen },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/results", label: "Exam History", icon: History },
  { href: "/performance", label: "Performance", icon: BarChart3 },
];

const adminNavItems = [
  { href: "/admin/concepts", label: "Admin · Concepts", icon: Shield },
  { href: "/admin/review", label: "Admin · Review", icon: Shield },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoggedIn, logout, loading } = useAuth();
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
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <MarylandLogo
          href="/dashboard"
          size="sm"
          showTagline
          tagline="short"
        />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {allNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "nav-active"
                  : "text-stone-600 hover:bg-stone-50 hover:text-md-black"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        {!loading && (
          <div className="rounded-lg px-2 py-2">
            {isLoggedIn && user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="btn-primary block w-full py-2 text-center text-xs"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="block w-full rounded-lg border border-slate-200 py-2 text-center text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
