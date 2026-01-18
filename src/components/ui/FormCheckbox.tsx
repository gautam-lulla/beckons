"use client";

import React from "react";

interface FormCheckboxProps {
  name: string;
  value: string;
  label: string;
  type?: "checkbox" | "radio";
  required?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  "data-cms-entry"?: string;
  "data-cms-field"?: string;
}

export function FormCheckbox({
  name,
  value,
  label,
  type = "checkbox",
  required = false,
  checked,
  onChange,
  ...cmsProps
}: FormCheckboxProps) {
  const [isChecked, setIsChecked] = React.useState(checked || false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    onChange?.(e);
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative w-5 h-5">
        <input
          type={type}
          name={name}
          value={value}
          required={required}
          checked={type === "radio" ? undefined : isChecked}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer peer"
        />
        {/* Outer box - 20x20px with 1px border */}
        <div className="w-5 h-5 border border-charcoal" />
        {/* Inner filled square - 12x12px, 4px inset */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-charcoal opacity-0 peer-checked:opacity-100 transition-opacity" />
      </div>
      <span className="body-xs text-charcoal" {...cmsProps}>
        {label}
      </span>
    </label>
  );
}
