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

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Practice Test", href: "/practice-test" },
      { label: "Free sample", href: "/sample" },
      { label: "Pricing", href: "/pricing" },
      { label: "Create account", href: "/register" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Free course", href: "/free-maryland-insurance-course" },
      {
        label: "Exam Guide",
        href: "/maryland-life-health-insurance-exam-requirements",
      },
      { label: "Upload results", href: "/#upload-score-report" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Log in", href: "/login" },
    ],
  },
];

const socialIconClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-stone-400 transition-colors hover:border-md-gold/60 hover:text-md-gold";

export default function SiteFooter() {
  return (
    <footer className="bg-md-black text-stone-300">
      <div className="landing-shell py-14 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] lg:gap-16 xl:gap-20">
          <div className="max-w-sm">
            <MarylandLogo href="/" size="md" wordmark darkNav />
            <p className="mt-5 text-sm leading-relaxed text-stone-400">
              {APP_DESCRIPTION}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/85 transition-colors hover:text-md-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
              Stay connected
            </p>
            <div className="mt-4 flex gap-3 lg:justify-end">
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
        </div>

        <div className="mt-14 flex flex-col items-center gap-5 border-t border-white/10 pt-10 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <p className="max-w-3xl text-xs leading-relaxed text-stone-500">
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
