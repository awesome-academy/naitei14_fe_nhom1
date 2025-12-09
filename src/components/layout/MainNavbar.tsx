"use client";

import Image from "next/image";
import Link from "next/link";

const menuItems = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "RƯỢU VANG ĐỎ", href: "/" },
  { label: "RƯỢU VANG TRẮNG", href: "/" },
  { label: "CHAMPAGNE", href: "/products?category=Champagne" },
  { label: "GIỚI THIỆU", href: "/about" },
  { label: "BLOG", href: "/blog" },
  { label: "LIÊN HỆ", href: "/contact" },
];

const MainNavbar = () => {
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
                key={item.label}
                href={item.href}
                className="hover:text-yellow-500 transition-colors font-medium"
              >
                {item.label}
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
