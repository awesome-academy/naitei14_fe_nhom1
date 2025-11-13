"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { UserWithoutPassword } from "@/src/types/user.types";
import { removeToken, setToken } from "@/src/lib/utils";
import { addCart } from "@/src/utils/api/cart.api";
import { useUserStore } from "@/src/stores/user.store";
import { useCartStore } from "@/src/stores/cart.store";
import { useNotifications } from "@/src/hooks/useNotifications";

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "customer";
  receiveNews?: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

interface UseAuth {
  user: UserWithoutPassword | null;
  loading: boolean;
  error: string | null;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuth => {
  const router = useRouter();
  const { user, setUser, clearUser } = useUserStore();
  const { clearNotifications } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Registration failed");

      // Tạo cart mới rồi chuyển hướng
      addCart(result.data.id);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Login failed");

      // Check if 2FA is required
      if (result.requiresTwoFactor) {
        // Redirect to 2FA page with email
        router.push(`/two-factor?email=${encodeURIComponent(result.email)}`);
        return;
      }

      // Normal login flow
      setToken(result.data);
      setUser(result.data);

      if (result.data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      clearNotifications();
      useCartStore.setState({ cart: null, isChange: false });
      removeToken();
      clearUser();

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        let message = "Logout failed";
        try {
          const result = await response.json();
          if (
            result &&
            typeof result === "object" &&
            "message" in result &&
            result.message
          ) {
            message = result.message;
          }
        } catch {
          // Ignore JSON parsing errors and use default message
        }
        throw new Error(message);
      }
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, register, login, logout };
};
