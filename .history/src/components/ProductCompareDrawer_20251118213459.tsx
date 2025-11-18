"use client";

import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "./ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { X } from "lucide-react";
import Image from "next/image";
import { Product } from "@/src/types/product.types";
import { Button } from "./ui/button";
import { formatCurrency } from "@/src/utils/currency";
import * as React from "react";

// -----------------------------------------------------------------
// 💡 FIX: MOCK IMPLEMENTATION OF THE STORE HOOK
// C043: Removed console.log calls

const useProductCompareStore = () => {
  // C043: Removed console.log
  return {
    products: [] as Product[],
    removeProduct: (id: string) => {
      // C043: Removed console.log
    },
    clearProducts: () => {
      // C043: Removed console.log
    },
  };
};
// -----------------------------------------------------------------

const ProductCompareDrawer = (): React.JSX.Element => {
  const { products, removeProduct, clearProducts } = useProductCompareStore();

  // C013: Removed unused variable 'mockFeatures'

  const productItems = [
    {
      label: "Giá",
      render: (p: Product) => (
        <>
          {formatCurrency(p.price)}{" "}
          {p.discount && (
            <span className="text-red-500 text-xs ml-1">-{p.discount}%</span>
          )}
        </>
      ),
      className: "text-center",
    },
    {
      label: "Giá gốc",
      render: (p: Product) =>
        p.originalPrice ? `${formatCurrency(p.originalPrice)}` : "-",
      className: "text-center",
    },
    {
      label: "Danh mục",
      render: (p: Product) => p.category,
      className: "text-center",
    },
    {
      label: "Đánh giá",
      render: (p: Product) => `⭐ ${p.rating} (${p.reviews})`,
      className: "text-center",
    },
    {
      label: "Kho hàng",
      render: (p: Product) =>
        p.stock > 0 ? `${p.stock} sản phẩm` : "Hết hàng",
      className: "text-center",
    },
    {
      label: "Đặc trưng",
      render: (p: Product) => (
        <ul className="text-xs flex flex-col justify-center items-center">
          {p.features && p.features.map((f, idx) => <li key={idx}>{f}</li>)}
        </ul>
      ),
      className: "text-left",
    },
  ];

  if (products.length === 0) {
    return (
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>So sánh sản phẩm</DrawerTitle>
          <DrawerClose className="absolute top-4 right-4">
            <X className="h-4 w-4" />
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4 text-gray-500 text-center">
          Chưa có sản phẩm nào để so sánh
        </div>
      </DrawerContent>
    );
  }

  return (
    <DrawerContent className="px-6">
      <DrawerHeader>
        <DrawerTitle className="text-xl">SO SÁNH SẢN PHẨM</DrawerTitle>
        <DrawerClose className="absolute top-4 right-4">
          <X className="h-4 w-4" />
        </DrawerClose>
      </DrawerHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Thuộc tính</TableHead>
              {products.map((p, i) => (
                <TableHead key={i} className="text-center relative">
                  <div className="flex flex-col items-center">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={80}
                      height={80}
                      className="object-cover rounded"
                    />
                    <p className="font-medium mt-2">{p.name}</p>
                    <Button
                      variant="link"
                      onClick={() => removeProduct(p.id)}
                      className="text-xs text-red-500 mt-1"
                    >
                      ✕ Xóa
                    </Button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {productItems.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-medium">{row.label}</TableCell>
                {products.map((p, i) => (
                  <TableCell key={i} className={row.className}>
                    {row.render(p)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 flex justify-end">
        <Button
          onClick={clearProducts}
          className="px-4 py-2 bg-destructive rounded hover:bg-chart-1 text-sm"
        >
          Xóa tất cả
        </Button>
      </div>
    </DrawerContent>
  );
};

export default ProductCompareDrawer;
