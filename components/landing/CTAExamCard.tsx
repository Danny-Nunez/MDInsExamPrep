import Link from "next/link";

export default function CTAExamCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-xl border border-md-red/20 bg-md-red-light px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 ${className}`}
    >
      <div>
        <p className="font-semibold text-md-black">Ready to test your knowledge?</p>
        <p className="mt-1 text-sm text-stone-600">
          Try a short practice set with Prometric-style questions and instant feedback.
        </p>
      </div>
      <Link
        href="/sample"
        className="btn-primary inline-flex shrink-0 items-center justify-center px-5 py-2.5 text-sm"
      >
        Start Free 10-Question Exam
      </Link>
    </div>
  );
}
