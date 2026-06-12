import Link from "next/link";
import { DASHBOARD_COURSE_BASE_PATH } from "@/lib/course/constants";

const links = [
  { label: "Free Course", href: DASHBOARD_COURSE_BASE_PATH },
  { label: "Exam Guide", href: "/how-to-get-a-maryland-insurance-license" },
  {
    label: "License Requirements",
    href: "/maryland-life-health-insurance-exam-requirements",
  },
  {
    label: "Study Tips",
    href: "/maryland-insurance-exam-last-minute-study-tips",
  },
  { label: "Pricing", href: "/pricing" },
];

export default function DashboardQuickLinks() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="font-semibold text-slate-900">Quick Links</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-center text-xs font-medium text-slate-700 hover:border-md-red/30 hover:text-md-red sm:text-sm"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
