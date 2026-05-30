"use client";

import Link from "next/link";
import { useState } from "react";
import MarylandLogo from "@/components/MarylandLogo";
import ExamGuideDropdown from "@/components/landing/ExamGuideDropdown";
import { useAuth } from "@/contexts/AuthContext";

const mainNavLinks = [
  { href: "/practice-test", label: "Practice Exam" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#features", label: "Features" },
];

export default function LandingNav() {
  const { isLoggedIn, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <MarylandLogo href="/" size="md" />

        <nav className="hidden items-center gap-6 lg:flex">
          {mainNavLinks.slice(0, 1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-700 hover:text-md-red"
            >
              {link.label}
            </Link>
          ))}
          <ExamGuideDropdown variant="desktop" />
          {mainNavLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-700 hover:text-md-red"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 lg:hidden"
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
          >
            <span className="relative block h-5 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 origin-center rounded bg-current transition-all duration-200 ${
                  mobileOpen ? "translate-y-2 rotate-45" : "translate-y-0 rotate-0"
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-5 rounded bg-current transition-all duration-200 ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-5 origin-center rounded bg-current transition-all duration-200 ${
                  mobileOpen ? "-translate-y-2 -rotate-45" : "translate-y-0 rotate-0"
                }`}
              />
            </span>
          </button>
          {!loading && isLoggedIn ? (
            <Link
              href="/dashboard"
              onClick={closeMobile}
              className="btn-primary hidden px-4 py-2 text-sm sm:inline-block"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMobile}
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-md-black hover:bg-stone-100 sm:inline-block"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={closeMobile}
                className="btn-primary hidden px-4 py-2 text-sm sm:inline-block"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
      <div
        className={`absolute left-0 right-0 top-full z-50 max-h-[min(80vh,32rem)] overflow-y-auto border-t border-stone-200 bg-white px-4 py-4 shadow-lg transition-all duration-200 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1">
          <Link
            href="/practice-test"
            onClick={closeMobile}
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-md-red"
          >
            Practice Exam
          </Link>
          <ExamGuideDropdown variant="mobile" onNavigate={closeMobile} />
          <Link
            href="/pricing"
            onClick={closeMobile}
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-md-red"
          >
            Pricing
          </Link>
          <Link
            href="/#features"
            onClick={closeMobile}
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-md-red"
          >
            Features
          </Link>
        </nav>
        <div className="mt-3 grid grid-cols-1 gap-2 border-t border-stone-100 pt-3">
          {!loading && isLoggedIn ? (
            <Link
              href="/dashboard"
              onClick={closeMobile}
              className="btn-primary inline-flex items-center justify-center px-4 py-2.5 text-sm"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMobile}
                className="inline-flex items-center justify-center rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-md-black hover:bg-stone-100"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={closeMobile}
                className="btn-primary inline-flex items-center justify-center px-4 py-2.5 text-sm"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
