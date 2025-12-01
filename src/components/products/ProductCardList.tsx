"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { ChartColumnStacked, Heart, ShoppingCart } from "lucide-react";
import type { Product as ApiProduct } from "@/src/lib/api";
import { formatCurrency } from "@/src/utils/currency";
import ProductDiscountBadge from "./ProductDiscountBadge";
import StarRating from "./StarRating";
import * as React from "react";

interface ProductCardListProps {
  product: ApiProduct;
  badge?: string;
  badgeColor?: string;
}

export default function DisplayProductCardList({
  product,
  badge,
  badgeColor = "bg-yellow-500",
}: ProductCardListProps): React.JSX.Element {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card className="group overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/3">
          <Link href={`/products/${product.id}`} className="block">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-52 object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          {badge && (
            <Badge
              className={`absolute top-2 right-2 ${badgeColor} text-black`}
            >
              {badge}
            </Badge>
          )}
          <ProductDiscountBadge discount={product.discount} />
        </div>
        <CardContent className="p-4 md:w-2/3 flex flex-col justify-between">
          <div>
            <StarRating
              rating={product.rating}
              reviews={product.reviews}
              className="mb-1"
            />
            <Link href={`/products/${product.id}`}>
              <h3 className="font-medium text-base mb-2 hover:text-yellow-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-yellow-600">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-black hover:bg-gray-800 text-white text-sm"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Thêm vào giỏ
              </Button>
              <Button
                className="bg-black hover:bg-gray-800 text-white text-sm"
                onClick={() => {}}
              >
                <ChartColumnStacked className="w-4 h-4 mr-2" />
                Thêm vào so sánh
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-md w-10 h-10"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
