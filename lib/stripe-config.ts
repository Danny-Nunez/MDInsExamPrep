/** Read and validate STRIPE_PRICE_ID (rejects .env.example placeholder). */
export function getStripePriceId(): string | null {
  const raw = process.env.STRIPE_PRICE_ID?.trim();
  if (!raw) return null;
  if (raw === "price_..." || raw.includes("...")) return null;
  if (!/^price_[a-zA-Z0-9]+$/.test(raw)) return null;
  return raw;
}

export function stripePriceConfigError(): string {
  return (
    "STRIPE_PRICE_ID is missing or still set to the placeholder (price_...). " +
    "In Vercel → Settings → Environment Variables, set it to your real Price ID from " +
    "Stripe Dashboard → Products, then redeploy."
  );
}
