"use client";

import "@/src/i18n/i18n";
import Link from "next/dist/client/link";
import Image from "next/image";
import { useProductCompareStore } from "@/src/stores/product.compare.store";
import { IMAGE_DIMENSIONS } from "@/src/constants/image-dimensions";
import { useTranslation } from "react-i18next";

export default function ProductCompare() {
  const { products } = useProductCompareStore();
  const { t } = useTranslation();

  return (
    <div className="mb-6 lg:mb-8 hidden lg:block">
      <h3 className="text-lg font-bold mb-4 border-b pb-2">
        {t("product.sidebar.compare")}
        <Image
          src="/Image_Rudu/titleleft-dark.png"
          alt="arrow-trang-tri"
          width={IMAGE_DIMENSIONS.TITLE_DECORATION.width}
          height={IMAGE_DIMENSIONS.TITLE_DECORATION.height}
        />
      </h3>
      <div className="map">
        {products.length > 0 ? (
          products.map((product, index) => (
            <Link
              key={index}
              href={`/products/${product.id}`}
              className="block py-2 hover:underline"
            >
              {product.name}
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-600">
            {t("product.sidebar.compare.empty")}
          </p>
        )}
      </div>
    </div>
  );
}
