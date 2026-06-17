import Image from "next/image";
import { Play } from "lucide-react";
import {
  FeatureBrainIcon,
  FeatureCloudUploadIcon,
  FeatureTargetIcon,
} from "@/components/landing/FeatureIcons";

const items = [
  {
    title: "Maryland-focused curriculum",
    description: "Built around Maryland Life & Health licensing domains.",
    icon: (
      <Image
        src="/logo_no_title.png"
        alt=""
        width={44}
        height={44}
        className="h-10 w-10 object-contain sm:h-11 sm:w-11"
      />
    ),
  },
  {
    title: "Free video course",
    description: "Watch structured lessons before you practice.",
    icon: (
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-md-red/10 sm:h-11 sm:w-11">
        <Play className="h-5 w-5 fill-md-red text-md-red" aria-hidden />
      </span>
    ),
  },
  {
    title: "AI-generated quizzes",
    description: "Unlimited practice tailored to your weak areas.",
    icon: <FeatureBrainIcon className="h-10 w-10 sm:h-11 sm:w-11" />,
  },
  {
    title: "Upload failed exam results",
    description: "Turn your Prometric report into a recovery plan.",
    icon: <FeatureCloudUploadIcon className="h-10 w-10 sm:h-11 sm:w-11" />,
  },
  {
    title: "Personalized study plans",
    description: "14-day plans that adapt as you improve.",
    icon: <FeatureTargetIcon className="h-10 w-10 sm:h-11 sm:w-11" />,
  },
];

export default function LandingWhyDifferentSection() {
  return (
    <section className="border-b border-stone-200 bg-white py-16 sm:py-20">
      <div className="landing-shell">
        <h2 className="text-center text-2xl font-bold text-md-black sm:text-3xl">
          Why Maryland Insurance Exam?
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {items.map((item) => (
            <article
              key={item.title}
              className="flex flex-col rounded-2xl border border-stone-200 bg-white px-5 py-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-11 items-center">{item.icon}</div>
              <h3 className="text-sm font-bold leading-snug text-md-black sm:text-base">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
