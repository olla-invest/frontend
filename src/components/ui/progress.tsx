import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  barClassName?: string;
}

function Progress({ className, value, barClassName, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root data-slot="progress" className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)} {...props}>
      <ProgressPrimitive.Indicator data-slot="progress-indicator" className={cn("h-full w-full flex-1 bg-primary transition-all rounded-full", barClassName)} style={{ width: `${value}%` }} />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
