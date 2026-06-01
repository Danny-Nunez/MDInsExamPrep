import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/branding";

/** Canonical origin for sitemap.xml and robots.txt (production URL unless a public env override is set). */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (raw) {
    try {
      const url = new URL(raw);
      if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
        return url.origin;
      }
    } catch {
      // use SITE_URL
    }
  }
  return SITE_URL;
}

export function absoluteUrl(path: string): string {
  const base = getSiteOrigin();
  if (!path || path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

export type PublicSitemapPage = {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
};

/** Marketing and funnel pages to include in sitemap.xml */
export const PUBLIC_SITEMAP_PAGES: PublicSitemapPage[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/sample", changeFrequency: "weekly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/register", changeFrequency: "monthly", priority: 0.8 },
  { path: "/life-health", changeFrequency: "monthly", priority: 0.85 },
  { path: "/exam-questions", changeFrequency: "monthly", priority: 0.85 },
];

/** App, auth, checkout, and API paths — crawlable links may exist, but omit from index. */
export const ROBOTS_DISALLOW_PATHS = [
  "/api/",
  "/admin/",
  "/dashboard",
  "/account",
  "/subscribe",
  "/login",
  "/quiz",
  "/results",
  "/practice-test",
  "/practice",
  "/ai-quiz",
  "/flashcards",
  "/performance",
  "/study-areas",
];
