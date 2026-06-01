import type { MetadataRoute } from "next";
import {
  PUBLIC_SITEMAP_PAGES,
  absoluteUrl,
} from "@/lib/seo-sitemap";
import { getAllSeoGuideSlugs } from "@/lib/seo-guide-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const marketing = PUBLIC_SITEMAP_PAGES.map(
    ({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency,
      priority,
    })
  );

  const guides = getAllSeoGuideSlugs().map((slug) => ({
    url: absoluteUrl(`/${slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...marketing, ...guides];
}
