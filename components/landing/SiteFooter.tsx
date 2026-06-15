import Link from "next/link";
import MarylandLogo from "@/components/MarylandLogo";
import {
  APP_DESCRIPTION,
  APP_NAME,
  COPYRIGHT_YEAR,
  FOOTER_DISCLAIMER,
  SUPPORT_EMAIL,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/branding";
import { Mail, Youtube } from "lucide-react";

const footerNavLinks = [
  { label: "Practice Test", href: "/practice-test" },
  { label: "Free sample", href: "/sample" },
  { label: "Free course", href: "/free-maryland-insurance-course" },
  { label: "Exam Guide", href: "/maryland-life-health-insurance-exam-requirements" },
  { label: "Pricing", href: "/pricing" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "Create account", href: "/register" },
];

const socialIconClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-stone-600 text-stone-400 transition-colors hover:border-md-gold hover:text-md-gold";

export default function SiteFooter() {
  return (
    <footer className="bg-md-black text-stone-300">
      <div className="landing-shell py-10 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="shrink-0">
            <MarylandLogo href="/" size="md" wordmark darkNav />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">
              {APP_DESCRIPTION}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 lg:justify-center lg:pt-2">
            {footerNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/85 transition-colors hover:text-md-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-3 lg:justify-end">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={socialIconClass}
              aria-label="YouTube channel"
            >
              <Youtube className="h-4 w-4" />
            </a>
            <Link
              href="/contact"
              className={socialIconClass}
              aria-label={`Contact support at ${SUPPORT_EMAIL}`}
            >
              <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-stone-800 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="max-w-2xl text-xs leading-relaxed text-stone-500">
            {FOOTER_DISCLAIMER}
          </p>
          <p className="shrink-0 text-xs text-stone-500">
            © {COPYRIGHT_YEAR} {APP_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
