import { canAccessFullApp } from "@/lib/access";
import type { SessionUser } from "@/types/user";

/** App routes that require a signed-in session */
export const PROTECTED_APP_PATHS = [
  "/dashboard",
  "/practice",
  "/ai-quiz",
  "/study-areas",
  "/flashcards",
  "/performance",
  "/results",
  "/quiz",
  "/admin",
] as const;

export function isProtectedAppPath(pathname: string): boolean {
  return PROTECTED_APP_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function loginWithRedirect(nextPath: string): string {
  const next = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
  return `/login?next=${encodeURIComponent(next)}`;
}

/** Validate post-login redirect from query string */
export function safeRedirectPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  if (next.startsWith("/login") || next.startsWith("/register")) {
    return "/dashboard";
  }
  return next;
}

/** Where to send the user after login/register */
export function afterAuthRedirect(
  user: SessionUser,
  next: string | null
): string {
  if (user.isAdmin) return "/dashboard";

  const path = safeRedirectPath(next);
  if (canAccessFullApp(user)) {
    if (path === "/subscribe") return "/dashboard";
    return path;
  }
  if (isProtectedAppPath(path)) return "/subscribe";
  return path;
}
