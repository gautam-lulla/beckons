import React from "react";
import { LinkWithArrow } from "../ui/LinkWithArrow";

interface AboutSectionProps {
  entry: string;
  title: string;
  titleItalicPart?: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
}

export function AboutSection({
  entry,
  title,
  titleItalicPart,
  body,
  ctaText,
  ctaUrl,
}: AboutSectionProps) {
  // Split title to render italic part
  const renderTitle = () => {
    if (!titleItalicPart) {
      return title;
    }

    const parts = title.split(titleItalicPart);
    return (
      <>
        {parts[0]}
        <em className="font-normal italic">{titleItalicPart}</em>
        {parts[1]}
      </>
    );
  };

  return (
    <section className="bg-limestone py-[136px] px-[136px] flex flex-col items-center gap-12">
      <div className="flex flex-col items-center gap-[72px] text-center">
        <h2
          className="heading-h2"
          data-cms-entry={entry}
          data-cms-field="about.title"
        >
          {renderTitle()}
        </h2>
        <div
          className="body-m text-body-75 max-w-[760px]"
          data-cms-entry={entry}
          data-cms-field="about.body"
          dangerouslySetInnerHTML={{ __html: body.replace(/\n\n/g, "</p><p class='mb-4'>").replace(/^/, "<p class='mb-4'>").replace(/$/, "</p>") }}
        />
      </div>
      <LinkWithArrow
        href={ctaUrl}
        data-cms-entry={entry}
        data-cms-field="about.ctaText"
      >
        {ctaText}
      </LinkWithArrow>
    </section>
  );
}
