"use client";

import { useState } from "react";
import Link from "next/link";
import MarketingPageShell from "@/components/landing/MarketingPageShell";
import { SUPPORT_EMAIL } from "@/lib/branding";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const honeypot = (
      form.elements.namedItem("website") as HTMLInputElement | null
    )?.value;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, website: honeypot }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setSuccess(data.message);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-md-black">Contact us</h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Questions about exam prep, your account, or subscriptions? Send us a
          message and we&apos;ll reply to{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="link-accent">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>

        {success ? (
          <div className="mt-8 space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
              {success}
            </p>
            <p className="text-sm text-stone-600">
              <Link href="/" className="link-accent">
                Back to home
              </Link>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
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
                name="email"
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
                htmlFor="subject"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-focus w-full rounded-lg border border-stone-200 px-3 py-2.5 text-md-black"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-focus w-full resize-y rounded-lg border border-stone-200 px-3 py-2.5 text-md-black"
              />
            </div>

            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

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
              {loading ? "Sending..." : "Send message"}
            </button>
          </form>
        )}
      </div>
    </MarketingPageShell>
  );
}
