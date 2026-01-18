import React from "react";
import Image from "next/image";

interface ThankYouHeroProps {
  entry: string;
  title: string;
  message: string;
  backgroundImageUrl: string;
}

export function ThankYouHero({
  entry,
  title,
  message,
  backgroundImageUrl,
}: ThankYouHeroProps) {
  return (
    <section className="relative h-[70vh] md:h-[500px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImageUrl}
          alt=""
          fill
          className="object-cover"
          data-cms-entry={entry}
          data-cms-field="backgroundImageUrl"
          data-cms-type="image"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6">
        <h1
          className="heading-h1 text-limestone mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
          data-cms-entry={entry}
          data-cms-field="title"
        >
          {title}
        </h1>
        <p
          className="body-m text-limestone/80 max-w-[600px] mx-auto"
          data-cms-entry={entry}
          data-cms-field="message"
        >
          {message}
        </p>
      </div>
    </section>
  );
}
