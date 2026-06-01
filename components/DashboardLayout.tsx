"use client";

import Link from "next/link";
import MarylandLogo from "@/components/MarylandLogo";
import MobileBottomNav from "@/components/MobileBottomNav";
import SiteFooter from "@/components/landing/SiteFooter";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
        <MarylandLogo href="/dashboard" size="sm" showAppName={false} />
        <Link
          href="/account"
          className="text-sm font-medium text-stone-600 hover:text-md-red"
        >
          Account
        </Link>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="sticky top-0 hidden h-screen shrink-0 self-start lg:block">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1 overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </main>
      </div>

      <MobileBottomNav />

      <div className="hidden lg:block">
        <SiteFooter />
      </div>
    </div>
  );
}
