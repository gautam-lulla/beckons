import React from "react";
import Image from "next/image";

interface VideoMaskSectionProps {
  entry: string;
  imageUrl: string;
  maskUrl: string;
}

export function VideoMaskSection({
  entry,
  imageUrl,
  maskUrl,
}: VideoMaskSectionProps) {
  return (
    <section className="bg-limestone px-6 md:px-[136px] py-6 md:py-[36px] flex items-center justify-center w-full">
      {/* Diamond-shaped video/image mask */}
      <div className="relative w-[280px] h-[286px] md:w-[444px] md:h-[454px] opacity-[0.92]">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-contain"
          data-cms-entry={entry}
          data-cms-field="videoMask.imageUrl"
          data-cms-type="image"
        />
      </div>
    </section>
  );
}
