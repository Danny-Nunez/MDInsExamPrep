import Image from "next/image";
import Link from "next/link";
import { APP_NAME, APP_TAGLINE_SHORT, LOGO_ALT, LOGO_PATH } from "@/lib/branding";
import SiteFooter from "@/components/landing/SiteFooter";
import LandingNav from "./LandingNav";

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <LandingNav />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src={LOGO_PATH}
                alt={LOGO_ALT}
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
                priority
              />
            </Link>
            <p className="text-lg font-bold text-md-black">{APP_NAME}</p>
            <p className="text-sm text-stone-500">{APP_TAGLINE_SHORT}</p>
            <h1 className="mt-4 text-2xl font-bold text-md-black">{title}</h1>
            <p className="mt-1 text-stone-600">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
