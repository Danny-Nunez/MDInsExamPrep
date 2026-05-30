import type { Metadata } from "next";
import LandingNav from "@/components/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
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
    <div className="min-h-screen bg-stone-50">
      <LandingNav />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
