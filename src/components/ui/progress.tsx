import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  barClassName?: string;
}

function Progress({ className, value = 0, max = 100, barClassName, ...props }: ProgressProps) {
  const percentage = max > 0 && value ? (value / max) * 100 : 0;
  return (
    <ProgressPrimitive.Root data-slot="progress" className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)} {...props}>
      <ProgressPrimitive.Indicator data-slot="progress-indicator" className={cn("h-full w-full flex-1 bg-primary transition-all rounded-full", barClassName)} style={{ width: `${percentage}%` }} />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
