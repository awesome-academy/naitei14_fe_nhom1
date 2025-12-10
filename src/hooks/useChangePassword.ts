import { useState } from "react";
import { publicApi } from "@/src/lib/api/axios";
import { User } from "@/src/types/user.types";

interface ChangePasswordData {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

interface UseChangePassword {
  loading: boolean;
  error: string | null;
  changePassword: (data: ChangePasswordData) => Promise<void>;
}

export const useChangePassword = (): UseChangePassword => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (data: ChangePasswordData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await publicApi.get<User>(`/users/${data.userId}`);
      let currentUser: User;
      if (response && typeof response === "object" && "data" in response) {
        currentUser = response.data as User;
      } else {
        currentUser = response as User;
      }

      if (
        !currentUser ||
        typeof currentUser !== "object" ||
        !currentUser.email
      ) {
        throw new Error("Không thể lấy thông tin người dùng");
      }

      if (currentUser.password !== data.currentPassword) {
        throw new Error("Mật khẩu hiện tại không đúng");
      }

      const updatedUser = {
        ...currentUser,
        password: data.newPassword,
      };

      await publicApi.put(`/users/${data.userId}`, updatedUser);
    } catch (err: any) {
      const message = err.message || "Đổi mật khẩu thất bại";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    changePassword,
  };
};