import { DOMAINS } from "@/types/quiz";
import type { ExamImageWeakArea } from "@/types/quiz";

/** Prometric / MIA score report section labels → dashboard study domains */
const PROMETRIC_LABEL_TO_STUDY_DOMAIN: Record<string, string> = {
  Annuities: "Life Insurance",
  "Life Insurance": "Life Insurance",
  "Life Insurance Basics": "Life Insurance",
  "Life Insurance Policies": "Life Insurance",
  "Federal Tax Considerations for Life Insurance and Annuities":
    "Life Insurance",
  "Health Insurance Basics": "Health Insurance",
  "Group Health Insurance": "Health Insurance",
  "Individual Health Insurance Policy General Provisions": "Health Insurance",
  "Dental Insurance": "Health Insurance",
  "Disability Income and Related Insurance": "Health Insurance",
  "Federal Tax Considerations for Health Insurance": "Health Insurance",
  "Accident and Health Insurance": "Health Insurance",
  "Medical Plans": "Health Insurance",
  "Long-Term Care": "Health Insurance",
  "Medicare and Medicaid": "Health Insurance",
  "General Insurance": "General Insurance Concepts",
  "Insurance Regulation": "Maryland Insurance Regulations",
  "Maryland Insurance Regulations": "Maryland Insurance Regulations",
};

const STUDY_DOMAINS = new Set<string>(DOMAINS);
const PASSING_SCORE_PERCENT = 70;

export function mapPrometricLabelToStudyDomain(label: string): string {
  const trimmed = label.trim();
  if (PROMETRIC_LABEL_TO_STUDY_DOMAIN[trimmed]) {
    return PROMETRIC_LABEL_TO_STUDY_DOMAIN[trimmed];
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.includes("annuit") ||
    (lower.includes("life") && lower.includes("insurance"))
  ) {
    return "Life Insurance";
  }
  if (
    lower.includes("health") ||
    lower.includes("dental") ||
    lower.includes("disability") ||
    lower.includes("medicare") ||
    lower.includes("medicaid") ||
    lower.includes("sickness")
  ) {
    return "Health Insurance";
  }
  if (lower.includes("regulation") || lower.includes("maryland")) {
    return "Maryland Insurance Regulations";
  }
  if (lower.includes("general insurance")) {
    return "General Insurance Concepts";
  }

  return STUDY_DOMAINS.has(trimmed) ? trimmed : "General Insurance Concepts";
}

export function buildPrometricScoreReportPrompt(): string {
  return `You are reading a Maryland Insurance Administration / Prometric official score report image for the Life, Accident, Health & Sickness Producer exam.

Your job is to transcribe the "performance by domain" breakdown exactly as printed, then identify weak sections.

Step 1 — Read every domain row visible on the report with:
- reportDomain: exact label text as shown (e.g. "Annuities", "General Insurance", "Health Insurance Basics")
- scorePercent: integer 0-100 from the report

Step 2 — Weak sections are any domain with scorePercent below ${PASSING_SCORE_PERCENT}.

Step 3 — For each weak section, set "domain" to the best matching study area:
${DOMAINS.join(", ")}

Mapping guide:
- Annuities, Life Insurance, Federal Tax (Life/Annuities) → Life Insurance
- Health Insurance Basics, Group Health, Dental, Disability, Federal Tax (Health), Individual Health provisions → Health Insurance
- General Insurance → General Insurance Concepts
- Insurance Regulation / Maryland rules → Maryland Insurance Regulations

Return strict JSON only:
{
  "overallScore": 66,
  "passed": false,
  "summary": "1-2 sentences mentioning overall score and that they did not pass",
  "domainScores": [
    { "reportDomain": "Annuities", "scorePercent": 50 }
  ],
  "weakAreas": [
    {
      "reportDomain": "Annuities",
      "scorePercent": 50,
      "domain": "Life Insurance",
      "confidence": 0.9,
      "issue": "Scored 50% on Annuities (below ${PASSING_SCORE_PERCENT}% threshold).",
      "recommendation": "One concrete study action for this section."
    }
  ]
}

Rules:
- reportDomain must match visible report text — do NOT invent generic labels like "Life Insurance" unless that exact text appears
- Include ALL domains with scorePercent < ${PASSING_SCORE_PERCENT}, up to 8
- Never duplicate the same reportDomain in weakAreas
- confidence is 0-1 for how clearly you read that row
- If a row is unreadable, omit it
- Do not include markdown`;
}

