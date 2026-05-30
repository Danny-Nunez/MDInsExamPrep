import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-emails";
import { isProtectedAppPath } from "@/lib/routes";

function getSecret(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  hasSubscription: boolean;
  isAdmin: boolean;
};

async function getSessionPayload(
  request: NextRequest
): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const secret = getSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }
    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      hasSubscription: payload.hasSubscription === true,
      isAdmin:
        payload.isAdmin === true || isAdminEmail(payload.email),
    };
  } catch {
    return null;
  }
}

function canAccessProtectedApp(session: SessionPayload): boolean {
  if (session.isAdmin || isAdminEmail(session.email)) return true;
  return session.hasSubscription;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedAppPath(pathname)) {
    return NextResponse.next();
  }

  const session = await getSessionPayload(request);
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "next",
      `${pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(loginUrl);
  }

  if (!canAccessProtectedApp(session)) {
    const subscribeUrl = new URL("/subscribe", request.url);
    return NextResponse.redirect(subscribeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/practice",
    "/practice/:path*",
    "/ai-quiz",
    "/ai-quiz/:path*",
    "/study-areas",
    "/study-areas/:path*",
    "/flashcards",
    "/flashcards/:path*",
    "/performance",
    "/performance/:path*",
    "/results",
    "/results/:path*",
    "/quiz",
    "/quiz/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
