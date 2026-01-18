import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  type?: "button" | "submit";
  "data-cms-entry"?: string;
  "data-cms-field"?: string;
}

export function Button({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
  type = "button",
  ...cmsProps
}: ButtonProps) {
  const baseStyles = "button-text inline-flex items-center justify-center gap-3 px-4 py-4 transition-colors";

  const variantStyles = {
    primary: "bg-limestone text-charcoal border border-limestone hover:bg-limestone/90",
    secondary: "bg-burgundy text-limestone border border-burgundy hover:bg-burgundy/90",
    outline: "bg-transparent text-limestone border border-limestone hover:bg-limestone/10",
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedStyles} {...cmsProps}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedStyles} {...cmsProps}>
      {children}
    </button>
  );
}
