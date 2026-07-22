import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border-2 border-[#0A0A0A] px-2.5 py-1 text-xs font-bold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#CDF22B] text-[#0A0A0A] hover:bg-[#CDF22B]/90",
        lime: "bg-[#CDF22B] text-[#0A0A0A] hover:bg-[#CDF22B]/90",
        secondary: "bg-[#CDF22B] text-[#0A0A0A] hover:bg-[#CDF22B]/90",
        blue: "bg-[#1E45FB] text-white hover:bg-[#1E45FB]/90",
        white: "bg-white text-[#0A0A0A] hover:bg-white/90",
        black: "bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90",
        outline: "bg-transparent text-foreground hover:bg-muted",
        destructive: "bg-[#DC2626] text-white hover:bg-[#DC2626]/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
