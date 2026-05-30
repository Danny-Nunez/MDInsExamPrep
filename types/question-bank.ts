export type ConceptStatus =
  | "ready_for_generation"
  | "in_progress"
  | "complete"
  | string;

export type QuestionStatus = "needs_review" | "approved" | "rejected";

import type { ObjectId } from "mongodb";

export type ConceptDocument = {
  _id?: ObjectId;
  blueprintConceptId: string;
  objectiveId: string;
  domain: string;
  subdomain: string;
  concept: string;
  objective: string;
  questionType: string;
  difficulty: string;
  examWeight: string;
  marylandSpecific: string;
  questionTarget: number;
  source: string;
  status: ConceptStatus;
  generationPrompt?: string;
};

export type QuestionDocument = {
  _id?: ObjectId;
  conceptId: string;
  domain: string;
  subdomain: string;
  concept: string;
  objective: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  questionType: string;
  status: QuestionStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProgressDocument = {
  _id?: ObjectId;
  userId: string;
  conceptId: string;
  attempts: number;
  correct: number;
  incorrect: number;
  masteryScore: number;
  lastPracticedAt: Date;
};

export type BankQuizQuestion = {
  id: string;
  conceptId: string;
  domain: string;
  subdomain: string;
  concept: string;
  objective: string;
  difficulty: string;
  questionType: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
};
