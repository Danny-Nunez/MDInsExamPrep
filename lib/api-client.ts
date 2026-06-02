import type { CategoryPerformance, ExamAttempt, QuizQuestion } from "@/types/quiz";
import type { SessionUser } from "@/types/user";

export async function fetchCurrentUser(): Promise<SessionUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user ?? null;
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user?: SessionUser; error?: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error ?? "Login failed" };
  return { user: data.user };
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ user?: SessionUser; error?: string }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error ?? "Registration failed" };
  return { user: data.user };
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function refreshSession(): Promise<SessionUser | null> {
  const res = await fetch("/api/auth/refresh-session", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user ?? null;
}

export async function cancelSubscription(): Promise<{
  cancelAtPeriodEnd?: boolean;
  accessEndsAt?: string | null;
  error?: string;
}> {
  const res = await fetch("/api/account/subscription/cancel", {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error ?? "Could not cancel subscription." };
  return {
    cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    accessEndsAt: data.accessEndsAt ?? null,
  };
}

export async function updateProfileName(
  name: string
): Promise<{ user?: SessionUser; error?: string }> {
  const res = await fetch("/api/account/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error ?? "Could not update name." };
  return { user: data.user };
}

export async function startStripeCheckout(): Promise<{
  url?: string;
  error?: string;
}> {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error ?? "Checkout failed" };
  return { url: data.url };
}

export async function confirmStripeCheckout(sessionId: string): Promise<{
  user?: SessionUser;
  error?: string;
}> {
  const res = await fetch("/api/stripe/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ sessionId }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error ?? "Could not confirm payment" };
  return { user: data.user };
}

export async function fetchExamAttempts(): Promise<ExamAttempt[]> {
  const res = await fetch("/api/exams", { credentials: "include" });
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("Failed to load exams");
  const data = await res.json();
  return data.attempts ?? [];
}

export async function saveExamToServer(
  attempt: ExamAttempt,
  options?: {
    source?: "seed" | "ai";
    quizId?: string;
    questions?: QuizQuestion[];
  }
): Promise<boolean> {
  const res = await fetch("/api/exams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      attempt,
      source: options?.source,
      quizId: options?.quizId,
      questions: options?.questions,
    }),
  });
  return res.ok;
}

export async function fetchCategoryPerformance(): Promise<
  CategoryPerformance[]
> {
  const res = await fetch("/api/performance", { credentials: "include" });
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("Failed to load performance");
  const data = await res.json();
  return data.performance ?? [];
}
