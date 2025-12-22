import { useState, useCallback } from "react";
import { publicApi } from "@/src/lib/api/axios";
import { User, UserWithoutPassword } from "@/src/types/user.types";
import { useUserStore } from "@/src/stores/user.store";

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  receiveNews?: boolean;
}

export const useAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser, setUser } = useUserStore();

  const getUserById = useCallback(async (
    userId: string | number
  ): Promise<UserWithoutPassword | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await publicApi.get<User>(`/users/${userId}`);

      let userData: User;
      if (response && typeof response === "object" && "data" in response) {
        userData = response.data as User;
      } else {
        userData = response as User;
      }

      if (!userData || typeof userData !== "object" || !userData.email) {
        throw new Error("Invalid user data received");
      }

      const { password: _password, ...userWithoutPassword } = userData;
      return userWithoutPassword;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch user";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (
    userId: string | number,
    data: UpdateUserData
  ): Promise<UserWithoutPassword | null> => {
    try {
      setLoading(true);
      setError(null);

      const currentResponse = await publicApi.get<User>(`/users/${userId}`);
      let currentData: User;
      if (
        currentResponse &&
        typeof currentResponse === "object" &&
        "data" in currentResponse
      ) {
        currentData = currentResponse.data as User;
      } else {
        currentData = currentResponse as User;
      }

      const updatedData = {
        ...currentData,
        ...data,
      };

      const updateResponse = await publicApi.put<User>(
        `/users/${userId}`,
        updatedData
      );
      let updatedUser: User;
      if (
        updateResponse &&
        typeof updateResponse === "object" &&
        "data" in updateResponse
      ) {
        updatedUser = updateResponse.data as User;
      } else {
        updatedUser = updateResponse as User;
      }

      const { password: _password, ...userWithoutPassword } = updatedUser;

      if (currentUser && currentUser.id === userId) {
        setUser(userWithoutPassword);
      }

      return userWithoutPassword;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update user";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser, setUser]);

  return {
    getUserById,
    updateUser,
    loading,
    error,
  };
};