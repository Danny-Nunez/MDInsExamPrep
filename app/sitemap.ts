import type { MetadataRoute } from "next";
import { buildMetadataSitemap } from "@/lib/seo-sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildMetadataSitemap();
}
