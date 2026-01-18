import React from "react";

interface EditableProps {
  entry: string;
  field: string;
  type?: "text" | "richtext" | "image" | "array";
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}

export function Editable({
  entry,
  field,
  type,
  as: Tag = "span",
  className,
  children,
}: EditableProps) {
  return (
    <Tag
      className={className}
      data-cms-entry={entry}
      data-cms-field={field}
      {...(type && { "data-cms-type": type })}
    >
      {children}
    </Tag>
  );
}

// Convenience components for common use cases
export function EditableText({
  entry,
  field,
  as = "span",
  className,
  children,
}: Omit<EditableProps, "type">) {
  return (
    <Editable entry={entry} field={field} type="text" as={as} className={className}>
      {children}
    </Editable>
  );
}

export function EditableRichText({
  entry,
  field,
  className,
  children,
}: Omit<EditableProps, "type" | "as">) {
  return (
    <Editable entry={entry} field={field} type="richtext" as="div" className={className}>
      {children}
    </Editable>
  );
}

interface EditableImageProps {
  entry: string;
  field: string;
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function EditableImage({
  entry,
  field,
  src,
  alt,
  className,
  width,
  height,
}: EditableImageProps) {
  return (
    <img
      data-cms-entry={entry}
      data-cms-field={field}
      data-cms-type="image"
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  );
}
