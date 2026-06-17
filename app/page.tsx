"use client";

import LandingNav from "@/components/LandingNav";
import LandingDashboardSection from "@/components/landing/LandingDashboardSection";
import LandingHero from "@/components/landing/LandingHero";
import LandingWhyDifferentSection from "@/components/landing/LandingWhyDifferentSection";
import LandingSiteBottom from "@/components/landing/LandingSiteBottom";
import LandingUploadScoreSection from "@/components/landing/LandingUploadScoreSection";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { isLoggedIn, loading, user } = useAuth();

  const sampleExamHref = "/sample";
  const uploadHref =
    !loading && isLoggedIn
      ? "/dashboard#upload"
      : "/register?next=%2Fdashboard%23upload";

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <LandingNav />

      <LandingHero sampleHref={sampleExamHref} />

      <LandingDashboardSection />

      <LandingUploadScoreSection ctaHref={uploadHref} />

      <LandingWhyDifferentSection />

      <LandingSiteBottom />
    </div>
  );
}
