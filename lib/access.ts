import { isAdminEmail } from "@/lib/admin-emails";
import type { SessionUser } from "@/types/user";

export function canAccessFullApp(user: SessionUser | null): boolean {
  if (!user) return false;
  if (isAdminEmail(user.email)) return true;
  return user.hasSubscription;
}
