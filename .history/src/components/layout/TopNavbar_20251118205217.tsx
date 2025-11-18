"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
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

const routeMap: { [key: string]: string } = ROUTE_MAP || {
  "trang chủ": "/",
  "tài khoản": "/account",
};

const TopNavbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const matchedRoute = routeMap[query];

    if (matchedRoute) {
      router.push(matchedRoute);
    } else {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }

    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    // Đặt chiều cao lớn, ví dụ: h-full hoặc h-[80vh], và hình nền.
    // **Lưu ý:** Thêm **h-[80vh]** hoặc chiều cao lớn tùy ý để hình nền chiếm không gian.
    <nav
      className="w-full h-full border-b bg-cover bg-center bg-no-repeat min-h-[500px] flex flex-col justify-end"
      style={{ backgroundImage: `url(/slides/slide-1.jpg)` }}
    >
      {/* Container cho nội dung navbar, được đẩy xuống dưới cùng bằng **justify-end** và áp dụng độ mờ 50% bằng **bg-black/50** */}
      <div className="w-full bg-black/50 backdrop-blur-sm p-2">
        <div className="flex justify-between items-center h-7 text-xs tracking-tight max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            {commonNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:underline text-white"
              >
                {item.label}
              </Link>
            ))}
            {guestNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:underline text-white"
              >
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
                className="placeholder:text-xs placeholder:italic placeholder:text-gray-400 border-none focus-visible:ring-0 pr-8 w-48 bg-white/80"
                placeholder="Tìm kiếm sản phẩm hoặc điều hướng..."
              />
              <Search
                className="absolute right-2 top-1/2 transform -translate-y-1/2 size-4 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                onClick={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
