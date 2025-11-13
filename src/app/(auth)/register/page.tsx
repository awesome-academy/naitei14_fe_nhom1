"use client";

import BreadcrumbComponent from "@/src/components/breadcrumb/BreadcrumbComponent";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { FormLabel } from "@/src/components/ui/form-label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Giả lập backend call
const REGISTRATION_TIMEOUT_MS = 1000;
const handleUserRegistration = async (data: any) => {
  return new Promise((resolve) => setTimeout(resolve, REGISTRATION_TIMEOUT_MS));
};

// Schema validate form
const formSchema = z
  .object({
    firstName: z.string().min(2, "Tên trước phải có ít nhất 2 ký tự"),
    lastName: z.string().min(2, "Tên sau phải có ít nhất 2 ký tự"),
    email: z.string().email({ message: "Email không hợp lệ" }),
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
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      receiveNews: false,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      setServerError(null);
      await handleUserRegistration({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        receiveNews: data.receiveNews,
        role: "customer", // mặc định
      });
      setSuccess(true);

      // redirect sau 1 giây
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đăng ký thất bại";
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
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
              name="receiveNews"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 px-20">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
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
            {success && (
              <div className="text-green-600 text-sm">
                Đăng ký thành công! Chuyển hướng sang đăng nhập...
              </div>
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
