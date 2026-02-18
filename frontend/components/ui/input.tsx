import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius-md)] border bg-surface px-3 py-2 text-sm",
          "placeholder:text-foreground-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-accent-500 focus-visible:ring-accent-500"
            : "border-border hover:border-border-hover",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, type InputProps };
