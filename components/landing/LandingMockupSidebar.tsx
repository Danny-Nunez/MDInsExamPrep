import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  FileText,
  History,
  LayoutDashboard,
  Layers,
  Settings,
  Upload,
  User,
} from "lucide-react";
import MarylandLogo from "@/components/MarylandLogo";
import { FREE_SAMPLE_QUESTION_COUNT } from "@/lib/subscription";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Practice Exams", icon: FileText },
  { label: "Study Plan", icon: BookOpen },
  { label: "Progress", icon: BarChart3 },
  { label: "Exam History", icon: History },
  { label: "Upload Report", icon: Upload },
  { label: "Flashcards", icon: Layers },
  { label: "Account", icon: User },
  { label: "Settings", icon: Settings },
];

/** Decorative sidebar for marketing dashboard mockup (desktop only). */
export default function LandingMockupSidebar() {
  return (
    <aside className="flex h-full w-[168px] shrink-0 flex-col border-r border-stone-800 bg-md-black">
      <div className="border-b border-stone-800 p-2.5">
        <MarylandLogo href="/" size="sm" wordmark darkNav />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
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
              <span className="truncate text-[10px] font-medium leading-tight">
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-stone-800 p-2.5">
        <div className="rounded-lg border border-stone-700 bg-stone-900 p-2.5">
          <p className="text-[10px] font-medium leading-snug text-white">
            Try before you subscribe
          </p>
          <Link
            href="/sample"
            className="btn-primary mt-2 block w-full py-1.5 text-center text-[10px]"
          >
            Start Free {FREE_SAMPLE_QUESTION_COUNT}-Question Exam →
          </Link>
        </div>
      </div>
    </aside>
  );
}
