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
import { useState } from "react";
import { OAuthButtons } from "@/src/components/auth";

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
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
    <div className="flex flex-col items-start py-4">
      <BreadcrumbComponent
        items={[{ label: "Trang chủ", href: "/" }, { label: "Đăng nhập" }]}
      />

      <div className="flex justify-between w-full my-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">ĐĂNG NHẬP</h1>
          <Image src={titleleftdark} alt="Underline" width={70} height={20} />
        </div>
        <Link href="/register">
          <Button className="bg-black text-white text-sm px-7 py-5 rounded-none cursor-pointer hover:bg-gray-700">
            ĐĂNG KÝ
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full flex flex-col gap-8 border px-12 py-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">KHÁCH HÀNG ĐĂNG NHẬP</h1>
              <h2 className="text-sm text-nowrap">
                Nếu bạn có một tài khoản, xin vui lòng đăng nhập
              </h2>
            </div>

            {/* Email */}
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

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-sm text-nowrap" required>
                    Password
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

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between px-20">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false} // bind boolean
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        className="border-gray-500 size-3 rounded-none"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-nowrap">
                      Ghi nhớ đăng nhập
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="text-red-500 text-sm">{serverError}</div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-min bg-black text-white text-xs mx-20 px-4 py-1 rounded-none cursor-pointer hover:bg-gray-700"
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
            </Button>

            {/* OAuth Login Buttons */}
            <OAuthButtons />
          </div>
        </form>
      </Form>
    </div>
  );
}
