/** Prometric Maryland insurance exam day — from License Information Bulletin / FAQs */

export const ACCEPTABLE_PRIMARY_IDS = [
  "Driver's license (U.S. state)",
  "State-issued identification card",
  "U.S. passport or passport card",
  "U.S. military ID (active duty, retired, or dependent where applicable)",
  "Other valid, non-expired U.S. government-issued ID with photo and signature",
];

export const BRING_TO_TEST_CENTER = [
  {
    item: "Valid government-issued photo ID with signature",
    detail:
      "Must be non-expired and issued by the U.S. government. The name must match your Prometric registration and confirmation exactly (including middle name or suffix if you used them when scheduling).",
  },
  {
    item: "Secondary ID (only if needed)",
    detail:
      "If your primary ID lacks a photo or signature, bring a second valid ID that supplies what is missing. Contact Prometric before exam day if you cannot meet standard ID rules.",
  },
  {
    item: "Appointment confirmation",
    detail:
      "Bring a printed confirmation or the confirmation number. Your phone will be stored in a locker—not kept with you during the test.",
  },
  {
    item: "Comfortable, layered clothing",
    detail:
      "Test room temperature varies. Wedding and engagement rings are typically allowed; most other jewelry is not permitted in the testing area.",
  },
  {
    item: "Eyeglasses (if you wear them)",
    detail:
      "Usually permitted after inspection. Sunglasses and non-prescription tinted lenses are not allowed while testing.",
  },
];

export const LEAVE_AT_HOME_OR_LOCKER = [
  "Cell phones, smartwatches, and all electronic devices",
  "Bags, backpacks, purses, briefcases, and wallets",
  "Notes, books, study materials, pens, and pencils",
  "Food and drinks (including water in the testing room)",
  "Watches (including digital/analog), cameras, and recording devices",
  "Tablets, laptops, headphones, and music players",
  "Hats and head coverings (except for documented religious purposes)",
  "Most jewelry (other than wedding/engagement rings and religious items)",
];

export const REMOTE_PROCTOR_BRING = [
  "Desktop or laptop computer (tablets prohibited per Prometric)",
  "Working webcam, microphone, and stable internet",
  "Same government-issued photo ID shown on camera at check-in",
  "Private, quiet room meeting ProProctor environment rules",
  "ProProctor app installed and system check completed before exam day",
];

export const EXAM_DAY_TIMING = {
  arriveEarly: "30 minutes before your scheduled start time",
  latePolicy:
    "Arriving late can count as a missed appointment—you may forfeit your exam fee and need to pay again to reschedule.",
  breaks:
    "Maryland insurance exams at test centers do not include scheduled breaks; unscheduled breaks are allowed but the timer keeps running and you must pass security again when you return.",
};
