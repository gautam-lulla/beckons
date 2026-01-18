"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "../ui/icons";
import type { LodgeCarouselItem } from "@/types/content";

interface LodgeCarouselProps {
  entry: string;
  title: string;
  lodges: LodgeCarouselItem[];
}

export function LodgeCarousel({ entry, title, lodges }: LodgeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentLodge = lodges[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? lodges.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === lodges.length - 1 ? 0 : prev + 1));
  };

  if (!currentLodge) return null;

  return (
    <section className="relative h-[600px] md:h-[800px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          key={`lodge-image-${currentIndex}`}
          src={currentLodge.imageUrl}
          alt={currentLodge.name}
          fill
          className="object-cover"
          data-cms-entry={entry}
          data-cms-field={`lodgeCarousel.lodges[${currentIndex}].imageUrl`}
          data-cms-type="image"
          priority
        />
        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      {/* Title at top */}
      <div className="absolute top-16 left-0 right-0 text-center">
        <h2
          className="heading-h2 text-limestone"
          data-cms-entry={entry}
          data-cms-field="lodgeCarousel.title"
        >
          {title}
        </h2>
      </div>

      {/* Navigation Controls - positioned at edges */}
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-charcoal/75 p-2"
        aria-label="Previous lodge"
      >
        <ChevronLeft className="w-6 h-6" color="#fff9ed" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-charcoal/75 p-2"
        aria-label="Next lodge"
      >
        <ChevronRight className="w-6 h-6" color="#fff9ed" />
      </button>

      {/* Lodge Info */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-8 text-center px-6">
        {/* Lodge Icon */}
        {currentLodge.iconUrl && (
          <div className="w-[88px] h-[88px] relative">
            <Image
              src={currentLodge.iconUrl}
              alt=""
              fill
              className="object-contain"
              data-cms-entry={entry}
              data-cms-field={`lodgeCarousel.lodges[${currentIndex}].iconUrl`}
              data-cms-type="image"
            />
          </div>
        )}

        {/* Lodge Details */}
        <div className="flex flex-col items-center gap-8">
          <h3
            className="heading-h3 text-limestone capitalize"
            data-cms-entry={entry}
            data-cms-field={`lodgeCarousel.lodges[${currentIndex}].name`}
          >
            {currentLodge.name}
          </h3>
          <div className="flex flex-col items-center gap-3">
            <span
              className="subheading-m text-limestone"
              data-cms-entry={entry}
              data-cms-field={`lodgeCarousel.lodges[${currentIndex}].region`}
            >
              {currentLodge.region}
            </span>
            <span
              className="subheading-m text-limestone-50"
              style={{ fontWeight: 400 }}
              data-cms-entry={entry}
              data-cms-field={`lodgeCarousel.lodges[${currentIndex}].country`}
            >
              {currentLodge.country}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
