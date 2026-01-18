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
    <section className="bg-limestone px-[136px] py-9 flex items-center justify-between">
      {/* Diamond-shaped video/image mask */}
      <div className="relative w-[444px] h-[454px]">
        {/* The mask shape - this creates the clipping effect */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            data-cms-entry={entry}
            data-cms-field="videoMask.imageUrl"
            data-cms-type="image"
          />
        </div>
      </div>
    </section>
  );
}
