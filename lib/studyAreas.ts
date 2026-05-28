import { normalizeDomainLabel } from "@/lib/domainMigration";
import { MARYLAND_BLUEPRINT } from "@/lib/marylandBlueprint";
import { DOMAINS } from "@/types/quiz";
import type { CategoryPerformance, ExamAttempt } from "@/types/quiz";

/** Map old UI category labels to blueprint subdomains for attempt replay */
const LEGACY_TO_SUBDOMAIN: Record<string, string> = {
  Annuities: "Annuities",
  "Life Insurance Basics": "Types of policies",
  "Life Insurance Policies": "Policy provisions",
  "Medical Plans": "Medical expense plans",
  "Health Insurance Basics": "Medical expense plans",
  "Group Health Insurance": "Group health insurance",
  "Qualified Plans": "Medical expense plans",
  "Insurance Regulation": "Producer licensing",
  "General Insurance": "Risk",
};

function subdomainKey(domain: string, subdomain: string): string {
  return `${domain}::${subdomain}`;
}

export function buildBlueprintStudyAreas(): CategoryPerformance[] {
  return MARYLAND_BLUEPRINT.map(({ domain, subdomain }) => ({
    domain,
    subdomain,
    correct: 0,
    total: 0,
    percentage: 0,
  }));
}

export function aggregateSubdomainPerformance(
  attempts: ExamAttempt[]
): CategoryPerformance[] {
  const map = new Map<string, { correct: number; total: number }>();

  for (const { domain, subdomain } of MARYLAND_BLUEPRINT) {
    map.set(subdomainKey(domain, subdomain), { correct: 0, total: 0 });
  }

  for (const attempt of attempts) {
    for (const answer of attempt.answers) {
      const domain = normalizeDomainLabel(answer.domain);
      let subdomain = answer.subdomain;

      if (!subdomain && LEGACY_TO_SUBDOMAIN[answer.domain]) {
        subdomain = LEGACY_TO_SUBDOMAIN[answer.domain];
      }

      if (!subdomain) continue;

      const key = subdomainKey(domain, subdomain);
      if (!map.has(key)) continue;

      const entry = map.get(key)!;
      map.set(key, {
        correct: entry.correct + (answer.isCorrect ? 1 : 0),
        total: entry.total + 1,
      });
    }
  }

  return MARYLAND_BLUEPRINT.map(({ domain, subdomain }) => {
    const { correct, total } = map.get(subdomainKey(domain, subdomain)) ?? {
      correct: 0,
      total: 0,
    };
    return {
      domain,
      subdomain,
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  });
}

export function groupStudyAreasByDomain(
  areas: CategoryPerformance[]
): { domain: string; subdomains: CategoryPerformance[] }[] {
  return DOMAINS.map((domain) => ({
    domain,
    subdomains: areas.filter((a) => a.domain === domain && a.subdomain),
  }));
}
