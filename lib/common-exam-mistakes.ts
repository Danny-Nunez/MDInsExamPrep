export type ExamMistake = {
  title: string;
  whatGoesWrong: string;
  howToAvoid: string;
};

export type ExamMistakeGroup = {
  category: string;
  description: string;
  mistakes: ExamMistake[];
};

export const COMMON_MARYLAND_EXAM_MISTAKES: ExamMistakeGroup[] = [
  {
    category: "Study & preparation",
    description:
      "Most failures happen before test day—especially since Maryland ended mandatory pre-licensing in October 2024.",
    mistakes: [
      {
        title: "Skipping study because pre-licensing is not required",
        whatGoesWrong:
          "Candidates assume no classroom hours means an easy exam. The test is still a full Prometric licensing exam with hundreds of outline objectives.",
        howToAvoid:
          "Treat self-study as required. Use timed practice until you consistently score at or above 70% on representative question sets.",
      },
      {
        title: "Ignoring Maryland-specific regulation (~30% of combo exam)",
        whatGoesWrong:
          "National-only courses leave gaps on twisting, rebating, replacement, MIA authority, and unfair trade practices—heavily tested on Maryland exams.",
        howToAvoid:
          "Block dedicated study time for state law. If the stem mentions Maryland or a producer duty, assume state rules unless the question says otherwise.",
      },
      {
        title: "Not studying from the official content outline",
        whatGoesWrong:
          "Reading textbooks cover-to-cover wastes time on low-weight chapters while missing high-weight sections like regulation and medical plans.",
        howToAvoid:
          "Download the Prometric outline for your exact exam code (2030 combo, 2027 Life, 2024 Health) and match study hours to question percentages.",
      },
      {
        title: "Avoiding timed practice exams",
        whatGoesWrong:
          "Untimed chapter quizzes build false confidence. On exam day, pacing collapses—especially on the 130-question Life & Health combo (150 minutes).",
        howToAvoid:
          "Take full-length timed simulations. Aim for steady progress without leaving a long tail of unanswered questions.",
      },
      {
        title: "Scheduling the real exam too early",
        whatGoesWrong:
          "Booking Prometric before practice scores stabilize leads to a $62 retake and a 4-day minimum wait before you can sit again.",
        howToAvoid:
          "Schedule only after several timed practices at or above 70%. Exam fees are non-refundable.",
      },
    ],
  },
  {
    category: "Registration & exam day logistics",
    description:
      "Procedural errors can cost your sitting before you answer question one.",
    mistakes: [
      {
        title: "Name or ID does not match registration",
        whatGoesWrong:
          "Prometric requires ID that exactly matches your profile and confirmation. A nickname, missing middle initial, or expired license can block check-in—treated as a missed appointment.",
        howToAvoid:
          "Update your Prometric profile before scheduling. Bring non-expired U.S. government photo ID with a signature. See our what-to-bring checklist.",
      },
      {
        title: "Arriving late to the test center",
        whatGoesWrong:
          "Prometric asks you to arrive 30 minutes early. Late arrival can forfeit the appointment and your exam fee.",
        howToAvoid:
          "Scout the center address the week before. Plan traffic and parking; arrive early, not on time.",
      },
      {
        title: "Registering for the wrong exam code",
        whatGoesWrong:
          "Maryland uses separate codes (e.g., 2030 combo vs 2027 Life only). The fee is non-refundable and non-transferable if you pick the wrong test.",
        howToAvoid:
          "Confirm your intended license lines with the MIA or your employer, then select the matching code on prometric.com/maryland/insurance.",
      },
      {
        title: "Bringing prohibited items to the testing room",
        whatGoesWrong:
          "Phones, watches, notes, or bags in the testing area can end your exam under Prometric security rules.",
        howToAvoid:
          "Bring only ID and confirmation; store everything else in the locker. Eat before check-in—food is not allowed in the room.",
      },
      {
        title: "Skipping ProProctor setup (remote exams)",
        whatGoesWrong:
          "Remote candidates fail system checks, have unstable internet, or violate environment rules and cannot start.",
        howToAvoid:
          "Run Prometric’s system check and install ProProctor before exam day. Use a private, quiet space with a laptop or desktop—not a tablet.",
      },
    ],
  },
  {
    category: "During the exam",
    description:
      "Test-taking habits that cost points even when you know the material.",
    mistakes: [
      {
        title: "Misreading BEST, EXCEPT, and NOT in the stem",
        whatGoesWrong:
          "The most common in-exam error is answering the opposite of what was asked. Prometric intentionally uses qualifier language.",
        howToAvoid:
          "Cover the answer choices, read the stem twice, and underline the qualifier before you look at options.",
      },
      {
        title: "Spending too long on one question",
        whatGoesWrong:
          "Maryland exams are timed. Getting stuck on one scenario steals time from easier points later.",
        howToAvoid:
          "Pick an answer, mark for review if available, and move on. Return with leftover time rather than burning minutes early.",
      },
      {
        title: "Assuming national rules for Maryland scenarios",
        whatGoesWrong:
          "When a question references Maryland producers, the MIA, or state statutes, national defaults are often wrong.",
        howToAvoid:
          "If Maryland is named, apply state regulation. If no state is named, use general insurance principles from the outline.",
      },
      {
        title: "Confusing look-alike products and provisions",
        whatGoesWrong:
          "Term vs permanent life, HMO vs PPO, Medigap vs Advantage, and similar policy provisions blur under pressure.",
        howToAvoid:
          "Use comparison charts during study and drill scenario questions that force you to choose between two close products.",
      },
      {
        title: "Second-guessing without evidence",
        whatGoesWrong:
          "Changing answers from correct to incorrect on a gut feeling is a common post-exam regret.",
        howToAvoid:
          "Only change an answer if you recall a specific rule or fact—not because another choice “sounds better.”",
      },
      {
        title: "Leaving questions blank",
        whatGoesWrong:
          "There is no penalty for guessing on typical multiple-choice licensing exams, but blanks are guaranteed wrong.",
        howToAvoid:
          "Eliminate two distractors when you can, then make your best selection and flag for review.",
      },
    ],
  },
  {
    category: "After a failed attempt",
    description: "Retakes are common—avoid compounding the first mistake.",
    mistakes: [
      {
        title: "Retaking before the waiting period",
        whatGoesWrong:
          "Maryland candidates must wait at least 4 days before scheduling a retake. Eligibility resets after a fail.",
        howToAvoid:
          "Use the waiting period to study missed outline sections from your score report or practice data—not the same cram method.",
      },
      {
        title: "Repeating the same study plan",
        whatGoesWrong:
          "Retaking with only general review rarely fixes weak subdomains that caused the first fail.",
        howToAvoid:
          "Focus on your lowest-weighted outline areas and Maryland regulation. Use weak-area quizzes and timed sets.",
      },
    ],
  },
];
