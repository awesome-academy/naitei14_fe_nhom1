import { create } from "zustand";
import { privateApi } from "@/src/lib/api/axios";
import { Cart } from "@/src/types/cart.type";

interface CartState {
  cart: Cart | null;
  isChange: boolean;
  fetchCart: (userId: string) => Promise<void>;
  setCart: (cart: Cart | null) => void;
  setIsChange: (value: boolean) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isChange: false,

  fetchCart: async (userId) => {
    if (!userId) {
      set({ cart: null });
      return;
    }
    try {
      // Gọi API lấy cart
      const res = await privateApi.get(`/carts?userId=${userId}`);

      // Kiểm tra an toàn: res có thể là undefined nếu lỗi mạng
      // res.data có thể là undefined
      // Dùng cú pháp ?. để tránh crash app
      const cartData = Array.isArray(res?.data)
        ? res.data[0]
        : Array.isArray(res)
        ? res[0]
        : res;

      set({ cart: cartData || null });
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ cart: null });
    }
  },

  setCart: (cart) => set({ cart }),
  setIsChange: (value) => set({ isChange: value }),
}));
