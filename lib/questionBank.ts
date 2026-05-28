import rawBank from "@/data/maryland-question-bank.json";
import { MARYLAND_EXAM } from "@/types/quiz";
import type { Difficulty, QuizQuestion } from "@/types/quiz";

function normalizeQuestion(q: QuizQuestion): QuizQuestion {
  return {
    ...q,
    state: q.state ?? MARYLAND_EXAM.state,
    examType: q.examType ?? MARYLAND_EXAM.examType,
    difficulty: q.difficulty ?? "medium",
    sourceType: q.sourceType ?? "curated",
  };
}

export const QUESTION_BANK: QuizQuestion[] = (
  rawBank as unknown as QuizQuestion[]
).map(normalizeQuestion);

export type QuestionFilter = {
  domains?: string[];
  subdomains?: string[];
  difficulties?: Difficulty[];
  stateLawOnly?: boolean;
  excludeIds?: string[];
};

export function filterQuestions(filter: QuestionFilter = {}): QuizQuestion[] {
  const domainSet = filter.domains?.length
    ? new Set(filter.domains)
    : null;
  const subdomainSet = filter.subdomains?.length
    ? new Set(filter.subdomains)
    : null;
  const difficultySet = filter.difficulties?.length
    ? new Set(filter.difficulties)
    : null;
  const exclude = new Set(filter.excludeIds ?? []);

  return QUESTION_BANK.filter((q) => {
    if (exclude.has(q.id)) return false;
    if (domainSet && !domainSet.has(q.domain)) return false;
    if (subdomainSet && (!q.subdomain || !subdomainSet.has(q.subdomain)))
      return false;
    if (difficultySet && !difficultySet.has(q.difficulty)) return false;
    if (filter.stateLawOnly && !q.isStateLaw) return false;
    return true;
  });
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Pick questions with light domain balancing when count allows */
export function pickExamQuestions(
  count: number,
  filter: QuestionFilter = {}
): QuizQuestion[] {
  const pool = filterQuestions(filter);
  if (pool.length <= count) return shuffle(pool);

  const byDomain = new Map<string, QuizQuestion[]>();
  for (const q of pool) {
    const list = byDomain.get(q.domain) ?? [];
    list.push(q);
    byDomain.set(q.domain, list);
  }

  const domains = shuffle([...byDomain.keys()]);
  const picked: QuizQuestion[] = [];
  const used = new Set<string>();

  while (picked.length < count) {
    let added = false;
    for (const domain of domains) {
      if (picked.length >= count) break;
      const list = shuffle(byDomain.get(domain) ?? []);
      const next = list.find((q) => !used.has(q.id));
      if (next) {
        picked.push(next);
        used.add(next.id);
        added = true;
      }
    }
    if (!added) break;
  }

  if (picked.length < count) {
    for (const q of shuffle(pool)) {
      if (picked.length >= count) break;
      if (!used.has(q.id)) {
        picked.push(q);
        used.add(q.id);
      }
    }
  }

  return shuffle(picked).slice(0, count);
}

export function getBankStats() {
  const byDomain = new Map<string, number>();
  const byDifficulty = new Map<string, number>();
  let stateLaw = 0;

  for (const q of QUESTION_BANK) {
    byDomain.set(q.domain, (byDomain.get(q.domain) ?? 0) + 1);
    byDifficulty.set(
      q.difficulty,
      (byDifficulty.get(q.difficulty) ?? 0) + 1
    );
    if (q.isStateLaw) stateLaw++;
  }

  return {
    total: QUESTION_BANK.length,
    byDomain: Object.fromEntries(byDomain),
    byDifficulty: Object.fromEntries(byDifficulty),
    stateLaw,
  };
}
