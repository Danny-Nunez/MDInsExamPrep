import type { SubscriptionStatus } from "@/lib/subscription";

export type SessionUser = {
  userId: string;
  email: string;
  name: string;
  hasSubscription: boolean;
};

export type UserDocument = {
  _id?: import("mongodb").ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  subscriptionStatus?: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionCurrentPeriodEnd?: Date;
};
