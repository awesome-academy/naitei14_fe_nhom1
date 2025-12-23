"use client";

import "@/src/i18n/i18n";
import BreadcrumbComponent from "@/src/components/breadcrumb/BreadcrumbComponent";
import Image from "next/image";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import Link from "next/link";
import axios from "axios";
import { useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/src/components/confirmdialog/ConfirmDialog";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/src/utils/format.currency";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useCartStore } from "@/src/stores/cart.store";
import { useTranslation } from "react-i18next";
const CartPage = () => {
  const router = useRouter();
  const { cart, setCart, isChange, setIsChange } = useCartStore();
  const ready = useRequireAuth();
  const { t } = useTranslation();

  const cartLabelKeys = useMemo(
    () => [
      "cart.columns.image",
      "cart.columns.name",
      "cart.columns.price",
      "cart.columns.quantity",
      "cart.columns.total",
      "cart.columns.delete",
    ],
    []
  );

  useEffect(() => {
    if (!cart) return;
    const totalPrice = cart.items.reduce((sum, item) => {
      return item.product ? sum + item.quantity * item.product.price : sum;
    }, 0);
    setCart({ ...cart, totalPrice });
  }, [cart?.items, setCart]);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (!cart) return;
    const updatedItems = cart.items.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCart({ ...cart, items: updatedItems });
    setIsChange(true);
  };

  const handleRemoveItem = (index: number) => {
    if (!cart) return;
    const updatedItems = cart.items.filter((_, i) => i !== index);
    setCart({ ...cart, items: updatedItems });
    setIsChange(true);
    toast.success(t("cart.toast.removeItemSuccess"));
  };

  const handleClearCart = () => {
    if (!cart) {
      toast.error(t("cart.toast.noCartToDelete"));
      return;
    }
    setCart({ ...cart, items: [] });
    setIsChange(true);
    toast.success(t("cart.toast.clearSuccess"));
  };

  const handleSaveCart = async () => {
    if (!cart) {
      toast.error(t("cart.toast.noCartToUpdate"));
      return;
    }

    const updatedCart = {
      ...cart,
      updatedAt: new Date().toISOString(),
    };

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE}/carts/${cart.id}`,
        updatedCart
      );
      toast.success(t("cart.toast.updateSuccess"));
      setIsChange(false);
    } catch (error) {
      toast.error(t("cart.toast.updateError"));
      console.error(error);
      throw error;
    }
  };

  const handleConfirmOrder = async () => {
    if (isChange) await handleSaveCart();
    router.push("/cart/checkout");
  };

  if (!ready) return null;
  return (
    <div className="py-6">
      <BreadcrumbComponent
        items={[
          { label: t("breadcrumb.home"), href: "/" },
          { label: t("cart.breadcrumb.title") },
        ]}
      />
      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">{t("cart.title")}</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {cartLabelKeys.map((key) => (
              <TableCell key={index} className="font-semibold text-center">
                {t(key)}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!cart || cart?.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={cartLabelKeys.length} className="text-center">
                {t("cart.empty")}
              </TableCell>
            </TableRow>
          ) : (
            cart?.items.map((cartItem, index) => (
              <TableRow key={index}>
                <TableCell className="flex justify-center">
                  <Image
                    src={`${cartItem.product?.image}`}
                    alt={cartItem.product?.name || "Product Image"}
                    width={70}
                    height={140}
                    className="w-[70px] h-[140px]"
                  />
                </TableCell>
                <TableCell className="text-center uppercase">
                  {cartItem.product?.name}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(cartItem.product?.price) || "0 đ"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="grid place-items-center">
                    <Input
                      type="number"
                      value={cartItem.quantity}
                      min={1}
                      className="w-20 text-center"
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        if (!isNaN(newQuantity) && newQuantity > 0) {
                          handleQuantityChange(index, newQuantity);
                        }
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {cartItem.product?.price
                    ? formatCurrency(cartItem.product.price * cartItem.quantity)
                    : 0}
                </TableCell>
                <TableCell className="text-center">
                  <ConfirmDialog
                    trigger={
                      <Button className="cursor-pointer bg-black hover:bg-gray-800">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                    title={t("cart.dialog.removeItem.title")}
                    description={t("cart.dialog.removeItem.description")}
                    confirmText={t("cart.dialog.removeItem.confirm")}
                    cancelText={t("cart.dialog.removeItem.cancel")}
                    onConfirm={() => handleRemoveItem(index)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center gap-4 mt-6">
        <Link href="/">
          <Button className="cursor-pointer bg-black text-white hover:bg-gray-800">
            {t("cart.buttons.continueShopping")}
          </Button>
        </Link>
        <ConfirmDialog
          trigger={
            <Button
              disabled={cart?.items.length === 0}
              className="cursor-pointer bg-black text-white hover:bg-gray-800"
            >
              {t("cart.buttons.delete")}
            </Button>
          }
          title={t("cart.dialog.clear.title")}
          description={t("cart.dialog.clear.description")}
          confirmText={t("cart.dialog.clear.confirm")}
          cancelText={t("cart.dialog.clear.cancel")}
          onConfirm={handleClearCart}
        />
        <Button
          disabled={!isChange}
          className="cursor-pointer bg-black text-white hover:bg-gray-800"
          onClick={handleSaveCart}
        >
          {t("cart.buttons.update")}
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              disabled={cart?.items.length === 0}
              variant="outline"
              className="cursor-pointer bg-black hover:bg-gray-800 text-white hover:text-white"
            >
                  {t("cart.buttons.proceed")}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="max-w-md mx-auto">
              <DrawerHeader>
                <DrawerTitle>{t("cart.confirm.title")}</DrawerTitle>
                <DrawerDescription>
                  {t("cart.confirm.description")}
                  <br />
                  <strong>{t("cart.confirm.total")}</strong>{" "}
                  {formatCurrency(cart?.totalPrice)}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-center"
                  onClick={handleConfirmOrder}
                >
                  {t("cart.confirm.button")}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">
                    {t("cart.confirm.close")}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default CartPage;
