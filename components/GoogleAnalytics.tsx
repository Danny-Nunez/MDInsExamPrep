import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/branding";

/** Google Analytics (gtag.js) — loaded on all pages via root layout. */
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
