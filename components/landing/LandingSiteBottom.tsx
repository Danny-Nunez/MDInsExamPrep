import { Shield, Star, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SiteFooter from "@/components/landing/SiteFooter";

const stats: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Users, value: "2,500+", label: "Students Prepared" },
  { icon: TrendingUp, value: "86%", label: "Pass Rate Improvement" },
  { icon: Star, value: "10,000+", label: "Practice Questions" },
  { icon: Shield, value: "100%", label: "Focused on Maryland Exam" },
];

export default function LandingSiteBottom() {
  return (
    <div className="bg-md-black">
      <section aria-label="Platform stats" className="border-b border-stone-800">
        <div className="landing-shell grid grid-cols-2 gap-8 py-12 sm:py-14 lg:grid-cols-4 lg:gap-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`relative text-center lg:px-6 ${
                  index > 0 ? "lg:border-l lg:border-stone-700" : ""
                } ${index >= 2 ? "border-t border-stone-800 pt-8 lg:border-t-0 lg:pt-0" : ""}`}
              >
                <Icon
                  className="mx-auto h-8 w-8 text-md-gold"
                  aria-hidden
                />
                <p className="mt-3 text-3xl font-bold text-md-gold sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-white/80">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
