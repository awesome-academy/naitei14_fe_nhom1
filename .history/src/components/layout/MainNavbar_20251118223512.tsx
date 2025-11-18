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

const MainNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    }, 150);
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
          <Link href="/" className="flex items-center space-x-2">
            <Image
              width={130}
              height={80}
              alt="Wine House Logo"
              src="/Image_Rudu/logo2.jpg"
              className="object-contain"
            />
          </Link>

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

          <div className="flex items-center space-x-2 lg:space-x-4"></div>
        </div>
      </div>

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
