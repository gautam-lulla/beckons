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
    <section className="bg-limestone py-[136px] px-[136px] flex flex-col items-center gap-16">
      <h1
        className="heading-h1 text-center max-w-[900px]"
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
