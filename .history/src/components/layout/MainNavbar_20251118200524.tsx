"use client";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  ChevronDown,
  Heart,
  Menu,
  Bell,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";

import styles from "./MainNavbar.module.css";

const menuItems = [
  {
    label: "TRANG CHỦ",
    href: "/",
  },
  {
    label: "RƯỢU VANG ĐỎ",
    href: "/",
    submenu: [
      {
        label: "Rượu Vang Đỏ Pháp",
        href: "/",
      },
      {
        label: "Rượu Vang Đỏ Ý",
        href: "/",
      },
      {
        label: "Rượu Vang Đỏ Tây Ban Nha",
        href: "/",
      },
      {
        label: "Rượu Vang Đỏ Chile",
        href: "/",
      },
    ],
  },
  {
    label: "RƯỢU VANG TRẮNG",
    href: "/",
    submenu: [
      {
        label: "Rượu Vang Trắng Pháp",
        href: "/",
      },
      {
        label: "Rượu Vang Trắng Ý",
        href: "/",
      },
      {
        label: "Rượu Vang Trắng Đức",
        href: "/",
      },
    ],
  },
  {
    label: "CHAMPAGNE",
    href: "/products?category=Champagne",
  },
  {
    label: "GIỚI THIỆU",
    href: "/about",
  },
  {
    label: "BLOG",
    href: "/blog",
  },
  {
    label: "LIÊN HỆ",
    href: "/contact",
  },
];

// Component Placeholder cho NotificationsPopover nếu bạn chưa có logic cho nó
// Hoặc bạn có thể bỏ qua nó nếu không muốn hiển thị Popover
const NotificationsPopoverPlaceholder = ({ loading }: { loading: boolean }) => {
  return (
    <div
      className={`${styles.submenuDropdown} ${styles.visible}`}
      style={{ width: "300px", padding: "10px" }}
    >
      <div className="p-4 text-sm text-gray-400 bg-gray-900 rounded-md shadow-lg">
        {loading ? "Đang tải..." : "Không có thông báo mới."}
      </div>
    </div>
  );
};

const MainNavbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Submenu hover state management (giữ nguyên để giữ UI desktop)
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmenuEnter = useCallback((itemLabel: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredSubmenu(itemLabel);
  }, []);

  const handleSubmenuLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredSubmenu(null);
    }, 150); // 150ms delay before hiding
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const unreadCount = 2;
  const cartItemCount = 3;

  const handleOpenChange = (open: boolean) => {};

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 lg:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              width={130}
              height={80}
              alt="Wine House Logo"
              src="/Image_Rudu/logo2.jpg"
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-6 2xl:space-x-8">
            {menuItems.map((item) => (
              <div key={item.label} className="relative">
                {item.submenu ? (
                  <div
                    className={styles.submenuContainer}
                    onMouseEnter={() => handleSubmenuEnter(item.label)}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <button className={styles.submenuTrigger}>
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {/* Bridge area to prevent gap issues */}
                    <div className={styles.submenuBridge} />
                    <div
                      className={`${styles.submenuDropdown} ${
                        hoveredSubmenu === item.label
                          ? styles.visible
                          : styles.hidden
                      }`}
                    >
                      <div className={styles.submenuContent}>
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className={styles.submenuItem}
                            onClick={() => setHoveredSubmenu(null)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Wishlist/Heart Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-yellow-500 hidden sm:flex"
            >
              <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
            {/* User/Login Button */}
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-yellow-500 hidden sm:flex"
              >
                <User className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
            </Link>
            <div className="relative">
              <Popover onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-yellow-500"
                  >
                    <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                  </Button>
                </PopoverTrigger>
              </Popover>
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {/* Cart/Shopping Cart Button */}
            <Link href="/cart" className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-yellow-500"
              >
                <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
              <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs">
                {cartItemCount}
              </Badge>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="xl:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="xl:hidden bg-black border-t border-gray-800">
          <nav className="container mx-auto px-4 py-4 max-h-96 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.label} className="py-2">
                <Link
                  href={item.href}
                  className="block text-white hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.submenu && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block text-gray-300 hover:text-yellow-500 text-sm py-1"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile-only links */}
            <div className="border-t border-gray-800 mt-4 pt-4 sm:hidden">
              <Link
                href="/login"
                className="flex items-center space-x-3 py-2 text-white hover:text-yellow-500"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Đăng nhập</span>
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center space-x-3 py-2 text-white hover:text-yellow-500"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                <span>Yêu thích</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MainNavbar;
