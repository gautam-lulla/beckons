"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { ChevronDown } from "../ui/icons";
import type { FooterContent } from "@/types/content";

interface FooterProps {
  content: FooterContent;
  variant?: "dark" | "burgundy";
}

function CountryAccordion({
  country,
  lodges,
  isOpen,
  onToggle,
  index,
}: {
  country: string;
  lodges: Array<{ name: string; location: string }>;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div className="border-b border-limestone/25">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between"
      >
        <span
          className="subheading-s text-limestone"
          data-cms-entry="global-footer"
          data-cms-field={`lodges[${index}].country`}
        >
          {country.toUpperCase()}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          color="#fff9ed"
        />
      </button>
      {isOpen && (
        <div className="pb-4 flex flex-col gap-4">
          {lodges.map((lodge, lodgeIndex) => (
            <div key={lodge.name} className="flex flex-col gap-1">
              <span
                className="heading-h5 text-limestone capitalize"
                data-cms-entry="global-footer"
                data-cms-field={`lodges[${index}].lodges[${lodgeIndex}].name`}
              >
                {lodge.name}
              </span>
              <span
                className="subheading-s text-limestone-50"
                style={{ fontWeight: 400 }}
                data-cms-entry="global-footer"
                data-cms-field={`lodges[${index}].lodges[${lodgeIndex}].location`}
              >
                {lodge.location.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Footer({ content, variant = "dark" }: FooterProps) {
  const bgColor = variant === "burgundy" ? "bg-burgundy" : "bg-charcoal";
  const [openCountry, setOpenCountry] = useState<string | null>("Australia");

  return (
    <footer className={`${bgColor} px-6 md:px-[136px] py-10 w-full`}>
      {/* Logo Section */}
      <div className="border-b border-limestone/25 py-8 md:py-12 flex items-center justify-center md:justify-start">
        <div className="relative w-[140px] h-[105px] md:w-[184px] md:h-[138px]">
          <Image
            src={content.logoUrl}
            alt={content.logoAlt || ""}
            fill
            className="object-contain"
            data-cms-entry="global-footer"
            data-cms-field="logoUrl"
            data-cms-type="image"
          />
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-limestone/25 py-8 md:py-10 flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="md:w-[200px] text-center md:text-left">
          <h4
            className="heading-h4 text-limestone capitalize"
            data-cms-entry="global-footer"
            data-cms-field="newsletterTitle"
          >
            {content.newsletterTitle}
          </h4>
        </div>
        <div className="flex-1 flex justify-center">
          <p
            className="body-xs text-limestone max-w-[450px] text-center md:text-left"
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
      <div className="py-8 md:py-10 flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left Column - Title and Description */}
        <div className="flex-1 flex flex-col gap-4 md:gap-6">
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

        {/* Lodges - Desktop: Grid, Mobile: Accordion */}
        {/* Desktop View */}
        <div
          className="hidden md:flex w-[810px] gap-12"
          data-cms-entry="global-footer"
          data-cms-field="lodges"
          data-cms-type="array"
        >
          {/* First Column - Australia */}
          {content.lodges.length > 0 && (
            <div className="flex-1 flex flex-col gap-6">
              {content.lodges
                .filter((c) => c.country === "Australia")
                .map((countryGroup) => {
                  const countryIndex = content.lodges.findIndex(
                    (l) => l.country === countryGroup.country
                  );
                  return (
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
                  );
                })}
            </div>
          )}

          {/* Second Column - NZ, Canada, Chile */}
          <div className="flex-1 flex flex-col gap-6">
            {content.lodges
              .filter((c) => c.country !== "Australia")
              .map((countryGroup) => {
                const actualIndex = content.lodges.findIndex(
                  (l) => l.country === countryGroup.country
                );
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

        {/* Mobile View - Accordion */}
        <div className="md:hidden flex flex-col w-full">
          {content.lodges.map((countryGroup, index) => (
            <CountryAccordion
              key={countryGroup.country}
              country={countryGroup.country}
              lodges={countryGroup.lodges}
              isOpen={openCountry === countryGroup.country}
              onToggle={() =>
                setOpenCountry(
                  openCountry === countryGroup.country ? null : countryGroup.country
                )
              }
              index={index}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
