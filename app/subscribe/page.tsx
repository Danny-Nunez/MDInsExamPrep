"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import LandingNav from "@/components/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { useAuth } from "@/contexts/AuthContext";
import { refreshSession, startStripeCheckout } from "@/lib/api-client";
import { canAccessFullApp } from "@/lib/access";
import { getSampleScore } from "@/lib/sample-storage";
import {
  FREE_SAMPLE_QUESTION_COUNT,
  SUBSCRIPTION_PRICE_LABEL,
} from "@/lib/subscription";

const features = [
  {
    icon: ClipboardList,
    title: "Unlimited practice exams",
    description: "Study and timed exam modes with Prometric-style questions.",
  },
  {
    icon: BarChart3,
    title: "Blueprint performance",
    description: "Track weak areas by Maryland licensing domain.",
  },
  {
    icon: Sparkles,
    title: "AI weak-area quizzes",
    description: "Generate focused quizzes on your lowest-scoring topics.",
  },
  {
    icon: BookOpen,
    title: "Full question bank access",
    description: "1,200+ curated items plus MongoDB-backed admin content.",
  },
];

function SubscribeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, refresh, isLoggedIn } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sampleScore, setSampleScore] = useState<number | null>(null);

  const success = searchParams.get("success") === "1";
  const canceled = searchParams.get("canceled") === "1";

  useEffect(() => {
    setSampleScore(getSampleScore());
  }, []);

  const syncAfterPayment = useCallback(async () => {
    setError(null);
    for (let attempt = 0; attempt < 10; attempt++) {
      const refreshed = await refreshSession();
      if (refreshed && canAccessFullApp(refreshed)) {
        await refresh();
        router.replace("/dashboard");
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    setError(
      "Payment received, but your account is still activating. Wait a minute and refresh this page, or sign out and back in."
    );
  }, [refresh, router]);

  useEffect(() => {
    if (!loading && user && canAccessFullApp(user)) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (success && isLoggedIn) {
      void syncAfterPayment();
    }
  }, [success, isLoggedIn, syncAfterPayment]);

  const handleSubscribe = async () => {
    setError(null);
    if (!isLoggedIn) {
      router.push("/register?next=/subscribe");
      return;
    }
    setCheckoutLoading(true);
    const result = await startStripeCheckout();
    setCheckoutLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <LandingNav />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-md-black sm:text-4xl">
            Unlock full Maryland exam prep
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            You&apos;ve tried the free {FREE_SAMPLE_QUESTION_COUNT}-question
            sample. Subscribe for unlimited practice, AI quizzes, and performance
            tracking — {SUBSCRIPTION_PRICE_LABEL}, cancel anytime.
          </p>
        </div>

        {sampleScore != null && (
          <div className="mt-8 max-w-md rounded-xl border border-md-red/20 bg-md-red-light px-5 py-4">
            <p className="text-sm font-semibold text-md-black">
              Your sample score: {sampleScore}%
            </p>
            <p className="mt-1 text-sm text-stone-600">
              Keep building on that baseline with unlimited exams and weak-area
              drills.
            </p>
          </div>
        )}

        {success && (
          <p className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
            Payment received — activating your account…
          </p>
        )}
        {canceled && (
          <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Checkout canceled. You can subscribe whenever you&apos;re ready.
          </p>
        )}
        {error && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <ul className="space-y-4">
            {features.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <Icon className="h-6 w-6 shrink-0 text-md-red" />
                <div>
                  <p className="font-semibold text-md-black">{title}</p>
                  <p className="mt-1 text-sm text-stone-600">{description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm lg:sticky lg:top-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-md-red">
              Full access
            </p>
            <p className="mt-2 text-4xl font-bold text-md-black">
              {SUBSCRIPTION_PRICE_LABEL}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-stone-700">
              {[
                "Unlimited practice & timed exams",
                "AI quizzes on weak subdomains",
                "Performance dashboard",
                "Cancel anytime via Stripe",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-md-red" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={checkoutLoading || loading}
              className="btn-primary mt-8 w-full py-3 disabled:opacity-60"
            >
              {checkoutLoading
                ? "Redirecting to checkout…"
                : isLoggedIn
                  ? `Subscribe — ${SUBSCRIPTION_PRICE_LABEL}`
                  : "Create account & subscribe"}
            </button>
            {!isLoggedIn && !loading && (
              <p className="mt-4 text-center text-sm text-stone-600">
                Already have an account?{" "}
                <Link href="/login?next=/subscribe" className="link-accent">
                  Sign in
                </Link>
              </p>
            )}
            <p className="mt-6 text-center text-sm">
              <Link href="/sample" className="text-stone-500 hover:text-stone-700">
                ← Retake free sample
              </Link>
            </p>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-stone-500">
          Loading...
        </div>
      }
    >
      <SubscribeContent />
    </Suspense>
  );
}
