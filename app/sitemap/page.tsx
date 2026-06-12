import type { Metadata } from "next";
import Link from "next/link";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import {
  absoluteUrl,
  getHtmlSitemapSections,
  getPublicSitemapUrlCount,
  getSiteOrigin,
} from "@/lib/seo-sitemap";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Browse all public pages on Maryland Insurance Exam — free Maryland insurance course, sample exam, pricing, Life & Health prep, and licensing exam guides.",
  alternates: {
    canonical: absoluteUrl("/sitemap"),
  },
};

export default function HtmlSitemapPage() {
  const sections = getHtmlSitemapSections();
  const total = getPublicSitemapUrlCount();
  const xmlUrl = `${getSiteOrigin()}/sitemap.xml`;

  return (
    <MarketingPageShell>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-md-black sm:text-4xl">Sitemap</h1>
        <p className="mt-3 text-lg leading-relaxed text-stone-600">
          All {total} public pages on this site. Search engines use our{" "}
          <a
            href={xmlUrl}
            className="link-accent font-medium"
          >
            XML sitemap
          </a>{" "}
          for crawling; this page is for visitors who want a full list of links.
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title} aria-labelledby={`sitemap-${section.title}`}>
            <h2
              id={`sitemap-${section.title}`}
              className="text-sm font-bold uppercase tracking-wide text-md-red"
            >
              {section.title}
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-stone-800 hover:text-md-red hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-12 border-t border-stone-200 pt-6 text-sm text-stone-500">
        Machine-readable sitemap:{" "}
        <a href={xmlUrl} className="link-accent font-medium">
          {xmlUrl}
        </a>
      </p>
    </MarketingPageShell>
  );
}
