import type { Metadata } from "next";
import LandingNav from "@/components/LandingNav";
import SiteFooter from "@/components/landing/SiteFooter";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/lib/branding";

export function marketingMetadata(
  title: string,
  description = SEO_DESCRIPTION
): Metadata {
  return {
    title: `${title} | Maryland Insurance Exam`,
    description,
  };
}

export { SEO_TITLE, SEO_DESCRIPTION };

export default function MarketingPageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <LandingNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:py-16">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
