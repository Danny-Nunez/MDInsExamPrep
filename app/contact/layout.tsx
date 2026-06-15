import type { Metadata } from "next";
import { marketingMetadata } from "@/components/landing/MarketingPageShell";
import { SUPPORT_EMAIL } from "@/lib/branding";

export const metadata: Metadata = marketingMetadata(
  "Contact",
  `Get in touch with Maryland Insurance Exam support at ${SUPPORT_EMAIL}.`
);

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
