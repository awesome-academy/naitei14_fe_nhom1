"use client";

import { FormLabel as Label } from "@/src/components/ui/form";
import { cn } from "@/src/lib/utils";
import * as React from "react";

interface FormLabelProps extends React.ComponentProps<typeof Label> {
  required?: boolean;
}

// C006: Renamed to DisplayFormLabel
// C075: Added explicit return type React.JSX.Element
export function DisplayFormLabel({
  required,
  className,
  children,
  ...props
}: FormLabelProps): React.JSX.Element {
  return (
    <Label className={cn("flex gap-1 items-center", className)} {...props}>
      {children}
      {required && <span className="text-red-500">*</span>}
    </Label>
  );
}
