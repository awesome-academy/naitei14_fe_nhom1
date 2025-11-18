import { cn } from "@/src/lib/utils";
import * as React from "react";

// C006: Renamed to RenderSkeleton
// C075: Added explicit return type React.JSX.Element
function RenderSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { RenderSkeleton as Skeleton };
