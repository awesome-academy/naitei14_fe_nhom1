"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ROUTE_MAP } from "@/src/constants/route-map";
// ROUTE_MAP and products are assumed to exist in the actual project structure.

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

// Route mappings for smart search (Giả định ROUTE_MAP có sẵn, nếu không sẽ gây lỗi)
// const routeMap = ROUTE_MAP; // Giữ nguyên dòng này nếu bạn muốn dùng ROUTE_MAP thực
// Tạm thời định nghĩa một routeMap mẫu để tránh lỗi nếu ROUTE_MAP chưa được định nghĩa
const routeMap: { [key: string]: string } = {
  // Ví dụ
  "trang chủ": "/",
  "tài khoản": "/account",
};

const TopNavbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();

    // 1. Check if the search query matches any route
    const matchedRoute = routeMap[query]; // Đã bỏ 'as keyof typeof routeMap' vì routeMap không rõ kiểu

    if (matchedRoute) {
      // Navigate to the matched route
      router.push(matchedRoute);
    } else {
      // 2. Check if there are any products matching the search
      // **ĐÃ BỎ** phần import products và kiểm tra kết quả sản phẩm
      // Tạm thời, giả định rằng nếu không khớp route, ta sẽ chuyển đến trang tìm kiếm sản phẩm.

      // Chuyển đến trang tìm kiếm sản phẩm
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);

      // (Logic cũ nếu không tìm thấy sản phẩm: router.push(`/not-found?search=${encodeURIComponent(searchQuery.trim())}`);)
    }

    // Clear search after navigation
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
          {/* **ĐÃ BỎ** logic kiểm tra `user` và nút Đăng xuất */}
          {/* Chỉ hiển thị các mục của khách (guest) */}
          {guestNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
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
};

export default TopNavbar;
