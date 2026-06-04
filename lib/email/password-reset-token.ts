import { SignJWT, jwtVerify } from "jose";

const PURPOSE = "password-reset";

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not defined");
  }
  return new TextEncoder().encode(secret);
}

export async function createPasswordResetToken(
  userId: string,
  email: string
): Promise<string> {
  return new SignJWT({ userId, email, purpose: PURPOSE })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getSecret());
}

export async function verifyPasswordResetToken(
  token: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      payload.purpose !== PURPOSE ||
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}
