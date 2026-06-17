import { BookOpen, HelpCircle, Play, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const stats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: BookOpen, value: "15", label: "Modules" },
  { icon: Play, value: "100+", label: "Lessons" },
  { icon: HelpCircle, value: "1,000+", label: "Practice Questions" },
  { icon: Shield, value: "Maryland", label: "Specific" },
];

export default function LandingStatsBar() {
  return (
    <section className="bg-md-black py-12 sm:py-14" aria-label="Platform stats">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <Icon
                className="mx-auto h-8 w-8 text-md-gold"
                aria-hidden
              />
              <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-stone-400">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
