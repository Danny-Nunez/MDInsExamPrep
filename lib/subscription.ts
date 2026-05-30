import type { UserDocument } from "@/types/user";

export const FREE_SAMPLE_QUESTION_COUNT = 10;
export const SUBSCRIPTION_PRICE_LABEL = "$20/month";
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
