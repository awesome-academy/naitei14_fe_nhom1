"use client";

import "@/src/i18n/i18n";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { useUserStore } from "@/src/stores/user.store";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "../ui/button";
import { ROUTE_MAP } from "@/src/constants/route-map";
import LanguageSwitcher from "@/src/components/layout/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const commonNavItems = [
  { href: "/account", labelKey: "header.nav.account" },
  { href: "/account/addresses", labelKey: "header.nav.addresses" },
  { href: "/account/orders", labelKey: "header.nav.orders" },
  { href: "/account/wishlist", labelKey: "header.nav.wishlist" },
  { href: "/cart", labelKey: "header.nav.cart" },
];

const guestNavItems = [
  { href: "/login", labelKey: "header.nav.login" },
  { href: "/register", labelKey: "header.nav.register" },
];

// Route mappings for smart search
const routeMap = ROUTE_MAP;
const TopNavbar = () => {
  const { user } = useUserStore();
  const { logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

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

    // Check if the search query matches any route
    const matchedRoute = routeMap[query as keyof typeof routeMap];

    if (matchedRoute) {
      // Navigate to the matched route
      router.push(matchedRoute);
    } else {
      // Check if there are any products matching the search
      // Import products to check if search has results
      const { products } = require("@/src/lib/products");
      const hasProductResults = products.some((product: any) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );

      if (hasProductResults) {
        // If products found, go to product search
        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        // If no products found, go to 404 with search info
        router.push(`/not-found?search=${encodeURIComponent(searchQuery.trim())}`);
      }
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
              {t(item.labelKey)}
            </Link>
          ))}
          {user ? (
            <Button
              variant="link"
              className="text-xs p-0 h-auto cursor-pointer text-red-700"
              onClick={handleLogout}
            >
              {t("header.nav.logout")}
            </Button>
          ) : (
            guestNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:underline"
              >
                {t(item.labelKey)}
              </Link>
            ))
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative mr-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="placeholder:text-xs placeholder:italic placeholder:text-gray-400 border-none focus-visible:ring-0 pr-8 w-48"
              placeholder={t("header.search.placeholder")}
            />
            <Search
              className="absolute right-2 top-1/2 transform -translate-y-1/2 size-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
              onClick={handleSearch}
            />
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
