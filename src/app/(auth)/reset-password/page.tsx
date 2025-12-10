"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { AuthLayout } from "@/src/components/auth";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);

  const token = searchParams?.get("token") ?? null;

  const form = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setValidToken(false);
        return;
      }

      try {
        // Gọi API xác thực token
        const res = await fetch(
          `/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`
        );
        if (!res.ok) {
          setValidToken(false);
          return;
        }
        const data = await res.json();
        setValidToken(data.valid === true);
      } catch (err) {
        setValidToken(false);
      }
    };

    checkToken();
  }, [token]);

  const onSubmit = async (data: FormValues) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      // --- MOCK API CALL ---
      console.log("Đặt lại mật khẩu mới:", data.newPassword, "Token:", token);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả lập delay

      setSuccess(true);
    } catch (err: any) {
      setError("Có lỗi xảy ra khi đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  // Invalid token UI
  if (validToken === false) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">
              Link không hợp lệ
            </CardTitle>
            <CardDescription>
              Link đặt lại mật khẩu này không hợp lệ hoặc đã hết hạn. Vui lòng
              yêu cầu link mới.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link href="/forgot-password">
                <Button className="w-full">Yêu cầu link mới</Button>
              </Link>

              <div className="text-center">
                <Link href="/login">
                  <Button variant="ghost">← Quay lại đăng nhập</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  // Success UI
  if (success) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">
              Đặt lại mật khẩu thành công!
            </CardTitle>
            <CardDescription>
              Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật
              khẩu mới ngay bây giờ.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Đăng nhập ngay</Button>
            </Link>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  // Loading UI (Checking token)
  if (validToken === null) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang kiểm tra...</p>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  // Main Form UI
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Đặt lại mật khẩu</CardTitle>
          <CardDescription>Nhập mật khẩu mới của bạn.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        autoComplete="new-password"
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
                  <FormItem>
                    <FormLabel required>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
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
