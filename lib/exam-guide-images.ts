import { EXAM_GUIDE_GROUPS } from "@/lib/exam-guide-nav";

/** Slug → image under /public/exam-guides (filename from page title assets). */
export const EXAM_GUIDE_FEATURE_IMAGES: Record<string, string> = {
  "how-to-get-a-maryland-insurance-license":
    "/exam-guides/how-to-get-your-maryland-insurance-license.jpg",
  "maryland-life-health-insurance-exam-requirements":
    "/exam-guides/maryland-life-and-health-exam-requirments.jpg",
  "maryland-insurance-exam-cost":
    "/exam-guides/maryland-insurance-exam-costs.jpg",
  "maryland-insurance-exam-registration":
    "/exam-guides/register-for-the-maryland-insurance-exam.jpg",
  "where-to-take-the-maryland-insurance-exam":
    "/exam-guides/where-to-take-the-maryland-insurance-exam.jpg",
  "what-to-bring-to-the-maryland-insurance-exam":
    "/exam-guides/what-to-bring-to-the-exam.jpg",
  "maryland-insurance-exam-format-passing-score":
    "/exam-guides/exam-format-and-passing-score.jpg",
  "prometric-testing-centers-maryland":
    "/exam-guides/prometric-testing-center-in-marlyand.jpg",
  "common-maryland-insurance-exam-mistakes":
    "/exam-guides/most-common-exam-mistakes.jpg",
  "hardest-maryland-insurance-exam-topics":
    "/exam-guides/hardest-maryland-insurance-exam-topics.jpg",
  "maryland-insurance-exam-last-minute-study-tips":
    "/exam-guides/last-minute-study-tips.jpg",
  "how-to-pass-the-maryland-insurance-exam":
    "/exam-guides/how-to-pass-on-your-first-attempt.jpg",
  "after-passing-the-maryland-insurance-exam":
    "/exam-guides/next-steps-after-passing-the-exam.jpg",
  "apply-for-maryland-insurance-license":
    "/exam-guides/apply-for-youe-marlyand-insurance-license.jpg",
  "maryland-insurance-license-background-check":
    "/exam-guides/background-check-requirements.jpg",
  "maryland-insurance-continuing-education-requirements":
    "/exam-guides/continuing-education-requirements.jpg",
};

export function getExamGuideFeatureImage(slug: string): string | null {
  return EXAM_GUIDE_FEATURE_IMAGES[slug] ?? null;
}

export type ExamGuideCarouselItem = {
  slug: string;
  label: string;
  href: string;
  imageSrc: string | null;
  groupTitle: string;
};

function slugFromHref(href: string): string {
  return href.replace(/^\//, "");
}

/** Other exam guide pages for the bottom carousel (same group first, then the rest). */
export function getExamGuideCarouselItems(
  currentSlug: string
): ExamGuideCarouselItem[] {
  let currentGroup: string | null = null;
  for (const group of EXAM_GUIDE_GROUPS) {
    if (group.links.some((l) => slugFromHref(l.href) === currentSlug)) {
      currentGroup = group.title;
      break;
    }
  }

  const all: ExamGuideCarouselItem[] = EXAM_GUIDE_GROUPS.flatMap((group) =>
    group.links.map((link) => {
      const slug = slugFromHref(link.href);
      return {
        slug,
        label: link.label,
        href: link.href,
        imageSrc: getExamGuideFeatureImage(slug),
        groupTitle: group.title,
      };
    })
  ).filter((item) => item.slug !== currentSlug);

  const sameGroup = all.filter((item) => item.groupTitle === currentGroup);
  const otherGroups = all.filter((item) => item.groupTitle !== currentGroup);

  return [...sameGroup, ...otherGroups];
}
