"use client";

import BreadcrumbComponent from "@/src/components/breadcrumb/BreadcrumbComponent";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import titleleftdark from "@/public/image_Rudu/titleleft-dark.png";
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
import { FormLabel } from "@/src/components/ui/form-label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z
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

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

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
    try {
      setServerError(null);
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        receiveNews: data.receiveNews,
      });
      router.push("/login");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Đăng ký thất bại");
    }
  };

  return (
    <div className="flex flex-col items-start py-4 px-4 sm:px-0">
      <BreadcrumbComponent
        items={[{ label: "Trang chủ", href: "/" }, { label: "Đăng ký" }]}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full my-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-2 uppercase">
            Đăng ký
          </h1>
          <Image src={titleleftdark} alt="Underline" width={70} height={20} />
        </div>
        <Link href="/login" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-black text-white text-sm px-7 py-5 rounded-none cursor-pointer hover:bg-gray-700">
            ĐĂNG NHẬP
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full flex flex-col gap-6 sm:gap-8 border px-4 py-6 sm:px-12 sm:py-8">
            <h1 className="font-semibold uppercase text-sm sm:text-base">
              Thông tin cá nhân
            </h1>

            {[
              { name: "firstName", label: "Tên trước" },
              { name: "lastName", label: "Tên sau" },
              { name: "email", label: "Email", type: "email" },
            ].map((input) => (
              <FormField
                key={input.name}
                control={form.control}
                name={input.name as any}
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <FormLabel className="text-sm sm:min-w-[150px]" required>
                      {input.label}
                    </FormLabel>
                    <div className="w-full sm:w-[85%]">
                      <FormControl>
                        <Input
                          {...field}
                          type={input.type || "text"}
                          className="w-full rounded-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-10">
                  <FormLabel className="text-sm sm:min-w-[110px]" required>
                    Vai trò
                  </FormLabel>
                  <div className="w-full sm:w-auto min-w-[200px]">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-none">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-none">
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                        <SelectItem value="customer">Khách hàng</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
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
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-10">
                  <FormLabel className="text-sm sm:min-w-[110px]" required>
                    Vai trò
                  </FormLabel>
                  <div className="w-full sm:w-auto min-w-[200px]">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-none">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-none">
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                        <SelectItem value="customer">Khách hàng</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiveNews"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 sm:px-20 lg:px-40">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-500 size-4 rounded-none"
                    />
                  </FormControl>
                  <FormLabel className="text-sm cursor-pointer">
                    Đăng ký nhận bản tin
                  </FormLabel>
                </FormItem>
              )}
            />

            <h1 className="font-semibold uppercase text-sm sm:text-base border-t pt-6">
              Thông tin đăng nhập
            </h1>

            {[
              { name: "password", label: "Mật khẩu" },
              { name: "confirmPassword", label: "Xác nhận mật khẩu" },
            ].map((input) => (
              <FormField
                key={input.name}
                control={form.control}
                name={input.name as any}
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <FormLabel className="text-sm sm:min-w-[150px]" required>
                      {input.label}
                    </FormLabel>
                    <div className="w-full sm:w-[85%]">
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
            ))}

            {serverError && (
              <div className="text-red-500 text-sm text-center">
                {serverError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-end mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-32 bg-black text-white text-xs py-5 rounded-none cursor-pointer hover:bg-gray-700 uppercase"
              >
                {loading ? "Đang xử lý..." : "Gửi"}
              </Button>
              <Button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-32 bg-black text-white text-xs py-5 rounded-none cursor-pointer hover:bg-gray-700 uppercase"
              >
                Quay lại
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
