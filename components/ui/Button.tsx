// components/ui/Button.tsx
import { type ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "accent";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const baseClasses =
    "w-full text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50";
  const variantClasses = {
    primary: "bg-primary hover:bg-blue-800",
    accent: "bg-accent hover:bg-orange-600",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
