"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/Button";

interface StickyInquireButtonProps {
  entry: string;
  buttonText: string;
  href: string;
  variant?: "dynamic" | "secondary";
}

export function StickyInquireButton({
  entry,
  buttonText,
  href,
  variant = "dynamic",
}: StickyInquireButtonProps) {
  const [isOnDarkBackground, setIsOnDarkBackground] = useState(true);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run scroll detection for dynamic variant
    if (variant !== "dynamic") return;

    const checkBackground = () => {
      if (!buttonRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;

      // Find all sections and determine which one the button is over
      const sections = document.querySelectorAll("section");
      let onDark = false;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (buttonCenterY >= rect.top && buttonCenterY <= rect.bottom) {
          // Check if section has a dark background (hero or lodge carousel)
          // These sections have full-bleed images
          const hasImage = section.querySelector("img, video");

          // Check if it's a section with a background image (hero, carousel)
          if (
            hasImage &&
            section.querySelector(".absolute.inset-0 img, .absolute.inset-0 video")
          ) {
            onDark = true;
          }
        }
      });

      setIsOnDarkBackground(onDark);
    };

    // Check on scroll
    window.addEventListener("scroll", checkBackground);
    // Initial check
    checkBackground();

    return () => window.removeEventListener("scroll", checkBackground);
  }, [variant]);

  // Determine button variant
  const buttonVariant =
    variant === "secondary"
      ? "secondary"
      : isOnDarkBackground
        ? "outline"
        : "outlineDark";

  return (
    <div className="absolute top-0 right-0 bottom-0 pointer-events-none z-50">
      <div ref={buttonRef} className="sticky top-0 p-[24px] pointer-events-auto">
        <Button
          href={href}
          variant={buttonVariant}
          data-cms-entry={entry}
          data-cms-field="stickyButtonText"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
