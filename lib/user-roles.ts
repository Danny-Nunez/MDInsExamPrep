import { isAdminEmail } from "@/lib/admin-emails";
import type { UserDocument } from "@/types/user";

export function userIsAdmin(
  user: Pick<UserDocument, "email" | "role">
): boolean {
  if (user.role === "admin") return true;
  return isAdminEmail(user.email);
}
