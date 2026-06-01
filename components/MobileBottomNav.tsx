"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { mobileBottomNavTabs } from "@/lib/dashboard-nav";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Main navigation"
    >
      <div className="mobile-bottom-nav-inner">
        {mobileBottomNavTabs.map((tab) => {
          const Icon = tab.icon;
          const href =
            tab.href === "/account" && !isLoggedIn ? "/login" : tab.href;
          const active = tab.isActive(pathname);

          return (
            <Link
              key={tab.label}
              href={href}
              className={
                active ? "mobile-bottom-nav-item-active" : "mobile-bottom-nav-item"
              }
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={`h-6 w-6 ${active ? "text-md-gold" : "text-stone-400"}`}
                strokeWidth={active ? 2.25 : 2}
                aria-hidden
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
