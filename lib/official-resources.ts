/** Official Maryland insurance licensing URLs — verify on source sites before registering. */
export const OFFICIAL = {
  prometricSchedule: "https://www.prometric.com/maryland/insurance",
  prometricMiaHub: "https://www.prometric.com/exams/mia",
  miaProducerLicensing:
    "https://insurance.maryland.gov/Producer/Pages/Producer-Initial-and-Renewal-Licenses.aspx",
  nipr: "https://www.nipr.com",
  niprMaryland:
    "https://nipr.com/licensing-center/state-information/maryland",
  prometricPhone: "1-800-610-1174",
  miaProducerEmail: "producerlicensing.mia@maryland.gov",
  miaProducerPhone: "(410) 468-2411",
  miaProducerPhoneTollFree: "(800) 492-6116",
  miaMailAddress:
    "Maryland Insurance Administration, Attn: Producer Licensing, 200 Saint Paul Place, Suite 2700B, Baltimore, MD 21202",
  proProctorEmail: "Pro-Proctor@Prometric.com",
} as const;

export type OfficialResourceLink = {
  label: string;
  href: string;
  description?: string;
};

export const PROMETRIC_REGISTRATION_LINKS: OfficialResourceLink[] = [
  {
    label: "Register & schedule (Prometric)",
    href: OFFICIAL.prometricSchedule,
    description: "Create a candidate profile and book a test center or remote exam.",
  },
  {
    label: "Maryland Insurance Administration (Prometric hub)",
    href: OFFICIAL.prometricMiaHub,
    description: "Exam codes, scheduling steps, and MIA exam updates.",
  },
  {
    label: "MIA — Producer licensing overview",
    href: OFFICIAL.miaProducerLicensing,
    description: "State requirements, fees, and application instructions.",
  },
];

export const LICENSE_APPLICATION_LINKS: OfficialResourceLink[] = [
  {
    label: "Apply through NIPR",
    href: OFFICIAL.nipr,
    description: "Submit the NAIC Uniform Individual Producer Application online.",
  },
  {
    label: "NIPR — Maryland licensing center",
    href: OFFICIAL.niprMaryland,
    description: "Maryland-specific NIPR guidance and LicenseHub access.",
  },
  {
    label: "MIA — Producer initial & renewal licenses",
    href: OFFICIAL.miaProducerLicensing,
    description: "Official state page with forms, fees, and mailing address.",
  },
];
