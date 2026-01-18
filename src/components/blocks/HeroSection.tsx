"use client";

import React, { useState } from "react";
import Image from "next/image";
import { VolumeOff, VolumeOn } from "../ui/icons";

interface HeroSectionProps {
  entry: string;
  logoUrl: string;
  logoAlt: string;
  videoUrl?: string;
  posterUrl?: string;
}

export function HeroSection({
  entry,
  logoUrl,
  logoAlt,
  videoUrl,
  posterUrl,
}: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative h-[840px] w-full overflow-hidden">
      {/* Video/Image Background */}
      <div className="absolute inset-0">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={posterUrl}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : posterUrl ? (
          <Image
            src={posterUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
        ) : null}
      </div>

      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[420px] bg-gradient-to-b from-black/30 to-transparent scale-y-[-1]" />

      {/* Logo - Centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[300px] h-[225px]">
          <Image
            src={logoUrl || "/images/logo.svg"}
            alt={logoAlt || "Beckons"}
            fill
            className="object-contain"
            data-cms-entry={entry}
            data-cms-field="hero.logoUrl"
            data-cms-type="image"
            unoptimized={logoUrl?.endsWith('.svg')}
          />
        </div>
      </div>

      {/* Mute Button */}
      {videoUrl && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[38px] h-[38px] flex items-center justify-center"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeOff className="w-[18px] h-[18px]" color="#fff9ed" />
          ) : (
            <VolumeOn className="w-[18px] h-[18px]" color="#fff9ed" />
          )}
        </button>
      )}
    </section>
  );
}
