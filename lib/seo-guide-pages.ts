import { EXAM_GUIDE_SLUGS } from "@/lib/exam-guide-nav";
import type { OfficialResourceLink } from "@/lib/official-resources";
import {
  LICENSE_APPLICATION_LINKS,
  OFFICIAL,
  PROMETRIC_REGISTRATION_LINKS,
} from "@/lib/official-resources";

export type GuideSection = {
  heading: string;
  body: string;
};

export type SeoGuidePage = {
  slug: string;
  h1: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  sections: GuideSection[];
  officialLinks?: OfficialResourceLink[];
  officialPhone?: string;
  officialEmail?: string;
  officialNote?: string;
  /** Show Prometric/MIA fee tables (cost page) */
  showCostBreakdown?: boolean;
  /** Ranked hardest topics list */
  showHardestTopics?: boolean;
  /** Exam day bring / prohibited items checklist */
  showExamDayChecklist?: boolean;
  /** Common mistakes breakdown */
  showCommonMistakes?: boolean;
};

const pages: SeoGuidePage[] = [
  {
    slug: "how-to-get-a-maryland-insurance-license",
    h1: "How to Get a Maryland Insurance License",
    intro:
      "A clear overview of the steps to become a licensed Life, Accident, Health, or Sickness insurance producer in Maryland—from eligibility through exam day and application.",
    seoTitle: "How to Get a Maryland Insurance License",
    seoDescription:
      "Step-by-step overview of becoming a Maryland insurance producer: prerequisites, exam, background check, and licensing application.",
    sections: [
      {
        heading: "Confirm you meet basic eligibility",
        body: "Candidates typically must be at least 18, meet background standards, and complete any pre-licensing education required for your line of authority. Verify current rules with the Maryland Insurance Administration (MIA) before you enroll in a course or schedule an exam.",
      },
      {
        heading: "Complete pre-licensing education (if required)",
        body: "Maryland may require approved classroom or online hours depending on the license type you are pursuing. Keep certificates of completion—you may need them for your application packet.",
      },
      {
        heading: "Register and pass the licensing exam",
        body: "Exams are delivered through Prometric for many Maryland producer lines. Register for the correct exam ID, study using outline-aligned practice, and aim for a passing score on your first attempt to avoid re-test fees and delays.",
      },
      {
        heading: "Apply for your license",
        body: "After passing, submit your license application through the state’s licensing system, pay applicable fees, and complete fingerprinting or background review if prompted. Processing times vary.",
      },
      {
        heading: "Maintain your license",
        body: "Licensed producers must follow renewal deadlines and continuing education requirements. Set calendar reminders so your license stays active while you build your book of business.",
      },
    ],
  },
  {
    slug: "maryland-life-health-insurance-exam-requirements",
    h1: "Maryland Life & Health Insurance Exam Requirements",
    intro:
      "What candidates commonly need before sitting for the Maryland Life, Accident, Health, and Sickness Producer exam—without substituting for official MIA guidance.",
    seoTitle: "Maryland Life & Health Exam Requirements",
    seoDescription:
      "Prerequisites, education hours, and exam eligibility for the Maryland Life & Health insurance producer license.",
    sections: [
      {
        heading: "License line and exam selection",
        body: "Maryland separates authority by line. Register for the exam that matches the license you intend to hold—Life, Health, or combined Life & Health/Accident & Health paths as applicable to your career plan.",
      },
      {
        heading: "Pre-licensing coursework",
        body: "Approved pre-licensing providers deliver the hour requirements set by Maryland. Document your completion dates and provider name in case the state requests verification.",
      },
      {
        heading: "Identification and registration",
        body: "Prometric registration requires valid government-issued photo ID that matches your profile. Double-check spelling and exam code before you pay—changes can add cost and delay.",
      },
      {
        heading: "Residency and appointments",
        body: "Some candidates test in Maryland; others use authorized centers in neighboring states. Confirm the center accepts your exam series before booking travel.",
      },
    ],
  },
  {
    slug: "maryland-insurance-exam-cost",
    h1: "Maryland Insurance Exam Cost",
    intro:
      "For most Maryland producer candidates, the required state fees are $62 per Prometric exam attempt and a $54 MIA license application after you pass—about $116 total if you pass on the first try. See the breakdown below; confirm the amount shown at checkout on Prometric and NIPR before you pay.",
    seoTitle: "Maryland Insurance Exam Cost & Fees",
    seoDescription:
      "Maryland insurance exam costs: $62 Prometric fee per attempt, $54 MIA license application, exam codes, and total budgeting guide.",
    showCostBreakdown: true,
    officialLinks: [
      ...PROMETRIC_REGISTRATION_LINKS,
      {
        label: "Apply for license (NIPR)",
        href: OFFICIAL.nipr,
        description: "Pay the $54 MIA license fee when submitting your producer application.",
      },
    ],
    officialPhone: OFFICIAL.prometricPhone,
    sections: [
      {
        heading: "What you pay and when",
        body: "Pay $62 to Prometric when you register for your exam (exam codes 2024, 2027, or 2030 for most Life & Health paths). After you pass, pay $54 to the Maryland Insurance Administration through your NIPR application. You do not pay the license fee before the exam.",
      },
      {
        heading: "Exam fees are per attempt",
        body: "Prometric charges $62 for every exam code, whether you take Life only (2027), Accident & Health only (2024), or the Life & Health combo (2030). Fees are non-refundable and non-transferable. A retake means another $62 registration.",
      },
      {
        heading: "No required pre-licensing fee to schedule",
        body: "Since October 1, 2024, Maryland does not require a state-approved pre-licensing course before you schedule. Optional study courses from commercial providers are separate—not part of the $116 minimum above.",
      },
      {
        heading: "Other costs to plan for",
        body: "NIPR may charge transaction fees at checkout. Fingerprinting, background review, license renewal ($69 total per MIA renewal guidance), continuing education through Sircon, and agency E&O insurance are additional expenses beyond exam and initial license fees.",
      },
    ],
  },
  {
    slug: "maryland-insurance-exam-registration",
    h1: "Maryland Insurance Exam Registration",
    intro:
      "Maryland producer exams are scheduled through Prometric—not through the Maryland Insurance Administration (MIA) directly. Use the official registration site below to create a candidate profile, pay the exam fee, and book your appointment.",
    seoTitle: "Maryland Insurance Exam Registration",
    seoDescription:
      "Register for the Maryland insurance exam on Prometric: schedule online, exam codes for Life & Health, fees, and phone support.",
    officialLinks: PROMETRIC_REGISTRATION_LINKS,
    officialPhone: OFFICIAL.prometricPhone,
    officialNote:
      "As of October 1, 2024, Maryland no longer requires state-approved pre-licensing education before scheduling the producer exam. Confirm current rules on the MIA and Prometric sites before you register.",
    sections: [
      {
        heading: "Step 1: Go to Prometric’s Maryland insurance site",
        body: "Open prometric.com/maryland/insurance (also linked in the Official links box above). Create a new Candidate Management System profile if you have not tested with Prometric since the 2024 system update—older accounts may not carry over.",
      },
      {
        heading: "Step 2: Create your profile with accurate details",
        body: "Enter your legal name, date of birth, and Social Security number exactly as they appear on your government ID. Prometric uses the email on your profile for confirmations; the MIA relies on matching identity data when you apply for your license after you pass.",
      },
      {
        heading: "Step 3: Pick the correct exam code",
        body: "For Life, Accident, Health & Sickness Producer candidates, common Maryland codes include: 2030 (Life and Accident and Health or Sickness—combo), 2027 (Life Producer only), and 2024 (Accident and Health or Sickness Producer only). Download the License Information Bulletin on Prometric’s site if you are unsure which code matches your intended license lines.",
      },
      {
        heading: "Step 4: Schedule test center or remote proctor",
        body: "After registration, choose “Schedule Test Center” for an in-person Prometric location, or “Schedule Remote Proctor” for Prometric’s online ProProctor option where available. Exam fees are paid at registration (listed at $62 per exam in Prometric’s Maryland FAQ—confirm the current amount at checkout).",
      },
      {
        heading: "Step 5: Confirm, prepare, and know reschedule rules",
        body: "Save your confirmation email and arrive at least 30 minutes early for test-center appointments. To reschedule or cancel without losing your fee, contact Prometric at least 24 hours before your appointment. Call 1-800-610-1174 if you need help scheduling by phone (hours vary—check Prometric for current times).",
      },
    ],
  },
  {
    slug: "where-to-take-the-maryland-insurance-exam",
    h1: "Where to Take the Maryland Insurance Exam",
    intro:
      "You do not take the licensing exam at MIA offices in Baltimore. Exams are delivered by Prometric at authorized test centers across Maryland and the U.S., or online through Prometric’s remote proctoring program where you qualify.",
    seoTitle: "Where to Take the Maryland Insurance Exam",
    seoDescription:
      "Where to take the Maryland insurance exam: Prometric test centers, remote proctoring, and how to find a location near you.",
    officialLinks: PROMETRIC_REGISTRATION_LINKS,
    officialPhone: OFFICIAL.prometricPhone,
    officialEmail: OFFICIAL.proProctorEmail,
    officialNote:
      "Exact center addresses and seat availability appear only after you log in to schedule at prometric.com/maryland/insurance.",
    sections: [
      {
        heading: "In-person Prometric test centers",
        body: "When you register on prometric.com/maryland/insurance, choose “Schedule Test Center” and search by ZIP code or city. Maryland candidates commonly find centers in the Baltimore metro (e.g., Baltimore, Columbia, Glen Burnie area), Montgomery County (Rockville), Prince George’s County (Lanham), Frederick, and other regions—availability changes, so use the live scheduler rather than unofficial address lists.",
      },
      {
        heading: "Testing outside Maryland",
        body: "Prometric’s Maryland Insurance License Information Bulletin states you may take the exam at any Prometric test center in the United States that offers your exam series. Select a convenient location during scheduling; your confirmation letter is your source of truth for address and arrival time.",
      },
      {
        heading: "Remote proctored exam (ProProctor)",
        body: "If you prefer to test from home or work, select “Schedule Remote Proctor” on the Prometric site and follow ProProctor setup requirements (compatible computer, webcam, quiet room, etc.). Questions about remote testing: Pro-Proctor@Prometric.com.",
      },
      {
        heading: "What is not an exam location",
        body: "The Maryland Insurance Administration at 200 Saint Paul Place, Baltimore, handles licensing applications—not on-site licensing exams. Do not go there expecting to sit for the producer test.",
      },
      {
        heading: "Exam day arrival",
        body: "Arrive at least 30 minutes before your scheduled start. Bring government-issued photo ID matching your registration. Review Prometric’s prohibited items list before you leave home.",
      },
    ],
  },
  {
    slug: "what-to-bring-to-the-maryland-insurance-exam",
    h1: "What to Bring to the Maryland Insurance Exam",
    intro:
      "At a Prometric test center you essentially bring valid ID and yourself—everything else goes in a locker. Your name on the ID must match your registration exactly, and you should arrive 30 minutes early. Remote ProProctor exams follow a different checklist (computer, webcam, quiet room).",
    seoTitle: "What to Bring to the Maryland Insurance Exam",
    seoDescription:
      "What to bring to the Maryland insurance exam: Prometric ID rules, prohibited items, arrival time, and ProProctor remote testing requirements.",
    showExamDayChecklist: true,
    officialLinks: PROMETRIC_REGISTRATION_LINKS,
    officialPhone: OFFICIAL.prometricPhone,
    officialEmail: OFFICIAL.proProctorEmail,
    officialNote:
      "Rules come from Prometric’s Maryland Insurance License Information Bulletin. Download the current bulletin from prometric.com/maryland/insurance before test day.",
    sections: [
      {
        heading: "Your ID is the only required item",
        body: "Prometric requires one valid, non-expired, U.S. government-issued identification that includes both a photograph and your signature. If your primary ID is missing either element, bring a secondary government-issued ID that supplies it.",
      },
      {
        heading: "Name must match registration exactly",
        body: "The name on your ID must match the name on your Prometric profile and appointment confirmation—including middle names or suffixes you used when scheduling. A mismatch can prevent check-in and may be treated as a missed appointment (full fee to reschedule).",
      },
      {
        heading: "Eat before you arrive",
        body: "Food and drinks are not allowed in the testing room. Maryland insurance exams at test centers do not include scheduled breaks; if you take an unscheduled break, the clock keeps running.",
      },
    ],
  },
  {
    slug: "maryland-insurance-exam-format-passing-score",
    h1: "Maryland Insurance Exam Format & Passing Score",
    intro:
      "Understand how Maryland producer exams are structured so your study plan matches the real testing experience.",
    seoTitle: "Maryland Insurance Exam Format & Passing Score",
    seoDescription:
      "Question format, timing, and passing score information for Maryland Life & Health insurance licensing exams.",
    sections: [
      {
        heading: "Multiple-choice format",
        body: "Exams use single-best-answer multiple choice. Wording often includes qualifiers like BEST, MOST, or EXCEPT—practice with similar stems.",
      },
      {
        heading: "Content outline",
        body: "Questions map to state and national insurance topics: regulation, general concepts, life, health, and Maryland-specific rules where applicable.",
      },
      {
        heading: "Passing score",
        body: "Prometric reports pass/fail at the end of your session. The numeric cut score is set by Maryland and can change—do not rely on outdated third-party percentages.",
      },
      {
        heading: "Time management",
        body: "Pace yourself across the full exam. Flag difficult items if the system allows, then review before submit. Unanswered questions count against you.",
      },
    ],
  },
  {
    slug: "prometric-testing-centers-maryland",
    h1: "Prometric Testing Centers in Maryland",
    intro:
      "Prometric does not publish a single static list of Maryland addresses on third-party sites—centers and hours are shown in real time when you schedule. Start at the official Maryland insurance scheduling portal linked below.",
    seoTitle: "Prometric Testing Centers in Maryland",
    seoDescription:
      "How to find Prometric testing centers in Maryland for the insurance licensing exam and schedule your appointment.",
    officialLinks: PROMETRIC_REGISTRATION_LINKS,
    officialPhone: OFFICIAL.prometricPhone,
    sections: [
      {
        heading: "How to find centers near you",
        body: "Log in at prometric.com/maryland/insurance → Schedule Test Center → enter your ZIP or city. The system shows open dates, times, and street addresses for seats available to you. This is the only authoritative locator for your appointment.",
      },
      {
        heading: "Regions Maryland candidates often use",
        body: "Schedulers frequently show sites around Baltimore City and County, Anne Arundel, Howard (Columbia), Montgomery (Rockville), Prince George’s (Lanham/Beltsville area), Frederick, and other markets. Eastern Shore and Western Maryland candidates sometimes test in-state or at the nearest authorized center in a bordering state.",
      },
      {
        heading: "Book early for peak times",
        body: "Saturday mornings and end-of-month slots fill quickly. If your employer sets a deadline, register as soon as your study scores are stable.",
      },
      {
        heading: "Remote alternative",
        body: "If no center fits your schedule, check “Schedule Remote Proctor” on the same Prometric portal for ProProctor availability.",
      },
    ],
  },
  {
    slug: "maryland-insurance-practice-test",
    h1: "Free Maryland Insurance Practice Test",
    intro:
      "Sample exams help you calibrate timing, question style, and weak topics before you pay for a full Prometric sitting.",
    seoTitle: "Free Maryland Insurance Practice Test",
    seoDescription:
      "Free Maryland insurance practice test with Prometric-style questions for Life & Health producer candidates.",
    sections: [
      {
        heading: "Why practice tests matter",
        body: "Reading alone rarely prepares you for BEST-answer traps and time pressure. Short quizzes build stamina and reveal gaps by topic.",
      },
      {
        heading: "What to look for",
        body: "Choose practice with four-option items, explanations, and subdomain scoring aligned to the licensing outline—not generic trivia.",
      },
      {
        heading: "Study vs. exam mode",
        body: "Use study mode to learn from explanations, then switch to timed sets to simulate test-day pacing.",
      },
    ],
  },
  {
    slug: "maryland-insurance-exam-questions",
    h1: "Maryland Insurance Exam Questions",
    intro:
      "How to study with quality practice questions that teach licensing concepts—not memorized fact lists.",
    seoTitle: "Maryland Insurance Exam Questions",
    seoDescription:
      "Practice Maryland insurance exam questions with scenarios, explanations, and blueprint-aligned topics.",
    sections: [
      {
        heading: "Scenario-based items",
        body: "Modern exams favor short scenarios about producers, applicants, and claims. Practice applying rules to facts, not recalling definitions alone.",
      },
      {
        heading: "Maryland-specific rules",
        body: "Regulation and state law questions require updated materials. Pair national concepts with Maryland insurance code topics your outline lists.",
      },
      {
        heading: "Review explanations",
        body: "After each question, read why the correct answer wins and why distractors tempt you. That habit compounds faster than retaking blind quizzes.",
      },
    ],
  },
  {
    slug: "maryland-life-health-study-guide",
    h1: "Maryland Life & Health Study Guide",
    intro:
      "A practical study sequence for Life, Accident, Health, and Sickness producer candidates balancing breadth and weak-area focus.",
    seoTitle: "Maryland Life & Health Study Guide",
    seoDescription:
      "Study guide outline for the Maryland Life & Health insurance exam: topics, schedule, and practice strategy.",
    sections: [
      {
        heading: "Start with the official outline",
        body: "Map your calendar to major domains: regulation, general insurance, life, health, and state-specific content. Weight time by exam percentage when published.",
      },
      {
        heading: "Active recall beats passive reading",
        body: "Alternate reading with quizzes. Track missed subdomains and revisit them within 48 hours for better retention.",
      },
      {
        heading: "Build a two-week sprint",
        body: "Week one: coverage of all domains at medium depth. Week two: timed practice, weak-area drills, and one full simulation.",
      },
    ],
  },
  {
    slug: "maryland-insurance-exam-readiness-calculator",
    h1: "Maryland Insurance Exam Readiness Calculator",
    intro:
      "Estimate whether you are close to ready using practice scores, coverage, and consistency—not a single gut feeling.",
    seoTitle: "Maryland Insurance Exam Readiness Calculator",
    seoDescription:
      "Gauge readiness for the Maryland insurance exam using practice scores and topic coverage.",
    sections: [
      {
        heading: "Use recent practice scores",
        body: "Average your last three timed sets. Scores in the mid-70s on quality practice may suggest more study; high-70s to 80s on representative items are a healthier signal—your mileage varies.",
      },
      {
        heading: "Check subdomain balance",
        body: "Readiness is not one number. You can score well overall while failing regulation or health basics. Fix the lowest two subdomains first.",
      },
      {
        heading: "Simulate test conditions",
        body: "Take at least one uninterrupted block with no notes. If focus drops in the final quarter, practice longer sessions.",
      },
    ],
  },
  {
    slug: "common-maryland-insurance-exam-mistakes",
    h1: "Most Common Maryland Insurance Exam Mistakes",
    intro:
      "Maryland producer candidates lose points—and often a $62 exam fee—for predictable reasons: skipping study after pre-licensing was dropped in 2024, neglecting state regulation, exam-day ID issues, and misreading BEST/EXCEPT questions. The list below groups mistakes by study, logistics, test day, and retakes.",
    seoTitle: "Common Maryland Insurance Exam Mistakes",
    seoDescription:
      "Most common Maryland insurance exam mistakes: skipping state law study, ID errors, poor pacing, wrong exam code, and how to avoid them.",
    showCommonMistakes: true,
    officialLinks: PROMETRIC_REGISTRATION_LINKS,
    officialPhone: OFFICIAL.prometricPhone,
    officialNote:
      "After October 2024, pre-licensing is not required to schedule—but the exam difficulty did not change. Plan accordingly.",
    sections: [
      {
        heading: "The biggest mistake is assuming the exam got easier",
        body: "Maryland removed mandatory pre-licensing hours effective October 1, 2024. Many candidates interpret that as a light exam. Prometric still tests the full content outline; scores are pass/fail at 70%.",
      },
      {
        heading: "State law mistakes hurt more than memorization gaps",
        body: "On the Life & Health combo, Insurance Regulation is about 30% of questions. Prep providers report that ignoring Maryland-specific statutes is the top content-related failure mode.",
      },
      {
        heading: "Exam-day errors are expensive and avoidable",
        body: "Name/ID mismatches, late arrival, wrong exam codes, and prohibited items in the testing room can end your sitting before you finish—or force a paid retake after a 4-day wait.",
      },
    ],
  },
  {
    slug: "hardest-maryland-insurance-exam-topics",
    h1: "Hardest Maryland Insurance Exam Topics",
    intro:
      "Most Life & Health combo candidates (Prometric exam 2030) struggle with the same high-weight areas: Maryland regulation alone is roughly 30% of the test, followed by policy provisions, medical plans, annuities, and tax rules. Use the ranked list below to focus practice—not every chapter deserves equal time.",
    seoTitle: "Hardest Maryland Insurance Exam Topics",
    seoDescription:
      "Hardest topics on the Maryland Life & Health insurance exam: regulation, riders, annuities, Medicare, taxes, and how to study each.",
    showHardestTopics: true,
    officialLinks: [
      {
        label: "Prometric exam outlines (Maryland)",
        href: OFFICIAL.prometricSchedule,
        description: "Official content outlines for exam 2030 and other producer codes.",
      },
      {
        label: "MIA producer licensing",
        href: OFFICIAL.miaProducerLicensing,
        description: "State rules that feed the regulation section of your exam.",
      },
    ],
    officialNote:
      "Taking Life-only (2027) or Health-only (2024)? Section weights differ—download the outline for your exact exam code.",
    sections: [
      {
        heading: "Start with the outline, not random chapters",
        body: "The table below shows how Prometric weights the Life & Health combo (exam 2030). Insurance Regulation is 30%—nearly one in three questions—so it belongs at the center of your study plan even if national prep books give it fewer pages.",
      },
      {
        heading: "Do not skip Maryland-specific regulation",
        body: "Candidates and prep providers consistently rank state law as the #1 difficulty. Twisting, rebating, unfair trade practices, producer licensing duties, and replacement rules are tested with Maryland-specific fact patterns.",
      },
      {
        heading: "Watch for look-alike life and health concepts",
        body: "Policy provisions and riders, HMO vs PPO mechanics, and Medicare vs Medigap vs Medicaid show up in long scenarios with four plausible answers. Read EXCEPT and BEST in the stem before you look at choices.",
      },
      {
        heading: "Reorder the ranked list using your practice scores",
        body: "The top 10 list below is a starting point. After timed practice, prioritize whatever subdomains you score below 70%—those are your personal hardest topics.",
      },
    ],
  },
  {
    slug: "maryland-insurance-exam-last-minute-study-tips",
    h1: "Last-Minute Study Tips for the Maryland Insurance Exam",
    intro:
      "The final 48 hours before your sitting should sharpen recall—not introduce brand-new chapters.",
    seoTitle: "Maryland Insurance Exam Last-Minute Study Tips",
    seoDescription:
      "Last-minute study tips before your Maryland insurance licensing exam at Prometric.",
    sections: [
      {
        heading: "Review weak subdomains only",
        body: "Scan missed topics from your last two practice runs. Avoid starting new life insurance chapters the night before.",
      },
      {
        heading: "Sleep and logistics",
        body: "Confirm center address, ID, and arrival time. Rest beats an all-night cram for most candidates.",
      },
      {
        heading: "Light practice",
        body: "Do 20–30 questions for confidence, then stop. Fatigue on exam morning hurts more than one extra chapter.",
      },
    ],
  },
  {
    slug: "how-to-pass-the-maryland-insurance-exam",
    h1: "How to Pass the Maryland Insurance Exam",
    intro:
      "A disciplined prep plan improves your odds—no prep course can ethically promise a guaranteed pass.",
    seoTitle: "How to Pass the Maryland Insurance Exam",
    seoDescription:
      "Study strategies to pass the Maryland Life & Health insurance exam on your first attempt.",
    sections: [
      {
        heading: "Follow the outline",
        body: "Align every study hour to the published exam outline. Random internet quizzes often miss Maryland weighting.",
      },
      {
        heading: "Mix modes",
        body: "Combine reading, flashcards, timed exams, and AI quizzes on weak subdomains for variety and retention.",
      },
      {
        heading: "Track metrics",
        body: "Log scores by subdomain. Move on only when weak areas rise—not when you merely finish a chapter.",
      },
      {
        heading: "Simulate Prometric conditions",
        body: "Practice with timed blocks, no notes, and realistic stems. Comfort on format reduces test-day anxiety.",
      },
    ],
  },
  {
    slug: "after-passing-the-maryland-insurance-exam",
    h1: "Next Steps After Passing the Maryland Insurance Exam",
    intro:
      "Passing the exam is a milestone—not the final step. Complete licensing and appointments before soliciting business.",
    seoTitle: "After Passing the Maryland Insurance Exam",
    seoDescription:
      "What to do after passing the Maryland insurance exam: licensing application and appointments.",
    sections: [
      {
        heading: "Receive your results",
        body: "Prometric provides pass/fail at the session end. Follow instructions for score reports if you need them for your application.",
      },
      {
        heading: "Submit your license application",
        body: "Apply through Maryland’s licensing portal with fees and any required documentation from pre-licensing or background vendors.",
      },
      {
        heading: "Find an agency or sponsor",
        body: "Many new producers affiliate with an agency for appointments, training, and E&O coverage. Understand compensation and release clauses before you sign.",
      },
    ],
  },
  {
    slug: "apply-for-maryland-insurance-license",
    h1: "Applying for Your Maryland Insurance License",
    intro:
      "After you pass the Prometric exam, apply for your Maryland resident producer license through the National Insurance Producer Registry (NIPR). The MIA reviews your application and supporting information—do not mail an application to Prometric.",
    seoTitle: "Apply for a Maryland Insurance License",
    seoDescription:
      "Apply for a Maryland insurance producer license after passing the exam: NIPR online application, $54 fee, and MIA contact info.",
    officialLinks: LICENSE_APPLICATION_LINKS,
    officialPhone: OFFICIAL.miaProducerPhone,
    officialEmail: OFFICIAL.miaProducerEmail,
    officialNote:
      "MIA lists a $54 initial producer license fee (Insurance Article § 2-112). Save your NIPR transaction number after you submit.",
    sections: [
      {
        heading: "Before you apply",
        body: "Confirm Prometric reported your pass to the state with your correct legal name, SSN, and date of birth—the same data you used when scheduling. If NIPR will not let you select your lines, contact MIA Producer Licensing before resubmitting.",
      },
      {
        heading: "Apply online through NIPR (primary method)",
        body: "Go to nipr.com and complete the NAIC Uniform Individual Producer Application for Maryland. The MIA directs resident producers to apply online; you will receive a confirmation email with a transaction number—keep it for status inquiries and any follow-up documents.",
      },
      {
        heading: "License fee and lines of authority",
        body: "Pay the applicable state fee when you apply (MIA publishes $54 for individual producer applications). Request only the major lines you tested for—e.g., Life, Accident & Health or Sickness, or combined authorities matching exam 2030/2024/2027 results.",
      },
      {
        heading: "Paper application (if you cannot use NIPR)",
        body: `Mail the NAIC Uniform Individual Application, fee, and any required attachments to: ${OFFICIAL.miaMailAddress}. Payment should be check, money order, or cashier’s check payable to Maryland Insurance Administration (no personal checks per MIA guidance).`,
      },
      {
        heading: "After submission",
        body: "Processing times vary. For status questions contact MIA Producer Licensing at producerlicensing.mia@maryland.gov or (410) 468-2411 / (800) 492-6116. Licenses are issued on a biennial basis (individual licenses expire the last day of your birth month).",
      },
    ],
  },
  {
    slug: "maryland-insurance-license-background-check",
    h1: "Maryland Insurance License Background Check",
    intro:
      "Background review protects consumers. Understand what to expect so you can disclose issues accurately.",
    seoTitle: "Maryland Insurance License Background Check",
    seoDescription:
      "Background check and fingerprint requirements for Maryland insurance producer licenses.",
    sections: [
      {
        heading: "Fingerprinting",
        body: "Use an approved vendor if required. Keep receipts and confirmation numbers for your application file.",
      },
      {
        heading: "Disclosures",
        body: "Answer criminal and administrative history questions truthfully. Omissions can lead to denial even when the underlying issue might have been explainable.",
      },
      {
        heading: "Timing",
        body: "Start fingerprinting early—vendor backlogs can delay licensing after you pass the exam.",
      },
    ],
  },
  {
    slug: "maryland-insurance-continuing-education-requirements",
    h1: "Maryland Insurance Continuing Education Requirements",
    intro:
      "Licensed producers must complete CE to renew. Requirements differ by line of authority and change over time.",
    seoTitle: "Maryland Insurance Continuing Education",
    seoDescription:
      "Continuing education requirements for Maryland insurance producer license renewal.",
    sections: [
      {
        heading: "Renewal cycle",
        body: "Know your license expiration date and renewal window. Late renewal can lapse your authority to sell.",
      },
      {
        heading: "Approved providers",
        body: "Take CE only from Maryland-approved sources. Save completion certificates until your renewal clears.",
      },
      {
        heading: "Ethics and specialty hours",
        body: "Some lines require ethics or LTC-specific credits. Confirm your exact obligation in the current MIA bulletin.",
      },
    ],
  },
];

export const SEO_GUIDE_PAGES: Record<string, SeoGuidePage> = Object.fromEntries(
  pages.map((p) => [p.slug, p])
);

export function getSeoGuidePage(slug: string): SeoGuidePage | undefined {
  return SEO_GUIDE_PAGES[slug];
}

export function getAllSeoGuideSlugs(): string[] {
  return EXAM_GUIDE_SLUGS.filter((slug) => SEO_GUIDE_PAGES[slug]);
}
