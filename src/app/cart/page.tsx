"use client";

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
import { Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/src/components/confirmdialog/ConfirmDialog";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/src/utils/format.currency";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";
import { useCartStore } from "@/src/stores/cart.store";

const CartPage = () => {
  const router = useRouter();
  const { cart, setCart, isChange, setIsChange } = useCartStore();
  const ready = useRequireAuth();

  const cartLabel = useMemo(
    () => [
      { label: "ẢNH" },
      { label: "TÊN SẢN PHẨM" },
      { label: "GIÁ" },
      { label: "SỐ LƯỢNG" },
      { label: "TỔNG TIỀN" },
      { label: "XÓA" },
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
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleClearCart = () => {
    if (!cart) {
      toast.error("Không tìm thấy giỏ hàng để xóa");
      return;
    }
    setCart({ ...cart, items: [] });
    setIsChange(true);
    toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
  };

  const handleSaveCart = async () => {
    if (!cart) {
      toast.error("Không tìm thấy giỏ hàng để cập nhật");
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
      toast.success("Cập nhật giỏ hàng thành công");
      setIsChange(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật giỏ hàng");
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
    <div className="py-6 px-4 sm:px-0">
      <BreadcrumbComponent
        items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]}
      />
      <div className="my-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-2 uppercase">
          Giỏ hàng
        </h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      {/* --- DESKTOP VIEW: Bảng hiển thị trên màn hình md trở lên --- */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {cartLabel.map((item, index) => (
                <TableCell
                  key={index}
                  className="font-semibold text-center whitespace-nowrap"
                >
                  {item.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!cart || cart?.items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={cartLabel.length}
                  className="text-center py-10"
                >
                  Giỏ hàng của bạn đang trống
                </TableCell>
              </TableRow>
            ) : (
              cart?.items.map((cartItem, index) => (
                <TableRow key={index}>
                  <TableCell className="flex justify-center">
                    <div className="relative w-[70px] h-[100px]">
                      <Image
                        src={`${cartItem.product?.image}`}
                        alt={cartItem.product?.name || "Product Image"}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center uppercase font-medium">
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
                        className="w-16 text-center rounded-none"
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          if (!isNaN(newQuantity) && newQuantity > 0) {
                            handleQuantityChange(index, newQuantity);
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {cartItem.product?.price
                      ? formatCurrency(
                          cartItem.product.price * cartItem.quantity
                        )
                      : 0}
                  </TableCell>
                  <TableCell className="text-center">
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          className="cursor-pointer hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      }
                      title="Xóa sản phẩm"
                      description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
                      confirmText="Xóa"
                      cancelText="Hủy"
                      onConfirm={() => handleRemoveItem(index)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE VIEW: Hiển thị dạng thẻ (Card) trên màn hình dưới md --- */}
      <div className="md:hidden space-y-4">
        {!cart || cart?.items.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-lg text-gray-500">
            Giỏ hàng của bạn đang trống
          </div>
        ) : (
          cart?.items.map((cartItem, index) => (
            <div
              key={index}
              className="border p-4 flex flex-col gap-4 bg-card shadow-sm"
            >
              <div className="flex gap-4">
                <div className="relative w-20 h-28 bg-muted shrink-0">
                  <Image
                    src={`${cartItem.product?.image}`}
                    alt={cartItem.product?.name || "Product"}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex flex-col flex-1 gap-1">
                  <h3 className="font-bold uppercase text-sm line-clamp-2">
                    {cartItem.product?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(cartItem.product?.price)}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border">
                      <button
                        className="px-3 py-1 bg-gray-100"
                        onClick={() =>
                          cartItem.quantity > 1 &&
                          handleQuantityChange(index, cartItem.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="px-4 text-sm">{cartItem.quantity}</span>
                      <button
                        className="px-3 py-1 bg-gray-100"
                        onClick={() =>
                          handleQuantityChange(index, cartItem.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      }
                      title="Xóa sản phẩm"
                      onConfirm={() => handleRemoveItem(index)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t font-semibold">
                <span className="text-xs text-gray-500">TỔNG TIỀN:</span>
                <span>
                  {formatCurrency(
                    (cartItem.product?.price || 0) * cartItem.quantity
                  )}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- ACTION BUTTONS: Tự động điều hướng --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 border-t pt-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto cursor-pointer bg-black text-white hover:bg-gray-800 rounded-none uppercase text-xs h-11">
              Tiếp tục mua hàng
            </Button>
          </Link>
          <ConfirmDialog
            trigger={
              <Button
                disabled={!cart || cart?.items.length === 0}
                className="w-full sm:w-auto cursor-pointer bg-black text-white hover:bg-gray-800 rounded-none uppercase text-xs h-11"
              >
                Xóa tất cả
              </Button>
            }
            title="Xóa giỏ hàng"
            description="Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?"
            confirmText="Xóa"
            cancelText="Hủy"
            onConfirm={handleClearCart}
          />
          <Button
            disabled={!isChange}
            className="w-full sm:w-auto cursor-pointer bg-black text-white hover:bg-gray-800 rounded-none uppercase text-xs h-11"
            onClick={handleSaveCart}
          >
            Cập nhật giỏ hàng
          </Button>
        </div>

        <div className="w-full md:w-auto flex flex-col items-end gap-3">
          <div className="text-lg font-bold">
            TỔNG THANH TOÁN:{" "}
            <span className="text-red-600 ml-2">
              {formatCurrency(cart?.totalPrice)}
            </span>
          </div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                disabled={!cart || cart?.items.length === 0}
                className="w-full md:w-auto cursor-pointer bg-red-700 hover:bg-red-800 text-white rounded-none uppercase text-xs h-11 px-8"
              >
                Tiến hành đặt hàng
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="max-w-md mx-auto w-full px-4">
                <DrawerHeader>
                  <DrawerTitle className="text-center">
                    XÁC NHẬN ĐƠN HÀNG
                  </DrawerTitle>
                  <DrawerDescription className="text-center pt-4">
                    <span className="block mb-2 text-gray-600">
                      Bạn có chắc chắn muốn đặt hàng với các sản phẩm đã chọn?
                    </span>
                    <span className="text-xl font-bold text-black block">
                      Tổng tiền: {formatCurrency(cart?.totalPrice)}
                    </span>
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="flex flex-col gap-2 pb-8">
                  <Button
                    className="bg-black hover:bg-gray-800 text-white w-full rounded-none h-12 uppercase font-bold"
                    onClick={handleConfirmOrder}
                  >
                    Xác nhận đặt hàng
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      className="rounded-none h-12 uppercase"
                    >
                      Quay lại
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
