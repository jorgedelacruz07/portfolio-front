import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import classNames from "classnames";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary/12 text-primary hover:border-primary/35 hover:bg-primary/18",
        secondary:
          "border-white/10 bg-white/[0.04] text-foreground/80 hover:border-white/20 hover:bg-white/[0.08]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-white/10 bg-transparent text-foreground/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={classNames(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
