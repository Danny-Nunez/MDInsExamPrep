import Image from "next/image";
import Link from "next/link";
import { APP_NAME, APP_TAGLINE, LOGO_PATH } from "@/lib/branding";
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
    <div className="min-h-screen bg-stone-50">
      <LandingNav />
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src={LOGO_PATH}
                alt="Maryland state seal"
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
                priority
              />
            </Link>
            <p className="text-lg font-bold text-md-black">{APP_NAME}</p>
            <p className="text-sm text-stone-500">{APP_TAGLINE}</p>
            <h1 className="mt-4 text-2xl font-bold text-md-black">{title}</h1>
            <p className="mt-1 text-stone-600">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
