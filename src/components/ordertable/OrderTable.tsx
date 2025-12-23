"use client";

import "@/src/i18n/i18n";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import Image from "next/image";
import { Product } from "@/src/types/product.types";
import { formatCurrency } from "@/src/utils/format.currency";
import { useTranslation } from "react-i18next";

export interface ProductItem {
  id: string;
  product: Product | null;
  quantity: number;
  totalPrice: number;
}
export interface OrderTableProps {
  data: ProductItem[];
  footer?: React.ReactNode;
}

const OrderTable = (props: OrderTableProps) => {
  const { data, footer } = props;
  const { t } = useTranslation();

  const headers = [
    { label: t("order.table.image") },
    { label: t("order.table.name") },
    { label: t("order.table.price") },
    { label: t("order.table.quantity") },
    { label: t("order.table.total") },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((item, index) => (
            <TableCell key={index} className="font-semibold text-center">
              {item.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => {
          const product = item.product;
          if (!product) {
            return (
              <TableRow key={item.id}>
                <TableCell
                  colSpan={headers.length}
                  className="text-center text-red-500"
                >
                  {t("order.table.productNotFound", { id: item.id })}
                </TableCell>
              </TableRow>
            );
          }

          return (
            <TableRow key={item.id}>
              <TableCell className="flex justify-center">
                <Image
                  src={`${product.image || "default-product.png"}`}
                  alt={product.name}
                  width={70}
                  height={140}
                  className="w-[70px] h-[140px]"
                />
              </TableCell>
              <TableCell className="text-center">{product.name}</TableCell>
              <TableCell className="text-center">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell className="text-center">{item.quantity}</TableCell>
              <TableCell className="text-center">
                {formatCurrency(product.price * item.quantity)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      {footer && <TableFooter>{footer}</TableFooter>}
    </Table>
  );
};
export default OrderTable;
