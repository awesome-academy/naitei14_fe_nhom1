"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center sm:justify-center py-3 lg:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image
              width={100}
              height={60}
              alt="Wine House Logo"
              src="/Image_Rudu/logo2.jpg"
              className="object-contain md:w-[130px] md:h-20"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden xl:flex items-center space-x-6 2xl:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-yellow-500 transition-colors font-medium text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <IoMdClose size={28} /> : <CiMenuBurger size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <nav className="xl:hidden py-4 border-t border-gray-800 flex flex-col space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-yellow-500 transition-colors font-medium text-base"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};

export default MainNavbar;
