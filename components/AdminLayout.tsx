"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

const links = [
  { href: "/admin/concepts", label: "Concepts" },
  { href: "/admin/review", label: "Review Questions" },
  { href: "/quiz", label: "Bank Quiz (Student)" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <DashboardLayout>
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900 sm:px-6">
        Admin · Question bank
      </div>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <nav className="mb-6 flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                pathname.startsWith(link.href)
                  ? "bg-md-red text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </nav>
        {children}
      </div>
    </DashboardLayout>
  );
}
