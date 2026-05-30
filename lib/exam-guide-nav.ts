export type ExamGuideLink = {
  label: string;
  href: string;
};

export type ExamGuideGroup = {
  title: string;
  links: ExamGuideLink[];
};

export const EXAM_GUIDE_GROUPS: ExamGuideGroup[] = [
  {
    title: "Getting Started",
    links: [
      {
        label: "How to Get a Maryland Insurance License",
        href: "/how-to-get-a-maryland-insurance-license",
      },
      {
        label: "Maryland Life & Health Exam Requirements",
        href: "/maryland-life-health-insurance-exam-requirements",
      },
      {
        label: "Maryland Insurance Exam Cost",
        href: "/maryland-insurance-exam-cost",
      },
      {
        label: "Maryland Insurance Exam Registration",
        href: "/maryland-insurance-exam-registration",
      },
    ],
  },
  {
    title: "Exam Day",
    links: [
      {
        label: "Where to Take the Maryland Insurance Exam",
        href: "/where-to-take-the-maryland-insurance-exam",
      },
      {
        label: "What to Bring to the Exam",
        href: "/what-to-bring-to-the-maryland-insurance-exam",
      },
      {
        label: "Exam Format & Passing Score",
        href: "/maryland-insurance-exam-format-passing-score",
      },
      {
        label: "Prometric Testing Centers in Maryland",
        href: "/prometric-testing-centers-maryland",
      },
    ],
  },
  {
    title: "Study Resources",
    links: [
      {
        label: "Free Maryland Practice Test",
        href: "/maryland-insurance-practice-test",
      },
      {
        label: "Maryland Insurance Exam Questions",
        href: "/maryland-insurance-exam-questions",
      },
      {
        label: "Maryland Life & Health Study Guide",
        href: "/maryland-life-health-study-guide",
      },
      {
        label: "Exam Readiness Calculator",
        href: "/maryland-insurance-exam-readiness-calculator",
      },
    ],
  },
  {
    title: "Pass Faster",
    links: [
      {
        label: "Most Common Exam Mistakes",
        href: "/common-maryland-insurance-exam-mistakes",
      },
      {
        label: "Hardest Maryland Insurance Exam Topics",
        href: "/hardest-maryland-insurance-exam-topics",
      },
      {
        label: "Last-Minute Study Tips",
        href: "/maryland-insurance-exam-last-minute-study-tips",
      },
      {
        label: "How to Pass on Your First Attempt",
        href: "/how-to-pass-the-maryland-insurance-exam",
      },
    ],
  },
  {
    title: "After You Pass",
    links: [
      {
        label: "Next Steps After Passing the Exam",
        href: "/after-passing-the-maryland-insurance-exam",
      },
      {
        label: "Applying for Your Maryland Insurance License",
        href: "/apply-for-maryland-insurance-license",
      },
      {
        label: "Background Check Requirements",
        href: "/maryland-insurance-license-background-check",
      },
      {
        label: "Continuing Education Requirements",
        href: "/maryland-insurance-continuing-education-requirements",
      },
    ],
  },
];

export const EXAM_GUIDE_SLUGS = EXAM_GUIDE_GROUPS.flatMap((g) =>
  g.links.map((l) => l.href.replace(/^\//, ""))
);
