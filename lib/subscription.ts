import type { UserDocument } from "@/types/user";

export const FREE_SAMPLE_QUESTION_COUNT = 10;
/** Score on the free sample that suggests the user is exam-ready */
export const SAMPLE_READY_THRESHOLD = 90;
/** Shown on pricing cards and checkout (billing interval in fine print only) */
export const SUBSCRIPTION_PRICE_AMOUNT = "$20";
export const SUBSCRIPTION_PRICE_LABEL = "$20/month";
export const SIGN_UP_CTA = "Sign up now";
export const CHECKOUT_CTA = "Continue to checkout";
export const SUBSCRIPTION_AMOUNT_CENTS = 2000;

export type SubscriptionStatus = "none" | "active" | "canceled" | "past_due";

export function userHasActiveSubscription(
  user: Pick<UserDocument, "subscriptionStatus" | "subscriptionCurrentPeriodEnd"> | null
): boolean {
  if (!user) return false;
  if (user.subscriptionStatus === "active") {
    if (
      user.subscriptionCurrentPeriodEnd &&
      user.subscriptionCurrentPeriodEnd < new Date()
    ) {
      return false;
    }
    return true;
  }
  return false;
}
