"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { FormLabel } from "@/src/components/ui/form-label";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { AuthLayout } from "@/src/components/auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type FormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Không thể gửi yêu cầu. Vui lòng kiểm tra kết nối mạng.");
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">
              Email đã được gửi!
            </CardTitle>
            <CardDescription>
              Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setSuccess(false)} className="w-full">
              Gửi lại email
            </Button>
            <div className="text-center mt-2">
              <Link href="/login">
                <Button variant="ghost">← Quay lại đăng nhập</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Quên mật khẩu?</CardTitle>
          <CardDescription>
            Nhập email để nhận link đặt lại mật khẩu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Nhập email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Gửi link đặt lại mật khẩu
              </Button>
              <div className="text-center">
                <Link href="/login">
                  <Button variant="ghost">← Quay lại đăng nhập</Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
