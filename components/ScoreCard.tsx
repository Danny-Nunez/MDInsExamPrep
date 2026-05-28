import type { ReactNode } from "react";

type ScoreCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  subtitleClassName?: string;
};

export default function ScoreCard({
  title,
  value,
  subtitle,
  icon,
  subtitleClassName = "text-slate-500",
}: ScoreCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className={`mt-1 text-sm ${subtitleClassName}`}>{subtitle}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
          {icon}
        </div>
      </div>
    </div>
  );
}
