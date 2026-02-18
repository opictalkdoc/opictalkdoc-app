import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  default: "bg-primary-100 text-primary-800",
  secondary: "bg-surface-secondary text-foreground-secondary",
  accent: "bg-accent-100 text-accent-800",
  outline: "border border-border text-foreground-secondary bg-transparent",
  // OPIc 등급 뱃지
  al: "bg-opic-al/15 text-opic-al",
  ih: "bg-opic-ih/15 text-opic-ih",
  im1: "bg-opic-im1/15 text-opic-im1",
  im2: "bg-opic-im2/15 text-opic-im2",
  im3: "bg-opic-im3/15 text-opic-im3",
  il: "bg-opic-il/15 text-opic-il",
  nh: "bg-opic-nh/15 text-opic-nh",
  nm: "bg-opic-nm/15 text-opic-nm",
} as const;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variantStyles;
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-semibold",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge, type BadgeProps };
