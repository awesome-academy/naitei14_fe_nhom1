import { Badge } from "@/src/components/ui/badge";
import * as React from "react";

interface ProductDiscountBadgeProps {
  discount?: number;
}

export default function DisplayProductDiscountBadge({
  discount,
}: ProductDiscountBadgeProps): React.JSX.Element | null {
  if (!discount) return null;
  return (
    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
      -{discount}%
    </Badge>
  );
}
