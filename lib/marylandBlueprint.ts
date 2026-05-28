import { DOMAINS } from "@/types/quiz";

export type BlueprintEntry = {
  domain: (typeof DOMAINS)[number];
  subdomain: string;
  isStateLaw?: boolean;
};

/** Maryland Life & Health Producer outline — domain + subdomain tags */
export const MARYLAND_BLUEPRINT: BlueprintEntry[] = [
  { domain: "Life Insurance", subdomain: "Types of policies" },
  { domain: "Life Insurance", subdomain: "Policy riders and options" },
  { domain: "Life Insurance", subdomain: "Beneficiaries" },
  { domain: "Life Insurance", subdomain: "Premiums" },
  { domain: "Life Insurance", subdomain: "Cash value" },
  { domain: "Life Insurance", subdomain: "Policy provisions" },
  { domain: "Life Insurance", subdomain: "Annuities" },
  { domain: "Life Insurance", subdomain: "Tax treatment" },
  { domain: "Health Insurance", subdomain: "HMO and PPO plans" },
  { domain: "Health Insurance", subdomain: "Disability income" },
  { domain: "Health Insurance", subdomain: "Long-term care" },
  { domain: "Health Insurance", subdomain: "Medical expense plans" },
  { domain: "Health Insurance", subdomain: "Medicare" },
  { domain: "Health Insurance", subdomain: "Medicaid" },
  { domain: "Health Insurance", subdomain: "Group health insurance" },
  { domain: "Health Insurance", subdomain: "COBRA", isStateLaw: false },
  { domain: "Health Insurance", subdomain: "HIPAA" },
  {
    domain: "Maryland Insurance Regulations",
    subdomain: "Producer licensing",
    isStateLaw: true,
  },
  {
    domain: "Maryland Insurance Regulations",
    subdomain: "Unfair trade practices",
    isStateLaw: true,
  },
  {
    domain: "Maryland Insurance Regulations",
    subdomain: "Twisting and rebating",
    isStateLaw: true,
  },
  {
    domain: "Maryland Insurance Regulations",
    subdomain: "Replacement rules",
    isStateLaw: true,
  },
  {
    domain: "Maryland Insurance Regulations",
    subdomain: "Advertising regulations",
    isStateLaw: true,
  },
  {
    domain: "Maryland Insurance Regulations",
    subdomain: "Claims handling",
    isStateLaw: true,
  },
  {
    domain: "Maryland Insurance Regulations",
    subdomain: "Continuing education",
    isStateLaw: true,
  },
  { domain: "General Insurance Concepts", subdomain: "Risk" },
  { domain: "General Insurance Concepts", subdomain: "Indemnity" },
  {
    domain: "General Insurance Concepts",
    subdomain: "Insurable interest",
  },
  { domain: "General Insurance Concepts", subdomain: "Underwriting" },
  {
    domain: "General Insurance Concepts",
    subdomain: "Adverse selection",
  },
  {
    domain: "General Insurance Concepts",
    subdomain: "Law of large numbers",
  },
];

export const ALL_SUBDOMAINS = MARYLAND_BLUEPRINT.map((b) => b.subdomain);

export function getSubdomainsForDomain(
  domain: string
): string[] {
  return MARYLAND_BLUEPRINT.filter((b) => b.domain === domain).map(
    (b) => b.subdomain
  );
}

export function isValidDomain(domain: string): boolean {
  return (DOMAINS as readonly string[]).includes(domain);
}

export function isValidSubdomain(
  domain: string,
  subdomain: string
): boolean {
  return MARYLAND_BLUEPRINT.some(
    (b) => b.domain === domain && b.subdomain === subdomain
  );
}
