import React from "react";
import Image from "next/image";

interface FormPageHeaderProps {
  entry: string;
  title: string;
  titleItalicPart?: string;
  subtitle: string;
  videoMaskImageUrl: string;
}

export function FormPageHeader({
  entry,
  title,
  titleItalicPart,
  subtitle,
  videoMaskImageUrl,
}: FormPageHeaderProps) {
  // Render title with italic part
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
    <div className="bg-limestone pt-16 md:pt-20 px-6 md:px-[136px] flex flex-col items-center gap-8 md:gap-16">
      {/* Diamond Video Mask */}
      <div className="relative w-[200px] h-[200px] md:w-[300px] md:h-[300px]">
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
        >
          <Image
            src={videoMaskImageUrl}
            alt=""
            fill
            className="object-cover"
            data-cms-entry={entry}
            data-cms-field="videoMaskImageUrl"
            data-cms-type="image"
          />
        </div>
      </div>

      {/* Title */}
      <h1
        className="heading-h2 text-center"
        data-cms-entry={entry}
        data-cms-field="title"
      >
        {renderTitle()}
      </h1>

      {/* Subtitle */}
      <p
        className="body-m text-body-75 text-center max-w-[500px]"
        data-cms-entry={entry}
        data-cms-field="subtitle"
      >
        {subtitle}
      </p>
    </div>
  );
}
