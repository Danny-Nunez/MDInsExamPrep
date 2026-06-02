import Link from "next/link";

type PracticeContinueCardProps = {
  questionCount: number;
  answeredCount?: number;
  resumeHref: string;
  label?: string;
};

export default function PracticeContinueCard({
  questionCount,
  answeredCount = 0,
  resumeHref,
  label = "Practice Exam",
}: PracticeContinueCardProps) {
  const progress =
    questionCount > 0
      ? Math.min(100, Math.round((answeredCount / questionCount) * 100))
      : 0;

  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-stone-100 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
        Continue Studying
      </h2>
      <p className="mt-3 font-semibold text-slate-900">{label}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-md-red transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-stone-500">
        {answeredCount} / {questionCount} Questions Complete
      </p>
      <Link
        href={resumeHref}
        className="btn-primary mt-4 block w-full py-2.5 text-center text-sm"
      >
        Resume Exam
      </Link>
      <Link
        href="/practice"
        className="mt-3 text-sm font-medium text-md-red hover:underline"
      >
        View all in-progress exams →
      </Link>
    </div>
  );
}

export function PracticeContinueEmpty() {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-stone-100 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
        Continue Studying
      </h2>
      <p className="mt-3 text-sm text-stone-600">
        No exam in progress. Start a full simulation or quick quiz above.
      </p>
      <Link
        href="/practice?session=exam&prometric=1"
        className="mt-4 text-sm font-medium text-md-red hover:underline"
      >
        Start a new exam →
      </Link>
    </div>
  );
}
