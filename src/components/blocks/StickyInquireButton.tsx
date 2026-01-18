import React from "react";
import { Button } from "../ui/Button";

interface StickyInquireButtonProps {
  entry: string;
  buttonText: string;
  href: string;
}

export function StickyInquireButton({
  entry,
  buttonText,
  href,
}: StickyInquireButtonProps) {
  return (
    <div className="fixed top-6 right-6 z-50">
      <Button
        href={href}
        variant="outline"
        className="mix-blend-difference"
        data-cms-entry={entry}
        data-cms-field="stickyButtonText"
      >
        {buttonText}
      </Button>
    </div>
  );
}
