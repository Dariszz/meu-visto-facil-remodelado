"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/cn";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max = 100, ...props }, ref) => {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current =
    value == null || !Number.isFinite(value)
      ? null
      : Math.min(limit, Math.max(0, value));
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className,
      )}
      {...props}
      value={current}
      max={limit}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-primary transition-transform",
          current === null && "animate-pulse opacity-50",
        )}
        style={{
          transform: `translateX(-${current === null ? 0 : 100 - (current / limit) * 100}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
