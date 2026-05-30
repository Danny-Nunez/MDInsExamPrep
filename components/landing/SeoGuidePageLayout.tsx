import type { Metadata } from "next";
import Link from "next/link";
import LandingNav from "@/components/LandingNav";
import CTAExamCard from "@/components/landing/CTAExamCard";
import ExamCostBreakdown from "@/components/landing/ExamCostBreakdown";
import CommonExamMistakesBreakdown from "@/components/landing/CommonExamMistakesBreakdown";
import ExamDayChecklist from "@/components/landing/ExamDayChecklist";
import HardestTopicsBreakdown from "@/components/landing/HardestTopicsBreakdown";
import OfficialResourcesCard from "@/components/landing/OfficialResourcesCard";
import LandingFooter from "@/components/landing/LandingFooter";
import { FOOTER_DISCLAIMER, SITE_URL } from "@/lib/branding";
import type { SeoGuidePage } from "@/lib/seo-guide-pages";

export function seoGuideMetadata(page: SeoGuidePage): Metadata {
  const canonical = `${SITE_URL}/${page.slug}`;
  return {
    title: `${page.seoTitle} | Maryland Insurance Exam`,
    description: page.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url: canonical,
    },
  };
}

type SeoGuidePageLayoutProps = {
  page: SeoGuidePage;
};

export default function SeoGuidePageLayout({ page }: SeoGuidePageLayoutProps) {
  return (
    <div className="min-h-screen bg-stone-50">
      <LandingNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
        <nav className="text-sm text-stone-500">
          <Link href="/" className="hover:text-md-red">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-stone-700">Exam Guide</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-md-black sm:text-4xl">
          {page.h1}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">{page.intro}</p>

        {page.officialLinks &&
          page.officialLinks.length > 0 &&
          !page.showHardestTopics &&
          !page.showExamDayChecklist &&
          !page.showCommonMistakes && (
          <OfficialResourcesCard
            className="mt-8"
            links={page.officialLinks}
            phone={page.officialPhone}
            email={page.officialEmail}
            note={page.officialNote}
          />
        )}

        {page.sections.length > 0 && (
          <div
            className={`space-y-8 ${page.showHardestTopics || page.showCostBreakdown || page.showExamDayChecklist || page.showCommonMistakes ? "mt-8" : "mt-10"}`}
          >
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold text-md-black">
                  {section.heading}
                </h2>
                <p className="mt-2 leading-relaxed text-stone-600">{section.body}</p>
              </section>
            ))}
          </div>
        )}

        {page.showCostBreakdown && <ExamCostBreakdown />}
        {page.showExamDayChecklist && (
          <>
            {page.officialLinks && page.officialLinks.length > 0 && (
              <OfficialResourcesCard
                className="mt-8"
                links={page.officialLinks}
                phone={page.officialPhone}
                email={page.officialEmail}
                note={page.officialNote}
              />
            )}
            <ExamDayChecklist />
          </>
        )}
        {page.showCommonMistakes && (
          <>
            {page.officialLinks && page.officialLinks.length > 0 && (
              <OfficialResourcesCard
                className="mt-8"
                links={page.officialLinks}
                phone={page.officialPhone}
                email={page.officialEmail}
                note={page.officialNote}
              />
            )}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-md-black">
                Mistakes by category
              </h2>
              <p className="mt-2 text-stone-600">
                Study habits, registration, test-day behavior, and retake traps.
              </p>
            </div>
            <CommonExamMistakesBreakdown />
          </>
        )}
        {page.showHardestTopics && (
          <>
            {page.officialLinks && page.officialLinks.length > 0 && (
              <OfficialResourcesCard
                className="mt-8"
                links={page.officialLinks}
                phone={page.officialPhone}
                email={page.officialEmail}
                note={page.officialNote}
              />
            )}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-md-black">
                Ranked hardest topics
              </h2>
              <p className="mt-2 text-stone-600">
                Based on outline weight and what licensing candidates commonly miss.
              </p>
            </div>
            <HardestTopicsBreakdown />
          </>
        )}

        <CTAExamCard className="mt-10" />

        <p className="mt-10 border-t border-stone-200 pt-6 text-xs leading-relaxed text-stone-500">
          {FOOTER_DISCLAIMER} Requirements and fees change—confirm current rules with
          the Maryland Insurance Administration and Prometric before you register.
        </p>
      </main>
      <LandingFooter />
    </div>
  );
}
