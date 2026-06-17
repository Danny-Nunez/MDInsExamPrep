import Image from "next/image";

export default function LandingMacbookDashboard() {
  return (
    <div className="landing-dashboard-showcase w-full max-w-full">
      <Image
        src="/macbook.png"
        alt="Maryland Insurance Exam student dashboard showing exam readiness and weak areas"
        width={1400}
        height={900}
        className="h-auto w-full max-w-full"
        sizes="(max-width: 1024px) 100vw, 55vw"
        priority
        style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.12))" }}
      />
    </div>
  );
}
