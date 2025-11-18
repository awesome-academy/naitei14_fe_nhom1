import { cn } from "@/src/lib/utils";
import * as React from "react";

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
