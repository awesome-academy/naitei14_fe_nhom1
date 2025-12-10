"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import { User } from "lucide-react";
import { UserWithoutPassword } from "@/src/types/user.types";

interface AccountInfoCardProps {
  user: UserWithoutPassword;
  twoFactorEnabled: boolean;
}

export function AccountInfoCard({ user, twoFactorEnabled }: AccountInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle>Thông tin tài khoản</CardTitle>
            <CardDescription>
              Xem thông tin cơ bản của tài khoản
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Họ tên</p>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Vai trò</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Xác thực hai bước</p>
            <p className="font-medium">
              {twoFactorEnabled ? "Đã bật" : "Chưa bật"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}