import { formatDisplayName } from "@/lib/format-display-name";
import { getAppUrl } from "@/lib/stripe";
import { sendMailerSendEmail } from "@/lib/email/mailersend";
import {
  passwordResetEmailHtml,
  passwordResetEmailText,
  subscriptionActiveEmailHtml,
  subscriptionActiveEmailText,
  welcomeEmailHtml,
  welcomeEmailText,
} from "@/lib/email/templates";
import { createPasswordResetToken } from "@/lib/email/password-reset-token";

const PLAN_NAME = "Maryland Life & Health Exam Prep";

function formatBillDate(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function sendWelcomeEmail(params: {
  email: string;
  name: string;
}): Promise<void> {
  const appUrl = getAppUrl();
  const displayName = formatDisplayName(params.name, params.email) ?? params.name;

  await sendMailerSendEmail({
    to: { email: params.email, name: displayName },
    subject: `Welcome to Maryland Insurance Exam, ${displayName.split(" ")[0]}!`,
    html: welcomeEmailHtml({
      name: displayName,
      dashboardUrl: `${appUrl}/dashboard`,
      subscribeUrl: `${appUrl}/subscribe`,
    }),
    text: welcomeEmailText({
      name: displayName,
      dashboardUrl: `${appUrl}/dashboard`,
      subscribeUrl: `${appUrl}/subscribe`,
    }),
  });
}

export async function sendPasswordResetEmail(params: {
  userId: string;
  email: string;
  name: string;
}): Promise<{ sent: boolean; error?: string }> {
  const appUrl = getAppUrl();
  const displayName = formatDisplayName(params.name, params.email) ?? params.name;
  const token = await createPasswordResetToken(params.userId, params.email);
  const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

  const result = await sendMailerSendEmail({
    to: { email: params.email, name: displayName },
    subject: "Reset your Maryland Insurance Exam password",
    html: passwordResetEmailHtml({ name: displayName, resetUrl }),
    text: passwordResetEmailText({ name: displayName, resetUrl }),
  });

  return { sent: result.ok, error: result.error };
}

export async function sendSubscriptionActiveEmail(params: {
  email: string;
  name: string;
  priceLabel: string;
  nextBillDate: Date | null;
}): Promise<void> {
  const appUrl = getAppUrl();
  const displayName = formatDisplayName(params.name, params.email) ?? params.name;

  await sendMailerSendEmail({
    to: { email: params.email, name: displayName },
    subject: "Your subscription is active — Maryland Insurance Exam",
    html: subscriptionActiveEmailHtml({
      name: displayName,
      planName: PLAN_NAME,
      priceLabel: params.priceLabel,
      nextBillDate: formatBillDate(params.nextBillDate),
      dashboardUrl: `${appUrl}/dashboard`,
    }),
    text: subscriptionActiveEmailText({
      name: displayName,
      planName: PLAN_NAME,
      priceLabel: params.priceLabel,
      nextBillDate: formatBillDate(params.nextBillDate),
      dashboardUrl: `${appUrl}/dashboard`,
    }),
  });
}

export function formatStripePriceLabel(
  unitAmountCents: number | null | undefined,
  interval: string | null | undefined
): string {
  if (unitAmountCents == null) return "$20/month";
  const dollars =
    unitAmountCents % 100 === 0
      ? String(unitAmountCents / 100)
      : (unitAmountCents / 100).toFixed(2);
  if (interval === "year") return `$${dollars}/year`;
  if (interval === "week") return `$${dollars}/week`;
  return `$${dollars}/month`;
}
