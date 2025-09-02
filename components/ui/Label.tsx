// components/ui/Label.tsx
import { type LabelHTMLAttributes } from "react";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`block text-sm font-medium text-neutral-dark ${className}`}
      {...props}
    />
  );
}
