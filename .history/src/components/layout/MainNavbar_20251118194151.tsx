"use client";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
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
import { useEffect, useState, useRef } from "react";
import styles from "./MainNavbar.module.css";

const useCartStore = () => ({ cart: { items: [] } });
const useUserStore = () => ({ user: null });
const useNotifications = () => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  markAllAsSeen: () => {},
  fetchNotifications: () => {},
});

const menuItems = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "GIỚI THIỆU", href: "/about" },
  { label: "BLOG", href: "/blog" },
];

export default function MainNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { cart } = useCartStore();
  const { user } = useUserStore();
  const { notifications, unreadCount, loading } = useNotifications();

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between">
        <Link href="/">
          <Image
            width={130}
            height={80}
            alt="Wine House Logo"
            src="/Image_Rudu/logo2.jpg"
          />
        </Link>

        <nav className="hidden xl:flex space-x-6">
          {menuItems.map((item) => (
            <Link key={item.label} className={styles.navLink} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Heart />
          </Button>

          <Link href="/login">
            <Button variant="ghost" size="sm">
              <User />
            </Button>
          </Link>

          <Button variant="ghost" size="sm">
            <Bell />
          </Button>

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="sm">
              <ShoppingCart />
            </Button>
            <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black">
              {cart.items.length}
            </Badge>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="xl:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
    </header>
  );
}
