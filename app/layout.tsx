import type { Metadata } from "next";
import Providers from "@/components/Providers";
import { SEO_DESCRIPTION, SEO_TITLE, SITE_URL } from "@/lib/branding";
import "./globals.css";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/logo-no-title.png",
  },
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    siteName: "Maryland Insurance Exam",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
