import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  ACCEPTABLE_PRIMARY_IDS,
  BRING_TO_TEST_CENTER,
  EXAM_DAY_TIMING,
  LEAVE_AT_HOME_OR_LOCKER,
  REMOTE_PROCTOR_BRING,
} from "@/lib/exam-day-checklist";
import { OFFICIAL } from "@/lib/official-resources";

export default function ExamDayChecklist() {
  return (
    <div className="mt-8 space-y-8">
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-950 sm:px-6">
        <p className="font-semibold">Arrive early</p>
        <p className="mt-1">
          Prometric requires you to arrive <strong>{EXAM_DAY_TIMING.arriveEarly}</strong>{" "}
          for check-in, ID verification, and security screening.{" "}
          {EXAM_DAY_TIMING.latePolicy}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-green-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-md-black">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Bring to the test center
          </h2>
          <ul className="mt-4 space-y-4">
            {BRING_TO_TEST_CENTER.map((row) => (
              <li key={row.item}>
                <p className="font-medium text-md-black">{row.item}</p>
                <p className="mt-1 text-sm text-stone-600">{row.detail}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-stone-500">
            IDs commonly accepted (must include photo + signature)
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-stone-600">
            {ACCEPTABLE_PRIMARY_IDS.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-red-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-md-black">
            <XCircle className="h-5 w-5 text-red-600" />
            Leave in the locker (not in the testing room)
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Prometric provides lockers. Unauthorized items in the testing area can end
            your exam.
          </p>
          <ul className="mt-4 space-y-2">
            {LEAVE_AT_HOME_OR_LOCKER.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm text-stone-700"
              >
                <span className="text-red-500" aria-hidden>
                  ×
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-md-black">
          Remote proctor (ProProctor) — different checklist
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          If you scheduled a remote exam instead of a test center, you need a secure
          setup—not a locker. Complete Prometric&apos;s system check before exam day.
        </p>
        <ul className="mt-4 space-y-2">
          {REMOTE_PROCTOR_BRING.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-stone-700">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <a
            href="https://www.prometric.com/proproctorcandidate"
            className="font-medium text-md-red hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            ProProctor candidate regulations
          </a>
          {" · "}
          <a
            href={`mailto:${OFFICIAL.proProctorEmail}`}
            className="font-medium text-md-red hover:underline"
          >
            {OFFICIAL.proProctorEmail}
          </a>
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-700 sm:px-6">
        <p className="font-semibold text-md-black">During the exam</p>
        <p className="mt-1">{EXAM_DAY_TIMING.breaks}</p>
        <p className="mt-2">
          You receive pass/fail results immediately after finishing at the test center.
          Need ADA accommodations or ESL extra time? Arrange through Prometric before
          scheduling—not on exam day.
        </p>
        <p className="mt-3">
          <Link
            href="/where-to-take-the-maryland-insurance-exam"
            className="font-medium text-md-red hover:underline"
          >
            Where to take the exam
          </Link>
          {" · "}
          <Link
            href="/maryland-insurance-exam-registration"
            className="font-medium text-md-red hover:underline"
          >
            Registration &amp; scheduling
          </Link>
        </p>
      </div>
    </div>
  );
}
