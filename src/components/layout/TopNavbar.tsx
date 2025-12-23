"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { useUserStore } from "@/src/stores/user.store";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "../ui/button";
import { ROUTE_MAP } from "@/src/constants/route-map";
import { ThemeSwitcher } from "@/src/components/theme";

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

const TopNavbar = () => {
  const { user } = useUserStore();
  const { logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();
    const matchedRoute = routeMap[query as keyof typeof routeMap];

    if (matchedRoute) {
      router.push(matchedRoute);
    } else {
      const { products } = require("@/src/lib/products");
      const hasProductResults = products.some(
        (product: any) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );

      if (hasProductResults) {
        router.push(
          `/products?search=${encodeURIComponent(searchQuery.trim())}`
        );
      } else {
      }
      setSearchQuery("");
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    return (
      <nav className="w-full bg-background border-b px-4 md:px-10 lg:px-20 xl:px-40 2xl:px-72">
        <div className="flex flex-col md:flex-row justify-between items-center py-2 md:h-9 text-xs tracking-tight gap-3">
          <div className="flex items-center space-x-4 md:space-x-6 text-foreground overflow-x-auto no-scrollbar w-full md:w-auto whitespace-nowrap pb-2 md:pb-0">
            {commonNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:underline shrink-0"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Button
                variant="link"
                className="text-xs p-0 h-auto cursor-pointer text-red-700 shrink-0"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            ) : (
              guestNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:underline shrink-0"
                >
                  {item.label}
                </Link>
              ))
            )}
            <ThemeSwitcher />
          </div>

          <div className="flex items-center w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-7 placeholder:text-[10px] md:placeholder:text-xs placeholder:italic placeholder:text-gray-400 border-none focus-visible:ring-1 pr-8 w-full bg-muted/50"
                placeholder="Tìm kiếm..."
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
  };
};
export default TopNavbar;
