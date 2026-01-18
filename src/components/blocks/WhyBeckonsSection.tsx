"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DiamondShape, ChevronLeft, ChevronRight } from "../ui/icons";
import type { WhyBeckonsCard } from "@/types/content";

interface WhyBeckonsSectionProps {
  entry: string;
  title: string;
  description: string;
  cards: WhyBeckonsCard[];
}

export function WhyBeckonsSection({
  entry,
  title,
  description,
  cards,
}: WhyBeckonsSectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    setScrollPosition((prev) => Math.max(0, prev - 1));
  };

  const scrollRight = () => {
    setScrollPosition((prev) => Math.min(cards.length - 3, prev + 1));
  };

  return (
    <section className="bg-limestone py-[136px] px-[136px] flex flex-col gap-[104px]">
      {/* Header */}
      <div className="flex flex-col items-center gap-12 text-center">
        <h2
          className="heading-h2"
          data-cms-entry={entry}
          data-cms-field="whyBeckons.title"
        >
          {title}
        </h2>
        <p
          className="body-m text-body-75 max-w-[760px]"
          data-cms-entry={entry}
          data-cms-field="whyBeckons.description"
        >
          {description}
        </p>
      </div>

      {/* Cards Carousel */}
      <div className="flex flex-col gap-20">
        <div
          className="flex gap-4 overflow-hidden"
          data-cms-entry={entry}
          data-cms-field="whyBeckons.cards"
          data-cms-type="array"
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[378px] flex flex-col items-center gap-12 px-6"
              style={{
                transform: `translateX(-${scrollPosition * 394}px)`,
                transition: "transform 0.3s ease",
              }}
            >
              {/* Card Image with Diamond Overlay */}
              <div className="relative w-[330px] h-[407px] overflow-hidden flex items-center justify-center">
                <Image
                  src={card.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  data-cms-entry={entry}
                  data-cms-field={`whyBeckons.cards[${index}].imageUrl`}
                  data-cms-type="image"
                />
                {/* Diamond Overlay */}
                <div className="relative z-10">
                  <DiamondShape className="w-[104px] h-[104px]" color="#fff9ed" />
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-col items-center gap-6 text-center">
                <h3
                  className="subheading-m text-charcoal"
                  data-cms-entry={entry}
                  data-cms-field={`whyBeckons.cards[${index}].title`}
                >
                  {card.title}
                </h3>
                <p
                  className="body-xs text-body-75"
                  data-cms-entry={entry}
                  data-cms-field={`whyBeckons.cards[${index}].description`}
                >
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={scrollLeft}
            disabled={scrollPosition === 0}
            className="disabled:opacity-50"
            aria-label="Previous"
          >
            <ChevronLeft className="w-3 h-3" color="#1d1d1d" />
          </button>
          <button
            onClick={scrollRight}
            disabled={scrollPosition >= cards.length - 3}
            className="disabled:opacity-50"
            aria-label="Next"
          >
            <ChevronRight className="w-3 h-3" color="#1d1d1d" />
          </button>
        </div>
      </div>
    </section>
  );
}
