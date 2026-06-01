import { DOMAINS } from "@/types/quiz";

/** Blueprint `domain` values on approved questions → dashboard quiz domains */
export const BLUEPRINT_DOMAIN_TO_QUIZ_DOMAIN: Record<string, string> = {
  "Insurance Regulation": "Maryland Insurance Regulations",
  "General Insurance": "General Insurance Concepts",
  "Life Insurance": "Life Insurance",
  Annuities: "Life Insurance",
  "Accident and Health Insurance": "Health Insurance",
  "Disability Income": "Health Insurance",
  "Long-Term Care": "Health Insurance",
  "Medicare and Medicaid": "Health Insurance",
  "Federal Regulations": "General Insurance Concepts",
};

/** Quiz domain labels → blueprint domains stored in MongoDB */
export const QUIZ_DOMAIN_TO_BLUEPRINT_DOMAINS: Record<string, string[]> = {
  "Life Insurance": ["Life Insurance", "Annuities"],
  "Health Insurance": [
    "Accident and Health Insurance",
    "Disability Income",
    "Long-Term Care",
    "Medicare and Medicaid",
  ],
  "Maryland Insurance Regulations": ["Insurance Regulation"],
  "General Insurance Concepts": ["General Insurance", "Federal Regulations"],
};

export function expandQuizDomainsToBlueprint(domains: string[]): string[] {
  const out = new Set<string>();
  for (const d of domains) {
    const mapped = QUIZ_DOMAIN_TO_BLUEPRINT_DOMAINS[d];
    if (mapped) mapped.forEach((x) => out.add(x));
    else out.add(d);
  }
  return [...out];
}

export function blueprintDomainToQuizDomain(blueprintDomain: string): string {
  return (
    BLUEPRINT_DOMAIN_TO_QUIZ_DOMAIN[blueprintDomain] ??
    (DOMAINS.includes(blueprintDomain as (typeof DOMAINS)[number])
      ? blueprintDomain
      : "General Insurance Concepts")
  );
}
