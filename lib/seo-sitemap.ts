import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/branding";
import { EXAM_GUIDE_GROUPS } from "@/lib/exam-guide-nav";
import {
  getCourseHtmlSitemapLinks,
  getCourseLessonHtmlSitemapLinks,
  getCourseSitemapPaths,
} from "@/lib/course";
import { getAllSeoGuideSlugs } from "@/lib/seo-guide-pages";

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
  label: string;
  changeFrequency: ChangeFrequency;
  priority: number;
};

/** Marketing and funnel pages included in sitemap.xml and the HTML sitemap. */
export const PUBLIC_SITEMAP_PAGES: PublicSitemapPage[] = [
  { path: "/", label: "Home", changeFrequency: "weekly", priority: 1 },
  {
    path: "/sample",
    label: "Free 10-question sample",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/practice-test",
    label: "Maryland practice test",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  { path: "/pricing", label: "Pricing", changeFrequency: "monthly", priority: 0.9 },
  {
    path: "/register",
    label: "Create account",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/life-health",
    label: "Life & Health exam prep",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/exam-questions",
    label: "Exam questions overview",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/free-maryland-insurance-course",
    label: "Free Maryland Insurance Course",
    changeFrequency: "weekly",
    priority: 0.9,
  },
];

export type HtmlSitemapSection = {
  title: string;
  links: { label: string; href: string }[];
};

/** Sections for the public HTML sitemap page (matches sitemap.xml URLs). */
export function getHtmlSitemapSections(): HtmlSitemapSection[] {
  const marketing: HtmlSitemapSection = {
    title: "Main pages",
    links: PUBLIC_SITEMAP_PAGES.map((p) => ({
      label: p.label,
      href: p.path,
    })),
  };

  const courseModules: HtmlSitemapSection = {
    title: "Free Maryland Insurance Course — modules",
    links: getCourseHtmlSitemapLinks(),
  };

  const courseLessons: HtmlSitemapSection = {
    title: "Free Maryland Insurance Course — lessons",
    links: getCourseLessonHtmlSitemapLinks(),
  };

  const guides: HtmlSitemapSection[] = EXAM_GUIDE_GROUPS.map((group) => ({
    title: group.title,
    links: group.links.map((link) => ({
      label: link.label,
      href: link.href,
    })),
  }));

  return [marketing, courseModules, courseLessons, ...guides];
}

/** Total indexable URLs (marketing + course + exam guides). */
export function getPublicSitemapUrlCount(): number {
  return (
    PUBLIC_SITEMAP_PAGES.length +
    getCourseSitemapPaths().length +
    getAllSeoGuideSlugs().length
  );
}

/** Build entries for Next.js MetadataRoute.Sitemap (sitemap.xml). */
export function buildMetadataSitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const marketing = PUBLIC_SITEMAP_PAGES.map(
    ({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency,
      priority,
    })
  );

  const course = getCourseSitemapPaths().map((path) => {
    const isModule = path.split("/").length === 3;
    return {
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: isModule ? 0.75 : 0.65,
    };
  });

  const guides = getAllSeoGuideSlugs().map((slug) => ({
    url: absoluteUrl(`/${slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...marketing, ...course, ...guides];
}

/** App, auth, checkout, and API paths — crawlable links may exist, but omit from index. */
export const ROBOTS_DISALLOW_PATHS = [
  "/api/",
  "/admin/",
  "/dashboard",
  "/account",
  "/subscribe",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/quiz",
  "/results",
  "/practice",
  "/ai-quiz",
  "/flashcards",
  "/performance",
  "/study-areas",
];
