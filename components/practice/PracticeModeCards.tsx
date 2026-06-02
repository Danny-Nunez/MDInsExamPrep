import Link from "next/link";
import {
  Brain,
  CheckCircle2,
  FileText,
  Upload,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PROMETRIC_EXAM_LENGTH } from "@/lib/quizSeed";

type PracticeFilters = {
  domain?: string;
  difficulty?: string;
  weakOnly?: boolean;
};

function practiceHref(
  base: Record<string, string>,
  filters: PracticeFilters
): string {
  const params = new URLSearchParams(base);
  if (filters.domain) params.set("domain", filters.domain);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.weakOnly) params.set("weakOnly", "1");
  return `/practice?${params.toString()}`;
}

type ModeCard = {
  title: string;
  icon: LucideIcon;
  iconWrapClass: string;
  iconClass: string;
  items?: string[];
  description?: string;
  cta: string;
  ctaClass: string;
  href: string;
};

export default function PracticeModeCards({
  filters = {},
}: {
  filters?: PracticeFilters;
}) {
  const modes: ModeCard[] = [
    {
      title: "Full Exam Simulation",
      icon: FileText,
      iconWrapClass: "bg-red-50",
      iconClass: "text-md-red",
      items: [
        `${PROMETRIC_EXAM_LENGTH} Questions`,
        "Timed",
        "Prometric Style",
      ],
      cta: "Start Full Exam",
      ctaClass: "btn-primary hover:opacity-90",
      href: practiceHref(
        {
          session: "exam",
          prometric: "1",
          count: String(PROMETRIC_EXAM_LENGTH),
        },
        filters
      ),
    },
    {
      title: "Quick Quiz",
      icon: Zap,
      iconWrapClass: "bg-amber-50",
      iconClass: "text-amber-600",
      items: ["10 Questions", "5 Minutes", "Instant Results"],
      cta: "Start Quick Quiz",
      ctaClass:
        "bg-md-gold text-md-black hover:opacity-90",
      href: practiceHref({ session: "study", count: "10" }, filters),
    },
    {
      title: "AI Weak Area Quiz",
      icon: Brain,
      iconWrapClass: "bg-green-50",
      iconClass: "text-green-600",
      description: "Focus on your weakest topics to improve faster.",
      cta: "Generate AI Quiz",
      ctaClass: "bg-green-600 text-white hover:bg-green-700",
      href: "/practice#focused-practice",
    },
    {
      title: "Upload Score Report",
      icon: Upload,
      iconWrapClass: "bg-violet-50",
      iconClass: "text-violet-600",
      description:
        "Upload your failed exam report to get a personalized recovery plan.",
      cta: "Upload Report",
      ctaClass: "bg-violet-600 text-white hover:bg-violet-700",
      href: "/dashboard#upload",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <div
            key={mode.title}
            className="flex min-w-0 flex-col justify-between rounded-xl border border-stone-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${mode.iconWrapClass}`}
                >
                  <Icon className={`h-5 w-5 ${mode.iconClass}`} aria-hidden />
                </div>
                <p className="text-sm font-bold text-slate-900">{mode.title}</p>
              </div>
              {mode.items ? (
                <ul className="space-y-1.5">
                  {mode.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-stone-600"
                    >
                      <CheckCircle2
                        className={`h-3.5 w-3.5 shrink-0 ${mode.iconClass}`}
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-stone-600">
                  {mode.description}
                </p>
              )}
            </div>
            <Link
              href={mode.href}
              className={`mt-4 block w-full rounded-lg py-2.5 text-center text-sm font-semibold ${mode.ctaClass}`}
            >
              {mode.cta}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
