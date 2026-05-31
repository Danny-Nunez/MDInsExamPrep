"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { afterAuthRedirect } from "@/lib/routes";
import type { SessionUser } from "@/types/user";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn, loading: authLoading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isLoggedIn && user) {
      router.replace(afterAuthRedirect(user, searchParams.get("next")));
    }
  }, [authLoading, isLoggedIn, user, router, searchParams]);

  const redirectAfterAuth = (sessionUser: SessionUser) => {
    const dest = afterAuthRedirect(sessionUser, searchParams.get("next"));
    window.location.assign(dest);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await login(email, password);
    if (typeof result === "string") {
      setLoading(false);
      setError(result);
      return;
    }
    redirectAfterAuth(result);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your practice dashboard"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-focus w-full rounded-lg border border-stone-200 px-3 py-2.5 text-md-black"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-focus w-full rounded-lg border border-stone-200 px-3 py-2.5 text-md-black"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5 text-sm disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="link-accent">
          Create one free
        </Link>
      </p>
      <p className="mt-3 text-center text-sm">
        <Link href="/" className="text-slate-500 hover:text-slate-700">
          ← Back to home
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
