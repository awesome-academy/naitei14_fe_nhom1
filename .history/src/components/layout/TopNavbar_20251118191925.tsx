"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ROUTE_MAP } from "@/src/constants/route-map";

const commonNavItems = [
  { href: "/account", label: "Tài khoản của tôi" },
  { href: "/account/addresses", label: "Địa chỉ" },
  { href: "/account/orders", label: "Trạng thái đơn hàng" },
  { href: "/account/wishlist", label: "Danh sách ưa thích" },
  { href: "/cart", label: "Giỏ hàng" },
];

const guestNavItems = [
  { href: "/login", label: "Đăng nhập" },
  { href: "/register", label: "Đăng ký" },
];

const routeMap = ROUTE_MAP;

export default function TopNavbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const user = null;
  const logout = async () => console.log("Mock logout");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const matchedRoute = routeMap[query as keyof typeof routeMap];

    if (matchedRoute) {
      router.push(matchedRoute);
    } else {
      const products: any[] = [];
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }

    setSearchQuery("");
  };

  return (
    <nav className="w-full bg-background border-b px-72">
      <div className="flex justify-between items-center h-7 text-xs tracking-tight">
        <div className="flex items-center space-x-6 text-foreground">
          {commonNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
          {user ? (
            <Button
              variant="link"
              className="text-xs p-0 h-auto cursor-pointer text-red-700"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          ) : (
            guestNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:underline"
              >
                {item.label}
              </Link>
            ))
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="placeholder:text-xs placeholder:italic placeholder:text-gray-400 border-none focus-visible:ring-0 pr-8 w-48"
              placeholder="Tìm kiếm sản phẩm hoặc điều hướng..."
            />
            <Search
              className="absolute right-2 top-1/2 transform -translate-y-1/2 size-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
              onClick={handleSearch}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
