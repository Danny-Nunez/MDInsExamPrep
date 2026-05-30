import type { SessionUser } from "@/types/user";

export function canAccessFullApp(user: SessionUser | null): boolean {
  if (!user) return false;
  if (user.isAdmin) return true;
  return user.hasSubscription;
}
