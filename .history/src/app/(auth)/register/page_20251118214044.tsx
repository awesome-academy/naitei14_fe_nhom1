"use client";

import BreadcrumbComponent from "@/src/components/breadcrumb/BreadcrumbComponent";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectItem,
  SelectTrigger,
} from "@/src/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { DisplayFormLabel } from "@/src/components/ui/form-label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CONFIG } from "@/src/constants/ui"; // <-- Import Constants

// C067: Using CONFIG constant
const REGISTRATION_TIMEOUT_MS = CONFIG.REGISTRATION_TIMEOUT_MS;

// Placeholder notifications
const showSuccessNotification = (message: string) => {};
const showErrorNotification = (message: string) => {};

const handleUserRegistration = async (data: any) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, REGISTRATION_TIMEOUT_MS); // C067: Uses constant
  });
};

const formSchema = z
  // ... (form schema definition remains the same)
  .object({
    firstName: z.string().min(2, "Tên trước phải có ít nhất 2 ký tự"),
    lastName: z.string().min(2, "Tên sau phải có ít nhất 2 ký tự"),
    email: z.string().email({ message: "Email không hợp lệ" }),
    role: z.enum(["admin", "customer"]).describe("Vai trò"),
    receiveNews: z.boolean(),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function RegisterUserPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "customer",
      receiveNews: false,
      password: "",
      confirmPassword: "",
    } as FormValues,
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      setServerError(null);
      const { password, confirmPassword, ...registrationData } = data;

      await handleUserRegistration({
        email: registrationData.email,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        role: registrationData.role,
        receiveNews: registrationData.receiveNews,
      });

      showSuccessNotification("Đăng ký thành công! Đang chuyển hướng...");
      router.push("/login");
    } catch (err) {
      // C035: Structured logging format used
      console.error({
        message: "Registration failed",
        error: err,
        email: data.email,
      });

      const errorMessage =
        err instanceof Error ? err.message : "Đăng ký thất bại";
      setServerError(errorMessage);
      showErrorNotification(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (rest of return JSX remains the same)
    <div className="flex flex-col items-start py-4">
      <BreadcrumbComponent
        items={[{ label: "Trang chủ", href: "/" }, { label: "Đăng ký" }]}
      />

      <div className="flex justify-between w-full my-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">ĐĂNG KÝ</h1>
          <Image src={titleleftdark} alt="Underline" width={70} height={20} />
        </div>
        <Link href="/login">
          <Button className="bg-black text-white text-sm px-7 py-5 rounded-none cursor-pointer hover:bg-gray-700">
            ĐĂNG NHẬP
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full flex flex-col gap-8 border px-12 py-8">
            <h1 className="font-semibold">THÔNG TIN CÁ NHÂN</h1>

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-sm text-nowrap" required>
                    Tên trước
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="w-[90%] rounded-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-sm text-nowrap" required>
                    Tên sau
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="w-[90%] rounded-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-sm text-nowrap" required>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="w-[90%] rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex gap-10">
                  <FormLabel className="text-sm text-nowrap" required>
                    Vai trò
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none">
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                      <SelectItem value="customer">Khách hàng</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiveNews"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 px-20">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-500 size-3 rounded-none"
                    />
                  </FormControl>
                  <FormLabel className="text-sm text-nowrap">
                    Đăng ký nhận bản tin
                  </FormLabel>
                </FormItem>
              )}
            />

            <h1 className="font-semibold">THÔNG TIN ĐĂNG NHẬP</h1>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-sm text-nowrap" required>
                    Mật khẩu
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="w-[90%] rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center gap-6">
                  <FormLabel className="text-sm text-nowrap" required>
                    Xác nhận mật khẩu
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="w-[90%] rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <div className="text-red-500 text-sm">{serverError}</div>
            )}

            <div className="flex gap-4 self-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-black text-white text-xs px-3 py-1 rounded-none cursor-pointer hover:bg-gray-700"
              >
                {loading ? "ĐANG XỬ LÝ..." : "GỬI"}
              </Button>
              <Button
                type="button"
                onClick={() => router.back()}
                className="bg-black text-white text-xs px-3 py-1 rounded-none cursor-pointer hover:bg-gray-700"
              >
                QUAY LẠI
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
