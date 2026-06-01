"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { EXAM_GUIDE_GROUPS } from "@/lib/exam-guide-nav";

type ExamGuideDropdownProps = {
  /** Mobile accordion mode */
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
  /** Match landing nav link colors (gray, not red hover) */
  marketingNav?: boolean;
  /** Black nav: white links */
  darkNav?: boolean;
};

export default function ExamGuideDropdown({
  variant = "desktop",
  onNavigate,
  marketingNav = false,
  darkNav = false,
}: ExamGuideDropdownProps) {
  const triggerClass = darkNav
    ? "landing-nav-link-dark inline-flex items-center gap-1"
    : marketingNav
      ? "landing-nav-link inline-flex items-center gap-1"
      : "inline-flex items-center gap-1 text-sm font-medium text-stone-700 hover:text-md-red";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (variant !== "desktop" || !open) return;
    const close = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open, variant]);

  if (variant === "mobile") {
    return (
      <div className="border-b border-stone-100 pb-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={
            darkNav
              ? "landing-nav-link-dark flex w-full items-center justify-between rounded-md px-3 py-2.5 hover:bg-white/10"
              : marketingNav
                ? "landing-nav-link flex w-full items-center justify-between rounded-md px-3 py-2.5 hover:bg-neutral-50"
                : "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          }
          aria-expanded={open}
        >
          Exam Guide
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="mt-1 space-y-3 pl-2">
            {EXAM_GUIDE_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {group.title}
                </p>
                <ul className="space-y-0.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        className="block rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-md-red"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Exam Guide
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-50 pt-2"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className="w-[min(100vw-2rem,42rem)] rounded-xl border border-stone-200 bg-white p-4 shadow-xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXAM_GUIDE_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-md-red">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-2 py-1.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-md-red"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
