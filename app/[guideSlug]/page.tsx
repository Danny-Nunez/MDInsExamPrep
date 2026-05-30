import { notFound } from "next/navigation";
import SeoGuidePageLayout, {
  seoGuideMetadata,
} from "@/components/landing/SeoGuidePageLayout";
import {
  getAllSeoGuideSlugs,
  getSeoGuidePage,
} from "@/lib/seo-guide-pages";

type PageProps = {
  params: Promise<{ guideSlug: string }>;
};

export async function generateStaticParams() {
  return getAllSeoGuideSlugs().map((guideSlug) => ({ guideSlug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { guideSlug } = await params;
  const page = getSeoGuidePage(guideSlug);
  if (!page) return {};
  return seoGuideMetadata(page);
}

export default async function SeoGuidePage({ params }: PageProps) {
  const { guideSlug } = await params;
  const page = getSeoGuidePage(guideSlug);
  if (!page) notFound();
  return <SeoGuidePageLayout page={page} />;
}
