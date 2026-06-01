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

/** Path without hash or query — used for route guards */
export function normalizeAppPath(path: string): string {
  return path.split("#")[0].split("?")[0];
}

export function isProtectedAppPath(pathname: string): boolean {
  const base = normalizeAppPath(pathname);
  return PROTECTED_APP_PATHS.some(
    (p) => base === p || base.startsWith(`${p}/`)
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
  if (path === "/subscribe") return "/subscribe";
  // New accounts: subscribe after signup (default next is /dashboard)
  if (!next || normalizeAppPath(path) === "/dashboard") return "/subscribe";
  return path;
}
