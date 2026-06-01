"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessFullApp } from "@/lib/access";
import { SIGN_UP_CTA } from "@/lib/subscription";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AccountPage() {
  const { user, isLoggedIn, loading, logout } = useAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[40vh] items-center justify-center text-stone-500">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-md px-4 py-10">
          <h1 className="text-2xl font-bold text-md-black">Account</h1>
          <p className="mt-2 text-stone-600">
            Sign in to save exams, track progress, and sync across devices.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="btn-primary px-6 py-3 text-center">
              Sign in
            </Link>
            <Link
              href="/register?next=/subscribe"
              className="btn-secondary px-6 py-3 text-center"
            >
              {SIGN_UP_CTA}
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const hasFullAccess = canAccessFullApp(user);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-md px-4 py-8 sm:py-10">
        <h1 className="text-2xl font-bold text-md-black">Account</h1>

        <div className="mt-6 flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-md-black text-lg font-semibold text-md-gold">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-md-black">{user.name}</p>
            <p className="truncate text-sm text-stone-600">{user.email}</p>
          </div>
        </div>

        <ul className="mt-6 space-y-2">
          {!hasFullAccess && (
            <li>
              <Link
                href="/subscribe"
                className="block rounded-xl border border-md-red/20 bg-md-red-light px-4 py-3 text-sm font-semibold text-md-red hover:bg-md-red-light/80"
              >
                Subscribe for full access →
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/pricing"
              className="block rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              View pricing
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="block rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              Back to marketing site
            </Link>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => logout()}
          className="mt-6 w-full rounded-xl border border-stone-300 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          Sign out
        </button>
      </div>
    </DashboardLayout>
  );
}
