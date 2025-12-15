"use client";

import { useUserStore } from "@/src/stores/user.store";
import { useCartStore } from "@/src/stores/cart.store";
import { Product } from "@/src/types/product.types"; // Hoặc import từ file type của bạn
import { privateApi } from "@/src/lib/api/axios"; // Dùng privateApi để có token
import { toast } from "sonner";
import { Cart, CartItem } from "@/src/types/cart.type";

export const useAddToCart = () => {
  const { cart, setCart, setIsChange } = useCartStore();
  const { user } = useUserStore();

  const addToCart = async (product: Product) => {
    // 1. Kiểm tra đăng nhập
    if (!user) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
      // Có thể redirect sang login nếu muốn
      return;
    }

    if (!product) {
      toast.error("Sản phẩm không hợp lệ!");
      return;
    }

    try {
      let currentCart = cart;

      // 2. LOGIC TỰ ĐỘNG TẠO GIỎ HÀNG NẾU CHƯA CÓ
      if (!currentCart) {
        console.log("Giỏ hàng chưa có, đang tạo mới...");

        // Tạo giỏ hàng rỗng
        const newCartData = {
          userId: user.id,
          items: [],
          totalPrice: 0,
          totalItem: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Gọi API tạo cart
        const res = await privateApi.post("/carts", newCartData);
        currentCart = res.data;

        // Cập nhật vào store ngay lập tức
        setCart(currentCart);
      }

      // 3. Logic thêm sản phẩm vào giỏ (Khi đã chắc chắn có cart)
      if (currentCart) {
        const existingItemIndex = currentCart.items.findIndex(
          (item) => item.productId === product.id
        );

        const updatedItems = [...currentCart.items];

        if (existingItemIndex > -1) {
          // Sản phẩm đã có -> Tăng số lượng
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1,
          };
        } else {
          // Sản phẩm mới -> Thêm vào mảng
          const newItem: CartItem = {
            productId: product.id,
            product: product, // Lưu snapshot sản phẩm
            quantity: 1,
          };
          updatedItems.push(newItem);
        }

        // Tính toán lại tổng tiền (Optional: Backend có thể tự tính, nhưng Json-server thì Frontend phải tính)
        const newTotalPrice = updatedItems.reduce(
          (total, item) => total + item.quantity * (item.product?.price || 0),
          0
        );

        const updatedCart = {
          ...currentCart,
          items: updatedItems,
          totalPrice: newTotalPrice,
          updatedAt: new Date().toISOString(),
        };

        // Gửi lên Server
        await privateApi.patch(`/carts/${currentCart.id}`, updatedCart);

        // Cập nhật Store
        setCart(updatedCart);
        setIsChange(true);
        toast.success("Đã thêm vào giỏ hàng thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ:", error);
      toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };

  return addToCart;
};
