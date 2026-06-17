import { BookOpen, CircleHelp, Play, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const stats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: BookOpen, value: "15", label: "Modules" },
  { icon: Play, value: "100+", label: "Lessons" },
  { icon: CircleHelp, value: "1,000+", label: "Questions" },
  { icon: Sparkles, value: "AI", label: "Study Plans" },
];

export default function LandingHeroStatsBar() {
  return (
    <div
      className="mx-auto max-w-5xl rounded-2xl border border-stone-200 bg-white px-5 py-7 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:px-8 sm:py-10"
      aria-label="Platform highlights"
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-0">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`flex items-center gap-3.5 sm:gap-4 sm:px-6 sm:py-2 ${
                index > 0 ? "sm:border-l sm:border-stone-200" : ""
              } ${index >= 2 ? "border-t border-stone-200 pt-8 sm:border-t-0 sm:pt-2" : ""}`}
            >
              <Icon className="h-8 w-8 shrink-0 text-md-red" aria-hidden />
              <div className="min-w-0">
                <p className="text-2xl font-bold leading-none text-md-black sm:text-[1.65rem]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm leading-snug text-stone-600">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
