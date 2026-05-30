import Link from "next/link";
import MarylandLogo from "@/components/MarylandLogo";
import {
  APP_DESCRIPTION,
  APP_NAME,
  COPYRIGHT_YEAR,
  FOOTER_DISCLAIMER,
} from "@/lib/branding";
import { Facebook, Instagram, Mail, Youtube } from "lucide-react";

const footerLinks = {
  Explore: [
    { label: "Practice Exam", href: "/practice-test" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    {
      label: "How to Get a License",
      href: "/how-to-get-a-maryland-insurance-license",
    },
    {
      label: "Exam Requirements",
      href: "/maryland-life-health-insurance-exam-requirements",
    },
    {
      label: "Free Practice Test",
      href: "/maryland-insurance-practice-test",
    },
  ],
  Account: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sign in", href: "/login" },
    { label: "Create account", href: "/register" },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <MarylandLogo href="/" size="md" showTagline tagline="short" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-600">
              {APP_DESCRIPTION}
            </p>
            <div className="mt-4 flex gap-3">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Youtube, label: "YouTube" },
                { Icon: Mail, label: "Email" },
              ].map(({ Icon, label }) => (
                <span
                  key={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {title}
              </p>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-600 hover:text-md-red"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-stone-500">
          {FOOTER_DISCLAIMER}
        </p>

        <p className="mt-6 border-t border-stone-100 pt-6 text-center text-sm text-stone-500">
          © {COPYRIGHT_YEAR} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
