import React from "react";

interface IconProps {
  className?: string;
  color?: string;
}

export function ArrowRight({ className, color = "currentColor" }: IconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.33334 8H12.6667M12.6667 8L8.66668 4M12.6667 8L8.66668 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDown({ className, color = "currentColor" }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronLeft({ className, color = "currentColor" }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRight({ className, color = "currentColor" }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VolumeOff({ className, color = "currentColor" }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.25 3.75L4.5 6.75H1.5V11.25H4.5L8.25 14.25V3.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 6.75L12 11.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.75L16.5 11.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VolumeOn({ className, color = "currentColor" }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.25 3.75L4.5 6.75H1.5V11.25H4.5L8.25 14.25V3.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3025 3.6975C15.7086 5.10392 16.4984 7.01089 16.4984 9C16.4984 10.9891 15.7086 12.8961 14.3025 14.3025"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.655 6.345C12.3581 7.04831 12.7529 7.99879 12.7529 8.9925C12.7529 9.98621 12.3581 10.9367 11.655 11.64"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DiamondShape({ className, color = "currentColor" }: IconProps) {
  return (
    <svg
      className={className}
      width="104"
      height="104"
      viewBox="0 0 104 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="52"
        y="2.82843"
        width="69.5"
        height="69.5"
        rx="4"
        transform="rotate(45 52 2.82843)"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}

export function CompassLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M44 0L48.5 35.5L44 44L39.5 35.5L44 0Z"
        fill="currentColor"
      />
      <path
        d="M44 88L39.5 52.5L44 44L48.5 52.5L44 88Z"
        fill="currentColor"
      />
      <path
        d="M0 44L35.5 39.5L44 44L35.5 48.5L0 44Z"
        fill="currentColor"
      />
      <path
        d="M88 44L52.5 48.5L44 44L52.5 39.5L88 44Z"
        fill="currentColor"
      />
      <path
        d="M12.5 12.5L38 32L44 44L32 38L12.5 12.5Z"
        fill="currentColor"
      />
      <path
        d="M75.5 75.5L50 56L44 44L56 50L75.5 75.5Z"
        fill="currentColor"
      />
      <path
        d="M75.5 12.5L56 38L44 44L50 32L75.5 12.5Z"
        fill="currentColor"
      />
      <path
        d="M12.5 75.5L32 50L44 44L38 56L12.5 75.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
