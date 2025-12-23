"use client";

import "@/src/i18n/i18n";
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
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { t } = useTranslation();

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
      // Redirect sẽ được xử lý trong useAuth
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    }
  };

  return (
    <div className="flex flex-col items-start py-4">
      <BreadcrumbComponent
        items={[{ label: t("breadcrumb.home"), href: "/" }, { label: t("auth.login.title") }]}
      />

      <div className="flex justify-between w-full my-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">{t("auth.login.title")}</h1>
          <Image src={titleleftdark} alt="Underline" width={70} height={20} />
        </div>
        <Link href="/register">
          <Button className="bg-black text-white text-sm px-7 py-5 rounded-none cursor-pointer hover:bg-gray-700">
            {t("auth.register.title")}
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full flex flex-col gap-8 border px-12 py-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold">{t("auth.login.title")}</h1>
              <h2 className="text-sm text-nowrap">
                {t("auth.login.subtitle")}
              </h2>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-sm text-nowrap" required>
                    {t("auth.login.email")}
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
              name="password"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-sm text-nowrap" required>
                    {t("auth.login.password")}
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

            <div className="flex items-center justify-between px-20">
              <div className="flex items-center gap-2">
                <FormControl>
                  <Checkbox className="border-gray-500 size-3 rounded-none" />
                </FormControl>
                <FormLabel className="text-sm text-nowrap">
                  {t("auth.login.remember")}
                </FormLabel>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {t("auth.login.forgotPassword")}
              </Link>
            </div>

            {serverError && (
              <div className="text-red-500 text-sm">{serverError}</div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-min bg-black text-white text-xs mx-20 px-4 py-1 rounded-none cursor-pointer hover:bg-gray-700"
            >
              {loading ? t("auth.login.processing") : t("auth.login.button")}
            </Button>

            {/* OAuth Login Buttons */}
            <OAuthButtons />
          </div>
        </form>
      </Form>
    </div>
  );
}
