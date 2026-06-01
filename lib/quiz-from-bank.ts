import { getApprovedQuizQuestions } from "@/lib/db/questions";
import { bankQuestionToQuiz } from "@/lib/bank-quiz";
import { expandQuizDomainsToBlueprint } from "@/lib/quiz-domain-map";
import type { BankQuizQuestion } from "@/types/question-bank";
import type { Difficulty, QuizQuestion } from "@/types/quiz";

export type QuizBankSampleOptions = {
  limit: number;
  weakAreas?: string[];
  subdomains?: string[];
  difficulty?: Difficulty;
  conceptIds?: string[];
};

const MAX_QUIZ_PULL = 60;

async function pullBank(
  opts: Omit<QuizBankSampleOptions, "limit"> & { limit: number },
  query: {
    subdomains?: string[];
    domains?: string[];
    conceptIds?: string[];
  }
): Promise<BankQuizQuestion[]> {
  return getApprovedQuizQuestions({
    limit: opts.limit,
    difficulty: opts.difficulty,
    subdomains: query.subdomains,
    domains: query.domains,
    conceptIds: query.conceptIds,
  });
}

/**
 * Sample approved MongoDB questions (newest bank). Tries subdomain → blueprint domain → any approved.
 */
export async function sampleQuizQuestionsFromBank(
  options: QuizBankSampleOptions
): Promise<BankQuizQuestion[]> {
  const limit = Math.min(Math.max(1, options.limit), MAX_QUIZ_PULL);
  const base = {
    limit,
    difficulty: options.difficulty,
    conceptIds: options.conceptIds,
  };

  const subdomains = (options.subdomains ?? []).filter(Boolean);
  if (subdomains.length > 0) {
    const bySubdomain = await pullBank(base, { subdomains });
    if (bySubdomain.length >= limit) return bySubdomain;
  }

  const blueprintDomains = expandQuizDomainsToBlueprint(
    options.weakAreas ?? []
  );
  if (blueprintDomains.length > 0) {
    const byDomain = await pullBank(base, { domains: blueprintDomains });
    if (byDomain.length >= limit) return byDomain;
    if (byDomain.length > 0) return byDomain;
  }

  return pullBank(base, {});
}

export async function buildQuizFromApprovedBank(
  options: QuizBankSampleOptions
): Promise<QuizQuestion[]> {
  const bank = await sampleQuizQuestionsFromBank(options);
  return bank.map(bankQuestionToQuiz);
}
