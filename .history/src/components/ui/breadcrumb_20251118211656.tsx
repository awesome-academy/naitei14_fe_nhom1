import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/src/lib/utils";

// C075: Added explicit return type JSX.Element
function Breadcrumb({ ...props }: React.ComponentProps<"nav">): JSX.Element {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

// C075: Added explicit return type JSX.Element
function BreadcrumbList({
  className,
  ...props
}: React.ComponentProps<"ol">): JSX.Element {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  );
}

// C075: Added explicit return type JSX.Element
function BreadcrumbItem({
  className,
  ...props
}: React.ComponentProps<"li">): JSX.Element {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

// C075: Added explicit return type JSX.Element
function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}): JSX.Element {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
}

// C075: Added explicit return type JSX.Element
function BreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<"span">): JSX.Element {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  );
}

// C075: Added explicit return type JSX.Element
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">): JSX.Element {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

// C075: Added explicit return type JSX.Element
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">): JSX.Element {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
