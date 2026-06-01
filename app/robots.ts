import type { MetadataRoute } from "next";
import {
  ROBOTS_DISALLOW_PATHS,
  getSiteOrigin,
} from "@/lib/seo-sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ROBOTS_DISALLOW_PATHS,
    },
    sitemap: `${getSiteOrigin()}/sitemap.xml`,
    host: getSiteOrigin(),
  };
}