type RawWeakArea = {
  reportDomain?: string;
  scorePercent?: number;
  domain?: string;
  confidence?: number;
  issue?: string;
  recommendation?: string;
};

type RawAiResponse = {
  summary?: string;
  overallScore?: number;
  passed?: boolean;
  domainScores?: { reportDomain?: string; scorePercent?: number }[];
  weakAreas?: RawWeakArea[];
};

export function parsePrometricScoreReportResponse(content: string): {
  summary: string;
  weakAreas: ExamImageWeakArea[];
} {
  const trimmed = content.trim();
  const jsonStr = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    : trimmed;

  const parsed = JSON.parse(jsonStr) as RawAiResponse;
  if (!parsed.summary || typeof parsed.summary !== "string") {
    throw new Error("Invalid summary in AI response");
  }

  const seen = new Set<string>();
  const weakAreas: ExamImageWeakArea[] = [];

  const candidates: RawWeakArea[] = [];

  if (Array.isArray(parsed.weakAreas) && parsed.weakAreas.length > 0) {
    candidates.push(...parsed.weakAreas);
  } else if (Array.isArray(parsed.domainScores)) {
    for (const row of parsed.domainScores) {
      const reportDomain = String(row.reportDomain ?? "").trim();
      const scorePercent = Number(row.scorePercent);
      if (!reportDomain || Number.isNaN(scorePercent)) continue;
      if (scorePercent >= PASSING_SCORE_PERCENT) continue;
      candidates.push({
        reportDomain,
        scorePercent,
        domain: mapPrometricLabelToStudyDomain(reportDomain),
        confidence: 0.85,
        issue: `Scored ${scorePercent}% on ${reportDomain} (below ${PASSING_SCORE_PERCENT}% threshold).`,
        recommendation: `Review ${reportDomain} with focused practice questions and course lessons.`,
      });
    }
  }

  for (const raw of candidates) {
    const reportDomain = String(raw.reportDomain ?? raw.domain ?? "").trim();
    if (!reportDomain || seen.has(reportDomain)) continue;

    const scorePercent =
      raw.scorePercent != null && !Number.isNaN(Number(raw.scorePercent))
        ? Math.round(Number(raw.scorePercent))
        : undefined;

    const domain = STUDY_DOMAINS.has(String(raw.domain ?? ""))
      ? String(raw.domain)
      : mapPrometricLabelToStudyDomain(reportDomain);

    const issue =
      String(raw.issue ?? "").trim() ||
      (scorePercent != null
        ? `Scored ${scorePercent}% on ${reportDomain} (below ${PASSING_SCORE_PERCENT}% threshold).`
        : `Weak performance on ${reportDomain}.`);

    const recommendation =
      String(raw.recommendation ?? "").trim() ||
      `Focus study on ${reportDomain} with practice questions in ${domain}.`;

    if (!issue || !recommendation) continue;

    seen.add(reportDomain);
    weakAreas.push({
      domain,
      reportDomain,
      scorePercent,
      confidence: Math.max(
        0,
        Math.min(1, Number(raw.confidence ?? 0.8))
      ),
      issue,
      recommendation,
    });

    if (weakAreas.length >= 8) break;
  }

  return {
    summary: parsed.summary.trim(),
    weakAreas,
  };
}

export function weakAreaDisplayLabel(area: ExamImageWeakArea): string {
  if (area.reportDomain) {
    return area.scorePercent != null
      ? `${area.reportDomain} (${area.scorePercent}%)`
      : area.reportDomain;
  }
  return area.domain;
}
