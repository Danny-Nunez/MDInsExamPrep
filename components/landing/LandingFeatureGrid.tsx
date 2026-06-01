import Link from "next/link";
import BrushUnderline from "@/components/landing/BrushUnderline";
import { FeatureIcon, type FeatureIconId } from "@/components/landing/FeatureIcons";

type Feature = {
  icon: FeatureIconId;
  title: string;
  description: string;
  href?: string;
  featured?: boolean;
};

const features: Feature[] = [
  {
    icon: "brain",
    title: "AI-Generated Quizzes",
    description:
      "Unlimited practice quizzes customized to your weak areas and exam topics.",
  },
  {
    icon: "cloud",
    title: "Upload Failed Exam",
    description:
      "Upload your score report and get a personalized plan to improve.",
    href: "/#upload-score-report",
    featured: true,
  },
  {
    icon: "progress",
    title: "Track Your Progress",
    description:
      "See your readiness score, strengths, weaknesses, and improvement over time.",
  },
  {
    icon: "target",
    title: "Focus on Weak Areas",
    description:
      "AI identifies gaps and creates quizzes to help you master them.",
  },
  {
    icon: "calendar",
    title: "Smart Study Plans",
    description:
      "Personalized study plans based on your goals and available time.",
  },
];

export default function LandingFeatureGrid() {
  return (
    <section id="features" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-md-black sm:text-4xl">
          Everything{" "}
          <span className="relative inline-block px-0.5 pb-3.5 sm:pb-4">
            You Need
            <BrushUnderline />
          </span>{" "}
          to Pass
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f) => {
            const inner = (
              <div
                className={`flex h-full flex-col items-center rounded-xl border bg-white p-6 text-center shadow-sm transition hover:shadow-md ${
                  f.featured
                    ? "border-md-red/30"
                    : "border-stone-200"
                }`}
              >
                <FeatureIcon id={f.icon} className="mb-5 h-14 w-14 sm:h-16 sm:w-16" />
                <h3 className="font-semibold text-md-black">{f.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                  {f.description}
                </p>
                {f.featured && (
                  <p className="mt-3 text-xs font-semibold text-md-red">
                    Flagship feature →
                  </p>
                )}
              </div>
            );

            if (f.href) {
              return (
                <Link key={f.title} href={f.href} className="block h-full">
                  {inner}
                </Link>
              );
            }
            return <div key={f.title}>{inner}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
