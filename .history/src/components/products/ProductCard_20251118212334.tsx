import type { Product } from "@/src/lib/api";
import ProductCardList from "./ProductCardList";
import ProductCardGrid from "./ProductCardGrid";
import ProductDiscountBadge from "./ProductDiscountBadge";
import * as React from "react";

interface ProductCardProps {
  product: Product;
  badge?: string;
  badgeColor?: string;
  viewMode?: "grid" | "list";
}

// C006: Renamed to DisplayProductCard
export default function DisplayProductCard({
  product,
  badge,
  badgeColor = "bg-yellow-500",
  viewMode = "grid",
}: ProductCardProps): React.JSX.Element {
  if (viewMode === "list") {
    return (
      <ProductCardList
        product={product}
        badge={badge}
        badgeColor={badgeColor}
      />
    );
  }

  return (
    <ProductCardGrid product={product} badge={badge} badgeColor={badgeColor} />
  );
}
