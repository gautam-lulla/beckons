import React from "react";
import { ArrowRight } from "./icons";

interface LinkWithArrowProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  "data-cms-entry"?: string;
  "data-cms-field"?: string;
}

export function LinkWithArrow({
  children,
  href,
  className = "",
  ...cmsProps
}: LinkWithArrowProps) {
  return (
    <a
      href={href}
      className={`link-text inline-flex items-center gap-3 ${className}`}
      {...cmsProps}
    >
      <span>{children}</span>
      <ArrowRight className="w-4 h-4" color="currentColor" />
    </a>
  );
}
