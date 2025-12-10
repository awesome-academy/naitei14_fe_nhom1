"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { FormLabel } from "@/src/components/ui/form-label";
import { AuthLayout } from "@/src/components/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import { Alert, AlertDescription } from "@/src/components/ui/alert";

const twoFactorSchema = z.object({
  code: z.string().length(6, "Mã xác thực phải có 6 số"),
});

type FormValues = z.infer<typeof twoFactorSchema>;

export default function TwoFactorPage() {
  const loading = false;
  const [error] = useState<string | null>(null);
  const email = "user@example.com";

  const form = useForm<FormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Verify 2FA code:", data.code);
    alert("Giả lập xác thực thành công (UI only)");
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Xác thực hai bước
          </CardTitle>
          <CardDescription>
            Mã xác thực 6 số đã gửi tới email <strong>{email}</strong>
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Mã xác thực</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang xác thực..." : "Xác thực"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
