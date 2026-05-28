import { normalizeDomainLabel } from "@/lib/domainMigration";
import { DOMAINS, WEAK_THRESHOLD } from "@/types/quiz";
import type { CategoryPerformance } from "@/types/quiz";

export function isWeakArea(percentage: number): boolean {
  return percentage < WEAK_THRESHOLD;
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 75) return "bg-green-500";
  if (percentage >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function getScoreTextColor(percentage: number): string {
  if (percentage >= 75) return "text-green-600";
  if (percentage >= 60) return "text-amber-600";
  return "text-red-600";
}

export function getStatusLabel(percentage: number): {
  label: string;
  className: string;
} {
  if (percentage >= 75) {
    return { label: "Good", className: "bg-green-100 text-green-700" };
  }
  if (percentage >= 60) {
    return {
      label: "Needs Improvement",
      className: "bg-amber-100 text-amber-700",
    };
  }
  return { label: "Needs Improvement", className: "bg-amber-100 text-amber-700" };
}

export function mergeCategoryPerformance(
  existing: CategoryPerformance[],
  domainScores: {
    domain: string;
    subdomain?: string;
    correct: number;
    total: number;
  }[]
): CategoryPerformance[] {
  const map = new Map<string, { correct: number; total: number }>();

  for (const d of DOMAINS) {
    map.set(d, { correct: 0, total: 0 });
  }

  for (const cat of existing) {
    const domain = normalizeDomainLabel(cat.domain);
    const entry = map.get(domain) ?? { correct: 0, total: 0 };
    map.set(domain, {
      correct: entry.correct + cat.correct,
      total: entry.total + cat.total,
    });
  }

  for (const ds of domainScores) {
    const domain = normalizeDomainLabel(ds.domain);
    const entry = map.get(domain) ?? { correct: 0, total: 0 };
    map.set(domain, {
      correct: entry.correct + ds.correct,
      total: entry.total + ds.total,
    });
  }

  return DOMAINS.map((domain) => {
    const { correct, total } = map.get(domain) ?? { correct: 0, total: 0 };
    return {
      domain,
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  });
}

export function getWeakestAreas(
  performance: CategoryPerformance[],
  limit = 6
): CategoryPerformance[] {
  return [...performance]
    .filter((p) => p.total > 0)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, limit);
}
