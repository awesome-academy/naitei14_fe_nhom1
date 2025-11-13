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
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OAuthButtons } from "@/src/components/auth";

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    } as FormValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setServerError(null);
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    }
  };

  return (
    <div className="flex flex-col items-start py-4 px-4 sm:px-0">
      <BreadcrumbComponent
        items={[{ label: "Trang chủ", href: "/" }, { label: "Đăng nhập" }]}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full my-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-2 uppercase">
            Đăng nhập
          </h1>
          <Image src={titleleftdark} alt="Underline" width={70} height={20} />
        </div>
        <Link href="/register" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-black text-white text-sm px-7 py-5 rounded-none cursor-pointer hover:bg-gray-700">
            ĐĂNG KÝ
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full flex flex-col gap-6 sm:gap-8 border px-4 py-6 sm:px-12 sm:py-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold uppercase text-sm sm:text-base">
                Khách hàng đăng nhập
              </h1>
              <h2 className="text-xs sm:text-sm">
                Nếu bạn có một tài khoản, xin vui lòng đăng nhập
              </h2>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <FormLabel className="text-sm sm:min-w-[100px]" required>
                    Email
                  </FormLabel>
                  <div className="w-full sm:w-[90%]">
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="w-full rounded-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <FormLabel className="text-sm sm:min-w-[100px]" required>
                    Mật khẩu
                  </FormLabel>
                  <div className="w-full sm:w-[90%]">
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="w-full rounded-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:px-0 lg:px-20 gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  className="border-gray-500 size-4 rounded-none"
                  id="remember"
                />
                <label
                  htmlFor="remember"
                  className="text-sm cursor-pointer select-none"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {serverError && (
              <div className="text-red-500 text-sm text-center sm:text-left">
                {serverError}
              </div>
            )}

            <div className="flex justify-center sm:justify-start lg:px-20">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-black text-white text-xs px-10 py-2 rounded-none cursor-pointer hover:bg-gray-700 uppercase"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </div>

            <div className="border-t pt-6">
              <OAuthButtons />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
