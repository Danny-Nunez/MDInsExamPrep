import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import MarylandLogo from "@/components/MarylandLogo";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Practice", icon: FileText },
  { label: "AI Quiz", icon: Sparkles },
  { label: "Progress", icon: BarChart3 },
];

/** Decorative sidebar for marketing dashboard mockup */
export default function LandingMockupSidebar() {
  return (
    <aside className="flex w-[168px] shrink-0 flex-col border-r border-stone-800 bg-md-black">
      <div className="border-b border-stone-800 p-2.5">
        <MarylandLogo href="/dashboard" size="sm" wordmark darkNav />
      </div>

      <nav className="space-y-0.5 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                item.active ? "bg-md-red text-white" : "text-white/75"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate text-[11px] font-medium">{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-stone-800 p-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-700 text-[10px] font-semibold text-md-gold">
            JO
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-white">Jordan</p>
            <p className="truncate text-[10px] text-stone-400">Student</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
