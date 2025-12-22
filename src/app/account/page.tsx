"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccount } from "@/src/hooks/useAccount";
import { getTestUserId } from "@/src/config/test-user";
import { useUserStore } from "@/src/stores/user.store";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import BreadcrumbComponent from "@/src/components/breadcrumb/BreadcrumbComponent";
import Image from "next/image";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";

const accountSchema = z.object({
  firstName: z.string().min(1, "Họ không được để trống"),
  lastName: z.string().min(1, "Tên không được để trống"),
  receiveNews: z.boolean(),
});

type FormValues = z.infer<typeof accountSchema>;

export default function AccountPage() {
  const { user: currentUser } = useUserStore();
  const userId = currentUser?.id || getTestUserId();
  const { getUserById, updateUser, loading } = useAccount();
  const [serverError, setServerError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      receiveNews: false,
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userData = await getUserById(userId);
        if (userData) {
          setUserEmail(userData.email);
          form.reset({
            firstName: userData.firstName,
            lastName: userData.lastName,
            receiveNews: userData.receiveNews,
          });
        } else {
          setServerError("Không thể lấy thông tin người dùng. Vui lòng kiểm tra kết nối server.");
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Không thể lấy thông tin người dùng";
        setServerError(errorMessage);
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const onSubmit = async (data: FormValues) => {
    try {
      setServerError(null);
      if (!userId) return;

      const currentData = await getUserById(userId);
      if (!currentData) {
        throw new Error("Không thể lấy thông tin user");
      }

      const updatedUser = await updateUser(userId, {
        ...currentData,
        firstName: data.firstName,
        lastName: data.lastName,
        receiveNews: data.receiveNews,
      });

      if (updatedUser) {
        toast.success("Cập nhật thông tin thành công!");
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Cập nhật thông tin thất bại"
      );
    }
  };

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Vui lòng đăng nhập để truy cập trang này.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start py-4">
      <BreadcrumbComponent
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tài khoản của tôi" },
        ]}
      />

      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">TÀI KHOẢN CỦA TÔI</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">THÔNG TIN TÀI KHOẢN</h2>
        </div>

        <div className="flex justify-between items-center">
          <Label htmlFor="email" className="text-sm text-nowrap">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={userEmail}
            disabled
            className="w-[90%] rounded-none bg-gray-100"
          />
        </div>

        <div className="flex justify-between items-center">
          <Label htmlFor="firstName" className="text-sm text-nowrap">
            Tên <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            {...form.register("firstName")}
            className="w-[90%] rounded-none"
          />
          {form.formState.errors.firstName && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <Label htmlFor="lastName" className="text-sm text-nowrap">
            Họ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            {...form.register("lastName")}
            className="w-[90%] rounded-none"
          />
          {form.formState.errors.lastName && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 px-20">
          <input
            type="checkbox"
            id="receiveNews"
            {...form.register("receiveNews")}
            className="border-gray-500 size-3 rounded-none"
          />
          <Label htmlFor="receiveNews" className="text-sm text-nowrap">
            Đăng ký nhận bản tin
          </Label>
        </div>

        {serverError && (
          <div className="text-red-500 text-sm">{serverError}</div>
        )}

        <div className="flex mx-20 gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-min bg-sky-400 text-white tracking-tighter text-sm px-4 py-1 rounded-none cursor-pointer hover:bg-sky-700"
          >
            {loading ? "ĐANG XỬ LÝ..." : "Cập nhật thông tin"}
          </Button>
          <Button
            type="button"
            onClick={() => window.location.href = "/account/security"}
            variant="outline"
            className="w-min tracking-tighter text-sm px-4 py-1 rounded-none cursor-pointer"
          >
            Cài đặt bảo mật
          </Button>
          <Button
            type="button"
            onClick={() => window.location.href = "/"}
            className="w-min bg-black text-white tracking-tighter text-sm px-4 py-1 rounded-none cursor-pointer hover:bg-gray-700"
          >
            Thoát
          </Button>
        </div>
      </form>
    </div>
  );
}