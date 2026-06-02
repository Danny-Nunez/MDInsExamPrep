"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CancelSubscriptionModal from "@/components/CancelSubscriptionModal";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessFullApp } from "@/lib/access";
import { cancelSubscription, updateProfileName } from "@/lib/api-client";
import { formatDisplayName } from "@/lib/format-display-name";
import { SIGN_UP_CTA } from "@/lib/subscription";
import type { SubscriptionStatus } from "@/lib/subscription";

type SubscriptionDetails = {
  planName: string;
  priceLabel: string;
  status: SubscriptionStatus;
  hasSubscription: boolean;
  nextBillDate: string | null;
  cancelAtPeriodEnd: boolean;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatBillDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function statusLabel(
  status: SubscriptionStatus,
  cancelAtPeriodEnd: boolean
): string {
  if (cancelAtPeriodEnd && status === "active") return "Canceling";
  switch (status) {
    case "active":
      return "Active";
    case "past_due":
      return "Past due";
    case "canceled":
      return "Canceled";
    default:
      return "No plan";
  }
}

async function fetchSubscriptionDetails(): Promise<SubscriptionDetails | null> {
  const res = await fetch("/api/account/subscription", { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

export default function AccountPage() {
  const { user, isLoggedIn, loading, logout, refresh } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(
    null
  );
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const loadSubscription = useCallback(async () => {
    setSubscriptionLoading(true);
    try {
      const data = await fetchSubscriptionDetails();
      setSubscription(data);
    } catch {
      setSubscription(null);
    } finally {
      setSubscriptionLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || loading) return;
    void loadSubscription();
  }, [isLoggedIn, loading, loadSubscription]);

  useEffect(() => {
    if (user?.name) {
      setNameInput(user.name);
    }
  }, [user?.name]);

  const handleSaveName = async () => {
    setNameSaving(true);
    setNameError(null);
    const result = await updateProfileName(nameInput);
    if (result.error) {
      setNameError(result.error);
      setNameSaving(false);
      return;
    }
    if (result.user) {
      setNameInput(result.user.name);
      await refresh();
    }
    setNameSaving(false);
    setIsEditingName(false);
  };

  const handleConfirmCancel = async () => {
    setCancelLoading(true);
    setCancelError(null);
    const result = await cancelSubscription();
    if (result.error) {
      setCancelError(result.error);
      setCancelLoading(false);
      return;
    }
    await refresh();
    await loadSubscription();
    setCancelLoading(false);
    setShowCancelModal(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[40vh] items-center justify-center text-stone-500">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-md px-4 py-10">
          <h1 className="text-2xl font-bold text-md-black">Account</h1>
          <p className="mt-2 text-stone-600">
            Sign in to save exams, track progress, and sync across devices.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="btn-primary px-6 py-3 text-center">
              Sign in
            </Link>
            <Link
              href="/register?next=/subscribe"
              className="btn-secondary px-6 py-3 text-center"
            >
              {SIGN_UP_CTA}
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const hasFullAccess = canAccessFullApp(user);
  const displayName =
    formatDisplayName(user.name, user.email) ?? user.name;
  const nextBill = formatBillDate(subscription?.nextBillDate ?? null);
  const showCancelButton =
    hasFullAccess &&
    !user.isAdmin &&
    subscription?.hasSubscription &&
    !subscription.cancelAtPeriodEnd;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-md px-4 py-8 sm:py-10">
        <h1 className="text-2xl font-bold text-md-black">Account</h1>

        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-md-black text-lg font-semibold text-md-gold">
              {getInitials(displayName)}
            </div>
            <div className="min-w-0 flex-1">
              {isEditingName ? (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="account-name"
                      className="mb-1 block text-xs font-medium text-stone-500"
                    >
                      Full name
                    </label>
                    <input
                      id="account-name"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      autoComplete="name"
                      placeholder="First Last"
                      className="input-focus w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-md-black"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={nameSaving || !nameInput.trim()}
                      className="btn-primary px-4 py-2 text-sm disabled:opacity-60"
                    >
                      {nameSaving ? "Saving…" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingName(false);
                        setNameError(null);
                        setNameInput(user.name);
                      }}
                      disabled={nameSaving}
                      className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                  {nameError && (
                    <p className="text-sm text-red-700">{nameError}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-md-black">{displayName}</p>
                    <p className="truncate text-sm text-stone-600">
                      {user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNameInput(user.name);
                      setNameError(null);
                      setIsEditingName(true);
                    }}
                    className="shrink-0 text-sm font-medium text-md-red hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
              {!isEditingName && (
                <p className="mt-2 text-xs text-stone-500">
                  Email cannot be changed here.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-stone-500">Your plan</p>
              <p className="mt-1 font-semibold text-md-black">
                {subscription?.planName ?? "Maryland Life & Health Exam Prep"}
              </p>
            </div>
            {hasFullAccess && (
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  subscription?.cancelAtPeriodEnd
                    ? "bg-amber-100 text-amber-900"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {statusLabel(
                  subscription?.status ?? "active",
                  subscription?.cancelAtPeriodEnd ?? false
                )}
              </span>
            )}
          </div>

          {subscriptionLoading ? (
            <p className="mt-4 text-sm text-stone-500">Loading plan details…</p>
          ) : hasFullAccess ? (
            <>
              <dl className="mt-4 space-y-3 border-t border-stone-100 pt-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-stone-500">Plan cost</dt>
                  <dd className="font-semibold text-md-black">
                    {subscription?.priceLabel ?? "$20/month"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-stone-500">
                    {subscription?.cancelAtPeriodEnd
                      ? "Access ends"
                      : "Next bill date"}
                  </dt>
                  <dd className="font-semibold text-md-black">
                    {nextBill ?? "—"}
                  </dd>
                </div>
              </dl>

              {subscription?.cancelAtPeriodEnd && nextBill && (
                <p className="mt-3 text-xs text-amber-800">
                  Your subscription is canceled. You keep full access until{" "}
                  {nextBill}, then your plan becomes inactive.
                </p>
              )}

              {showCancelButton && (
                <button
                  type="button"
                  onClick={() => {
                    setCancelError(null);
                    setShowCancelModal(true);
                  }}
                  className="mt-4 w-full rounded-lg border border-stone-300 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel subscription
                </button>
              )}

              {cancelError && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {cancelError}
                </p>
              )}
            </>
          ) : (
            <div className="mt-4 border-t border-stone-100 pt-4">
              <p className="text-sm text-stone-600">
                Subscribe for full practice exams, progress tracking, and focused
                study sets.
              </p>
              <Link
                href="/subscribe"
                className="btn-primary mt-4 block w-full py-3 text-center text-sm"
              >
                Subscribe for full access
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="mt-6 w-full rounded-xl border border-stone-300 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          Sign out
        </button>
      </div>

      <CancelSubscriptionModal
        open={showCancelModal}
        accessEndsLabel={nextBill}
        loading={cancelLoading}
        onClose={() => {
          if (!cancelLoading) setShowCancelModal(false);
        }}
        onConfirm={handleConfirmCancel}
      />
    </DashboardLayout>
  );
}
