import React from "react";
import { LinkWithArrow } from "../ui/LinkWithArrow";

interface IntroSectionProps {
  entry: string;
  headline: string;
  ctaText: string;
  ctaUrl: string;
}

export function IntroSection({
  entry,
  headline,
  ctaText,
  ctaUrl,
}: IntroSectionProps) {
  return (
    <section className="bg-limestone py-16 md:py-[136px] px-6 md:px-[136px] flex flex-col items-center gap-8 md:gap-16">
      <h1
        className="font-heading text-[32px] md:text-[56px] leading-[1.1] text-heading-primary text-center max-w-[600px] md:max-w-[700px]"
        data-cms-entry={entry}
        data-cms-field="intro.headline"
      >
        {headline}
      </h1>
      <LinkWithArrow
        href={ctaUrl}
        data-cms-entry={entry}
        data-cms-field="intro.ctaText"
      >
        {ctaText}
      </LinkWithArrow>
    </section>
  );
}
