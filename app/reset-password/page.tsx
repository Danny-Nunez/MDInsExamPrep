"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <AuthLayout
        title="Invalid link"
        subtitle="This password reset link is missing or expired"
      >
        <p className="text-center text-sm text-stone-600">
          <Link href="/forgot-password" className="link-accent">
            Request a new reset link
          </Link>
        </p>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not reset password.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout
        title="Password updated"
        subtitle="You can sign in with your new password"
      >
        <p className="rounded-lg bg-green-50 px-3 py-3 text-center text-sm text-green-800">
          Redirecting you to sign in…
        </p>
        <p className="mt-4 text-center text-sm">
          <Link href="/login" className="link-accent">
            Sign in now
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Must be at least 8 characters"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            New password
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
        <div>
          <label
            htmlFor="confirm"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
          {loading ? "Updating..." : "Update password"}
        </button>
        <p className="text-center text-sm text-stone-600">
          <Link href="/login" className="link-accent">
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-stone-500">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
