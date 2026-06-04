"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { ExamGuideCarouselItem } from "@/lib/exam-guide-images";

type ExamGuideRelatedCarouselProps = {
  items: ExamGuideCarouselItem[];
};

export default function ExamGuideRelatedCarousel({
  items,
}: ExamGuideRelatedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 400);
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-12 border-t border-stone-200 pt-10" aria-labelledby="related-guides-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id="related-guides-heading"
            className="text-xl font-bold text-md-black sm:text-2xl"
          >
            More exam guides
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Explore other Maryland licensing topics
          </p>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:bg-stone-50"
            aria-label="Scroll guides left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:bg-stone-50"
            aria-label="Scroll guides right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-6 flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="group w-[280px] shrink-0 snap-start sm:w-[300px] lg:w-[320px]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-sm transition-shadow group-hover:border-md-red/30 group-hover:shadow-md">
              {item.imageSrc ? (
                <Image
                  src={item.imageSrc}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="320px"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-stone-200 px-4 text-center text-xs font-medium text-stone-500">
                  {item.label}
                </div>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-sm font-semibold text-stone-800 group-hover:text-md-red">
              {item.label}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
