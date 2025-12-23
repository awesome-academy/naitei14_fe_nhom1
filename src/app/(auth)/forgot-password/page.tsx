"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { authService } from "@/src/services/authService";

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

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
});

type FormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setError(null);
      await authService.sendForgotPasswordEmail(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="px-4 w-full flex justify-center">
        <Card className="w-full max-w-md rounded-none border-gray-200">
          {success ? (
            <>
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-xl sm:text-2xl font-bold text-green-600 uppercase">
                  Email đã được gửi!
                </CardTitle>
                <CardDescription className="text-sm">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui
                  lòng kiểm tra hòm thư và làm theo hướng dẫn.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center text-xs sm:text-sm text-gray-600 bg-gray-50 p-4">
                  <p>Không nhận được email?</p>
                  <p>Kiểm tra thư mục spam hoặc thử lại sau vài phút.</p>
                </div>

                <Button
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  className="w-full rounded-none uppercase text-xs h-12"
                >
                  Gửi lại email
                </Button>

                <div className="text-center">
                  <Link href="/login">
                    <Button variant="ghost" className="text-xs uppercase">
                      ← Quay lại đăng nhập
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center space-y-2 sm:space-y-4">
                <CardTitle className="text-xl sm:text-2xl font-bold uppercase">
                  Quên mật khẩu?
                </CardTitle>
                <CardDescription className="text-sm">
                  Nhập email của bạn và chúng tôi sẽ gửi link để đặt lại mật
                  khẩu.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {error && (
                      <Alert variant="destructive" className="rounded-none">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel
                            required
                            className="text-xs uppercase font-semibold"
                          >
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Nhập email của bạn"
                              className="rounded-none h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full rounded-none bg-black hover:bg-gray-800 h-11 uppercase text-xs"
                      disabled={loading}
                    >
                      {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                    </Button>

                    <div className="text-center pt-2">
                      <Link href="/login">
                        <Button variant="ghost" className="text-xs uppercase">
                          ← Quay lại đăng nhập
                        </Button>
                      </Link>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </AuthLayout>
  );
}
