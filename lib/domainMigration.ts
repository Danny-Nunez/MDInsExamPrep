import { LEGACY_DOMAINS } from "@/types/quiz";

/** Map legacy category labels to Maryland blueprint domains */
const LEGACY_TO_DOMAIN: Record<string, string> = {
  Annuities: "Life Insurance",
  "Life Insurance Basics": "Life Insurance",
  "Life Insurance Policies": "Life Insurance",
  "Medical Plans": "Health Insurance",
  "Health Insurance Basics": "Health Insurance",
  "Group Health Insurance": "Health Insurance",
  "Qualified Plans": "Health Insurance",
  "Insurance Regulation": "Maryland Insurance Regulations",
  "General Insurance": "General Insurance Concepts",
};

export function normalizeDomainLabel(domain: string): string {
  if ((LEGACY_DOMAINS as readonly string[]).includes(domain)) {
    return LEGACY_TO_DOMAIN[domain] ?? domain;
  }
  return domain;
}
