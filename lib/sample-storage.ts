export const SAMPLE_COMPLETED_KEY = "md_insurance_sample_completed";
export const SAMPLE_SCORE_KEY = "md_insurance_sample_score";

export function markSampleCompleted(scorePercent: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAMPLE_COMPLETED_KEY, "1");
  localStorage.setItem(SAMPLE_SCORE_KEY, String(scorePercent));
}

export function getSampleScore(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SAMPLE_SCORE_KEY);
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function hasCompletedSample(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SAMPLE_COMPLETED_KEY) === "1";
}
