"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import LandingNav from "@/components/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHeroMockup from "@/components/landing/LandingHeroMockup";
import { HERO_BADGE } from "@/lib/branding";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessFullApp } from "@/lib/access";

const heroChecks = [
  "Maryland-focused",
  "Prometric-style questions",
  "AI-powered weak area tracking",
  "Personalized study quizzes",
];

const howItWorks = [
  {
    icon: ClipboardList,
    title: "Take a practice exam",
    description:
      "Start with realistic multiple-choice questions modeled after the Maryland Life & Health Producer exam.",
  },
  {
    icon: BarChart3,
    title: "Identify weak areas",
    description:
      "See performance by category and subdomain so you know exactly where to focus next.",
  },
  {
    icon: Sparkles,
    title: "Practice smarter with AI",
    description:
      "Generate focused quizzes on your weakest topics with scenario-based, exam-style questions.",
  },
];

const stats = [
  { icon: BookOpen, value: "1,200+", label: "Exam-style questions" },
  { icon: Target, value: "Adaptive", label: "Personalized weak-area tracking" },
  {
    icon: Sparkles,
    value: "Maryland",
    label: "Built for focused Maryland exam prep",
  },
  {
    icon: ClipboardList,
    value: "Prometric",
    label: "Scenario-based practice modes",
  },
];

const featureQuotes = [
  {
    icon: ClipboardList,
    quote:
      "Scenario questions use BEST-answer wording so you practice the way Prometric tests reasoning—not memorization alone.",
    title: "Prometric-style practice",
    subtitle: "Exam simulation & study modes",
  },
  {
    icon: BarChart3,
    quote:
      "Performance rolls up by Maryland blueprint domain and subdomain, so you see gaps by topic—not a single generic score.",
    title: "Blueprint performance",
    subtitle: "Weak-area tracking",
  },
  {
    icon: Sparkles,
    quote:
      "AI quizzes target your weakest subdomains with fresh items aligned to licensing objectives.",
    title: "AI study recommendations",
    subtitle: "Personalized quizzes",
  },
  {
    icon: BookOpen,
    quote:
      "Instant explanations in study mode help you learn why an answer is correct before you move on.",
    title: "Learn as you practice",
    subtitle: "Structured feedback",
  },
];

export default function LandingPage() {
  const { isLoggedIn, loading, user } = useAuth();

  const sampleExamHref = "/sample";
  const signupHref =
    !loading && isLoggedIn && user && canAccessFullApp(user)
      ? "/dashboard"
      : !loading && isLoggedIn
        ? "/subscribe"
        : "/register";

  return (
    <div className="min-h-screen bg-stone-50">
      <LandingNav />

      {/* Hero */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-16">
          <div>
            <div className="badge-md mb-5">{HERO_BADGE}</div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-md-black sm:text-5xl">
              Pass the Maryland Life &amp; Health Insurance Exam
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-stone-600">
              Practice with realistic Prometric-style questions, track your weakest
              topics, and generate AI-powered quizzes built around the Maryland
              licensing exam blueprint.
            </p>
            <div className="mt-8">
              <Link
                href={sampleExamHref}
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base"
              >
                Take a Sample Exam
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {heroChecks.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-stone-700"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-md-red" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <LandingHeroMockup />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Sparkles,
              title: "AI-Focused Quizzes",
              text: "Generate custom practice from your weakest subdomains.",
            },
            {
              icon: BarChart3,
              title: "Weak Area Tracking",
              text: "Performance by Maryland blueprint topic—not generic stats.",
            },
            {
              icon: ClipboardList,
              title: "Prometric-Style Exams",
              text: "Scenario-based questions with BEST-answer wording.",
            },
            {
              icon: BookOpen,
              title: "Study & Exam Modes",
              text: "Instant feedback in study mode; timed simulation for test day.",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-md-red-light text-md-red">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-md-black">{f.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-stone-200 bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-md-red">
            How it works
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold text-md-black sm:text-4xl">
            Your personalized path to passing
          </h2>

          <div id="practice" className="mt-12 grid gap-8 md:grid-cols-3">
            {howItWorks.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-md-red-light text-md-red">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-md-black">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            id="study-tools"
            className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-stone-200 bg-stone-50 px-5 py-6 text-center"
                >
                  <Icon className="mx-auto h-6 w-6 text-md-red" />
                  <p className="mt-3 text-2xl font-bold text-md-black">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews — feature-focused */}
      <section id="reviews" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-md-red">
          Built for licensing prep
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold text-md-black">
          Practice tools aligned to the Maryland exam
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featureQuotes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-md-red-light text-md-red">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-700">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-4 border-t border-stone-100 pt-4">
                  <p className="text-sm font-semibold text-md-black">
                    {item.title}
                  </p>
                  <p className="text-xs text-stone-500">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing / CTA */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-md-red px-6 py-10 sm:flex-row sm:px-10 sm:py-12">
          <div className="flex items-start gap-4 text-white">
            <Trophy className="mt-1 h-10 w-10 shrink-0 text-md-gold" />
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready to prepare for your Maryland licensing exam?
              </h2>
              <p className="mt-1 text-sm text-red-100">
                Start with a sample exam—no credit card required.
              </p>
            </div>
          </div>
          <Link
            href={signupHref}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-md-red shadow-lg transition hover:bg-stone-50"
          >
            Get started free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
