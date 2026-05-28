"use client";

import Link from "next/link";
import MarylandLogo from "@/components/MarylandLogo";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 lg:flex">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <MarylandLogo href="/dashboard" size="sm" showAppName={false} />
        <nav className="flex gap-3 text-sm font-medium">
          <Link href="/dashboard" className="font-medium text-md-red">
            Dashboard
          </Link>
          <Link href="/practice" className="text-slate-600">
            Practice
          </Link>
          <Link href="/results" className="text-slate-600">
            History
          </Link>
          <Link href="/login" className="text-slate-600">
            Sign in
          </Link>
        </nav>
      </header>
      <div className="sticky top-0 hidden h-screen shrink-0 self-start lg:block">
        <Sidebar />
      </div>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
