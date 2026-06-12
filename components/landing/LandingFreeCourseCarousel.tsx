"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COURSE_BASE_PATH } from "@/lib/course/constants";
import { LANDING_MODULE_CAROUSEL_ITEMS } from "@/lib/course/landing-module-carousel";

export default function LandingFreeCourseCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 420);
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="free-course"
      className="border-b border-stone-200 bg-stone-50 py-16 sm:py-20"
      aria-labelledby="free-course-carousel-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-md-red">
              Free Maryland Insurance Course
            </p>
            <h2
              id="free-course-carousel-heading"
              className="mt-2 text-3xl font-bold text-md-black sm:text-4xl"
            >
              15 modules. 100+ lessons. Start free.
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-stone-600">
              A structured video course aligned to the Maryland Life &amp; Health
              licensing exam — track progress with a free account.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:bg-stone-100"
                aria-label="Scroll modules left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:bg-stone-100"
                aria-label="Scroll modules right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <Link
              href={COURSE_BASE_PATH}
              className="btn-primary whitespace-nowrap px-5 py-2.5 text-sm"
            >
              View full course
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-8 flex gap-5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {LANDING_MODULE_CAROUSEL_ITEMS.map((item) => (
            <Link
              key={item.moduleNumber}
              href={item.href}
              className="group w-[360px] shrink-0 snap-start sm:w-[400px] lg:w-[420px]"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow group-hover:border-md-red/25 group-hover:shadow-md">
                <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-stone-100">
                  <Image
                    src={item.imageSrc}
                    alt={`Module ${item.moduleNumber}: ${item.title}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 360px, 420px"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-md-black/75 px-2.5 py-1 text-xs font-semibold text-white">
                    {item.lessonCount} lesson{item.lessonCount === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-md-black group-hover:text-md-red">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                    {item.description}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
