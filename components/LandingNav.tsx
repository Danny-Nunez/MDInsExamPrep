"use client";

import Link from "next/link";
import { useState } from "react";
import MarylandLogo from "@/components/MarylandLogo";
import ExamGuideDropdown from "@/components/landing/ExamGuideDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessFullApp } from "@/lib/access";
import { CHECKOUT_CTA, SIGN_UP_CTA } from "@/lib/subscription";

const mainNavLinks = [
  { href: "/practice-test", label: "Practice Test" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#upload-score-report", label: "Upload Results" },
];

export default function LandingNav() {
  const { isLoggedIn, loading, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasFullAccess = canAccessFullApp(user);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-md-black">
      <div className="landing-shell flex items-center justify-between gap-6 py-4">
        <MarylandLogo href="/" size="md" wordmark darkNav />

        <nav className="hidden items-center gap-8 lg:flex">
          <Link href={mainNavLinks[0].href} className="landing-nav-link-dark">
            {mainNavLinks[0].label}
          </Link>
          <Link href={mainNavLinks[1].href} className="landing-nav-link-dark">
            {mainNavLinks[1].label}
          </Link>
          <ExamGuideDropdown variant="desktop" darkNav />
          {mainNavLinks.slice(2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="landing-nav-link-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/40 text-white hover:bg-white/10 lg:hidden"
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
            hasFullAccess ? (
              <Link
                href="/dashboard"
                onClick={closeMobile}
                className="landing-nav-cta hidden sm:inline-flex"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sample"
                  onClick={closeMobile}
                  className="landing-nav-login-dark hidden sm:inline-flex"
                >
                  Free sample
                </Link>
                <Link
                  href="/subscribe"
                  onClick={closeMobile}
                  className="landing-nav-cta hidden sm:inline-flex"
                >
                  {CHECKOUT_CTA}
                </Link>
              </>
            )
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMobile}
                className="landing-nav-login-dark hidden sm:inline-flex"
              >
                Log In
              </Link>
              <Link
                href="/register?next=/subscribe"
                onClick={closeMobile}
                className="landing-nav-cta btn-shimmer hidden sm:inline-flex"
              >
                {SIGN_UP_CTA}
              </Link>
            </>
          )}
        </div>
      </div>
      <div
        className={`absolute left-0 right-0 top-full z-50 max-h-[min(80vh,32rem)] overflow-y-auto border-t border-stone-800 bg-md-black px-4 py-4 shadow-lg transition-all duration-200 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className="landing-nav-link-dark rounded-md px-3 py-2.5 hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <ExamGuideDropdown
            variant="mobile"
            darkNav
            onNavigate={closeMobile}
          />
        </nav>
        <div className="mt-3 grid grid-cols-1 gap-2 border-t border-stone-800 pt-3 sm:grid-cols-2">
          {!loading && isLoggedIn ? (
            hasFullAccess ? (
              <Link
                href="/dashboard"
                onClick={closeMobile}
                className="landing-nav-cta col-span-full inline-flex items-center justify-center sm:col-span-2"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sample"
                  onClick={closeMobile}
                  className="landing-nav-login-dark inline-flex items-center justify-center"
                >
                  Free sample
                </Link>
                <Link
                  href="/subscribe"
                  onClick={closeMobile}
                  className="landing-nav-cta inline-flex items-center justify-center"
                >
                  {CHECKOUT_CTA}
                </Link>
              </>
            )
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMobile}
                className="landing-nav-login-dark inline-flex items-center justify-center"
              >
                Log In
              </Link>
              <Link
                href="/register?next=/subscribe"
                onClick={closeMobile}
                className="landing-nav-cta btn-shimmer inline-flex items-center justify-center"
              >
                {SIGN_UP_CTA}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
