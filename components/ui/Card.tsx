// components/ui/Card.tsx
import { type HTMLAttributes } from "react";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 sm:p-8 ${className}`}
      {...props}
    />
  );
}