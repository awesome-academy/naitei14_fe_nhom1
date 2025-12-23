"use client";

import "@/src/i18n/i18n";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const menuItems = [
  { labelKey: "header.menu.home", href: "/" },
  { labelKey: "header.menu.redWine", href: "/" },
  { labelKey: "header.menu.whiteWine", href: "/" },
  { labelKey: "header.menu.champagne", href: "/products?category=Champagne" },
  { labelKey: "header.menu.about", href: "/about" },
  { labelKey: "header.menu.blog", href: "/blog" },
  { labelKey: "header.menu.contact", href: "/contact" },
];

const MainNavbar = () => {
  const { t } = useTranslation();

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
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden xl:flex items-center space-x-6 2xl:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.labelKey}
                href={item.href}
                className="hover:text-yellow-500 transition-colors font-medium"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-3 xl:space-x-5"></div>
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;
