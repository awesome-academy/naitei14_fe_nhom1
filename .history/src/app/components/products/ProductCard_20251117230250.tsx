import type { Product } from "@/src/lib/api";
import ProductCardList from "./ProductCardList";
import ProductCardGrid from "./ProductCardGrid";
import ProductDiscountBadge from "./ProductDiscountBadge";

interface ProductCardProps {
  product: Product;
  badge?: string;
  badgeColor?: string;
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  badge,
  badgeColor = "bg-yellow-500",
  viewMode = "grid",
}: ProductCardProps) {
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
