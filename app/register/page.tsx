"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCurrentUser } from "@/lib/api-client";
import { afterAuthRedirect } from "@/lib/routes";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isLoggedIn, loading: authLoading, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isLoggedIn && user) {
      router.replace(afterAuthRedirect(user, searchParams.get("next")));
    }
  }, [authLoading, isLoggedIn, user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const err = await register(name, email, password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    const current = await fetchCurrentUser();
    router.push(
      current
        ? afterAuthRedirect(current, searchParams.get("next"))
        : "/subscribe"
    );
    router.refresh();
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-stone-500">
        Loading...
      </div>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Subscribe after your free sample to unlock full exam prep"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Full name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-focus w-full rounded-lg border border-stone-200 px-3 py-2.5 text-md-black"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-stone-700"
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
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Password (min 8 characters)
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
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
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(searchParams.get("next") ?? "/subscribe")}`}
          className="link-accent"
        >
          Sign in
        </Link>
      </p>
      <p className="mt-3 text-center text-sm">
        <Link href="/" className="text-stone-500 hover:text-stone-700">
          ← Back to home
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-stone-500">
          Loading...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
