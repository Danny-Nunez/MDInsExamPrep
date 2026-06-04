import type { SubscriptionStatus } from "@/lib/subscription";

export type SessionUser = {
  userId: string;
  email: string;
  name: string;
  /** Paid subscriber (Stripe). Admins bypass via isAdmin without paying. */
  hasSubscription: boolean;
  isAdmin: boolean;
};

export type UserRole = "admin" | "user";

export type UserDocument = {
  _id?: import("mongodb").ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  role?: UserRole;
  createdAt: Date;
  subscriptionStatus?: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionCurrentPeriodEnd?: Date;
  /** Avoid duplicate subscription confirmation emails */
  subscriptionConfirmationEmailSubId?: string;
};
