import Image from "next/image";
import { getExamGuideFeatureImage } from "@/lib/exam-guide-images";
import type { SeoGuidePage } from "@/lib/seo-guide-pages";

type ExamGuideHeroProps = {
  page: SeoGuidePage;
};

export default function ExamGuideHero({ page }: ExamGuideHeroProps) {
  const imageSrc = getExamGuideFeatureImage(page.slug);

  return (
    <div className="mt-6 flex flex-col gap-6 sm:mt-8 lg:flex-row lg:items-center lg:gap-10">
      {imageSrc && (
        <div className="relative mx-auto aspect-[16/10] w-full max-w-md shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md sm:max-w-lg lg:mx-0 lg:max-w-none lg:w-[min(40%,420px)] xl:w-[min(42%,460px)]">
          <Image
            src={imageSrc}
            alt={page.h1}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 90vw, 460px"
            priority
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-3xl font-bold tracking-tight text-md-black sm:text-4xl">
          {page.h1}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">{page.intro}</p>
      </div>
    </div>
  );
}
