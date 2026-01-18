import React from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import type { FooterContent } from "@/types/content";

interface FooterProps {
  content: FooterContent;
}

export function Footer({ content }: FooterProps) {
  return (
    <footer className="bg-charcoal px-[136px] py-10 w-full">
      {/* Logo Section */}
      <div className="border-b border-limestone/25 py-12 flex items-center justify-between">
        <div className="relative w-[184px] h-[138px]">
          <Image
            src={content.logoUrl}
            alt="Beckons"
            fill
            className="object-contain"
            data-cms-entry="global-footer"
            data-cms-field="logoUrl"
            data-cms-type="image"
          />
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-limestone/25 py-10 flex items-center gap-12">
        <div className="w-[310px]">
          <h4
            className="heading-h4 text-limestone capitalize"
            data-cms-entry="global-footer"
            data-cms-field="newsletterTitle"
          >
            {content.newsletterTitle}
          </h4>
        </div>
        <div className="flex-1">
          <p
            className="body-xs text-limestone max-w-[390px]"
            data-cms-entry="global-footer"
            data-cms-field="newsletterDescription"
          >
            {content.newsletterDescription}
          </p>
        </div>
        <Button
          href="/email-subscription"
          variant="primary"
          data-cms-entry="global-footer"
          data-cms-field="newsletterButtonText"
        >
          {content.newsletterButtonText}
        </Button>
      </div>

      {/* Portfolio Section */}
      <div className="py-10 flex gap-12">
        {/* Left Column - Title and Description */}
        <div className="flex-1 flex flex-col gap-6">
          <h4
            className="heading-h4 text-limestone capitalize"
            data-cms-entry="global-footer"
            data-cms-field="portfolioTitle"
          >
            {content.portfolioTitle}
          </h4>
          <p
            className="body-xs text-limestone max-w-[291px]"
            data-cms-entry="global-footer"
            data-cms-field="portfolioDescription"
          >
            {content.portfolioDescription}
          </p>
        </div>

        {/* Lodges Grid */}
        <div
          className="w-[810px] flex gap-12"
          data-cms-entry="global-footer"
          data-cms-field="lodges"
          data-cms-type="array"
        >
          {/* First Column - Australia */}
          {content.lodges.length > 0 && (
            <div className="flex-1 flex flex-col gap-6">
              {content.lodges
                .filter((c) => c.country === "Australia")
                .map((countryGroup, countryIndex) => (
                  <div key={countryGroup.country} className="flex flex-col gap-6">
                    <span
                      className="subheading-s text-limestone"
                      data-cms-entry="global-footer"
                      data-cms-field={`lodges[${countryIndex}].country`}
                    >
                      {countryGroup.country}
                    </span>
                    {countryGroup.lodges.map((lodge, lodgeIndex) => (
                      <div key={lodge.name} className="flex flex-col gap-3">
                        <span
                          className="heading-h5 text-limestone capitalize"
                          data-cms-entry="global-footer"
                          data-cms-field={`lodges[${countryIndex}].lodges[${lodgeIndex}].name`}
                        >
                          {lodge.name}
                        </span>
                        <span
                          className="subheading-s text-limestone-50"
                          style={{ fontWeight: 400 }}
                          data-cms-entry="global-footer"
                          data-cms-field={`lodges[${countryIndex}].lodges[${lodgeIndex}].location`}
                        >
                          {lodge.location.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          )}

          {/* Second Column - NZ, Canada, Chile */}
          <div className="flex-1 flex flex-col gap-6">
            {content.lodges
              .filter((c) => c.country !== "Australia")
              .map((countryGroup, countryIndex) => {
                const actualIndex = content.lodges.findIndex((l) => l.country === countryGroup.country);
                return (
                  <div key={countryGroup.country} className="flex flex-col gap-6">
                    <span
                      className="subheading-s text-limestone"
                      data-cms-entry="global-footer"
                      data-cms-field={`lodges[${actualIndex}].country`}
                    >
                      {countryGroup.country}
                    </span>
                    {countryGroup.lodges.map((lodge, lodgeIndex) => (
                      <div key={lodge.name} className="flex flex-col gap-3">
                        <span
                          className="heading-h5 text-limestone capitalize"
                          data-cms-entry="global-footer"
                          data-cms-field={`lodges[${actualIndex}].lodges[${lodgeIndex}].name`}
                        >
                          {lodge.name}
                        </span>
                        <span
                          className="subheading-s text-limestone-50"
                          style={{ fontWeight: 400 }}
                          data-cms-entry="global-footer"
                          data-cms-field={`lodges[${actualIndex}].lodges[${lodgeIndex}].location`}
                        >
                          {lodge.location.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </footer>
  );
}
