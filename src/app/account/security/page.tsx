"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/src/stores/user.store";
import { useAccount } from "@/src/hooks/useAccount";
import { getTestUserId } from "@/src/config/test-user";
import { UserWithoutPassword } from "@/src/types/user.types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { Shield } from "lucide-react";
import { toast, Toaster } from "sonner";
import BreadcrumbComponent from "@/src/components/breadcrumb/BreadcrumbComponent";
import Image from "next/image";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import { PasswordManagementCard, AccountInfoCard } from "@/src/components/security";

export default function SecurityPage() {
  const user = useUserStore((state) => state.user);
  const userId = user?.id || getTestUserId();
  const userEmail = user?.email || "dominhhieu192004@gmail.com";
  const { getUserById } = useAccount();
  const [loading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [userDetails, setUserDetails] = useState<UserWithoutPassword | null>(null);

  useEffect(() => {
    if (userId) {
      const loadUserDetails = async () => {
        try {
          const details = await getUserById(userId);
          if (details) {
            setUserDetails(details);
            setTwoFactorEnabled(details.twoFactorEnabled || false);
          }
        } catch {
          toast.error("Lỗi khi tải thông tin tài khoản");
        }
      };
      loadUserDetails();
    }
  }, [userId, getUserById]);

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <p>Vui lòng đăng nhập để truy cập trang này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Toaster position="top-right" richColors />
      <BreadcrumbComponent
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tài khoản của tôi", href: "/account" },
          { label: "Cài đặt bảo mật" },
        ]}
      />

      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">CÀI ĐẶT BẢO MẬT</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>Xác thực hai bước (2FA)</CardTitle>
                <CardDescription>
                  Tăng cường bảo mật tài khoản với mã xác thực qua email
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bật xác thực hai bước</p>
                  <p className="text-sm text-gray-600">
                    Mã xác thực sẽ được gửi đến email: {userEmail}
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={(checked) => setTwoFactorEnabled(checked)}
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <PasswordManagementCard userId={userId} userEmail={userEmail} />

        {userDetails && (
          <AccountInfoCard user={userDetails} twoFactorEnabled={twoFactorEnabled} />
        )}
      </div>
    </div>
  );
}