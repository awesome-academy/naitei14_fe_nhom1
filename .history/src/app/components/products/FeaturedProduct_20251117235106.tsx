"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
// This import is correct, assuming your interfaces are exported from '@/src/lib/api'
import type { FeaturedProduct as FeaturedProductType } from "@/src/lib/api";
import { ShoppingCart } from "lucide-react";

interface CountdownItemProps {
  value: number;
  label: string;
}

// Function to format the price to VND (Vietnamese Dong)
const formatPriceVND = (price: number | undefined): string => {
  if (price === undefined || price === null) return "";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(price)
    .replace("₫", "");
};

// Component nhỏ để hiển thị từng mục trong countdown
const CountdownItem = ({ value, label }: CountdownItemProps) => (
  <div>
    <div className="font-bold text-yellow-600 text-base lg:text-lg">
      {/* Ensure countdown values are two digits */}
      {String(value).padStart(2, "0")}
    </div>
    <div className="text-gray-600">{label}</div>
  </div>
);

interface FeaturedProductProps {
  product: FeaturedProductType;
}

export default function FeaturedProduct({ product }: FeaturedProductProps) {
  // Unimplemented API/cart logic remains commented out

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 lg:p-8 max-w-sm lg:max-w-md mx-auto text-center">
      <Badge className="bg-yellow-500 text-black mb-4 text-xs lg:text-sm">
        SALE
      </Badge>
      <Image
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        width={200}
        height={300}
        className="mx-auto mb-4 w-32 lg:w-48 h-auto"
      />
      <h3 className="text-lg lg:text-xl font-bold mb-2 line-clamp-2">
        {product.name}
      </h3>
      <div className="flex justify-center items-center gap-2 mb-4">
        {/* APPLY FORMATTING TO CURRENT PRICE */}
        <span className="text-xl lg:text-2xl font-bold text-yellow-600">
          {formatPriceVND(product.price)}
        </span>
        <span className="text-sm">đ</span>
        {product.originalPrice && (
          // APPLY FORMATTING TO ORIGINAL PRICE
          <span className="text-sm text-gray-500 line-through">
            {formatPriceVND(product.originalPrice)}đ
          </span>
        )}
      </div>
      <Link href={`/products/${product.id}`}>
        <Button className="bg-black text-white hover:bg-gray-800 w-full mb-4 text-sm lg:text-base">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Xem chi tiết
        </Button>
      </Link>
      <div className="grid grid-cols-4 gap-1 lg:gap-2 text-center text-xs lg:text-sm">
        <CountdownItem value={product.countdown.days} label="DAYS" />
        <CountdownItem value={product.countdown.hours} label="HOURS" />
        <CountdownItem value={product.countdown.minutes} label="MINS" />
        <CountdownItem value={product.countdown.seconds} label="SECS" />
      </div>
    </div>
  );
}
