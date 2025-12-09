import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import ProductCard from "@/src/components/products/ProductCard";
import ProductCardSkeleton from "@/src/components/products/ProductCardSkeleton";
import { UI_TEXT } from "@/src/constants/ui";
import type { Product } from "@/src/lib/api";

interface NewProductsSectionProps {
  products: Product[];
  title?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  badge?: string;
  badgeColor?: string;
}

export default function NewProductsSection({
  products,
  title = UI_TEXT.NEW_PRODUCTS,
  imageUrl = "/Image_Rudu/title-dark.png",
  buttonText = UI_TEXT.VIEW_ALL_PRODUCTS,
  buttonLink = "/products",
  badge = "MỚI",
  badgeColor = "bg-green-500",
}: NewProductsSectionProps) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">{title}</h2>
          <Image
            className="block mx-auto"
            alt="Decorative title image"
            src={imageUrl}
            width={200}
            height={200}
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.length > 0
            ? products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badge={badge}
                  badgeColor={badgeColor}
                />
              ))
            : Array(4)
                .fill(0)
                .map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
        <div className="text-center mt-8">
          <Link href={buttonLink}>
            <Button variant="outline" className="bg-transparent">
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
