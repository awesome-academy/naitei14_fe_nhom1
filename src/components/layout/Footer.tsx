"use client";

import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  FaCcMastercard,
  FaCcPaypal,
  FaFacebookF,
  FaGooglePlusG,
  FaLinkedinIn,
  FaPhoneAlt,
  FaSignal,
  FaTwitter,
} from "react-icons/fa";
import { PiMapPinFill } from "react-icons/pi";
import { IoIosMail } from "react-icons/io";
import { RiVisaLine } from "react-icons/ri";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { cn } from "@/src/lib/utils";

const footerLogos = [
  "/Image_Rudu/footer_logo1.png",
  "/Image_Rudu/footer_logo2.png",
  "/Image_Rudu/footer_logo3.png",
];

const infoItems = [
  "VỀ CHÚNG TÔI",
  "GIAO HÀNG",
  "CẢM NGHĨ",
  "LƯU TRỮ",
  "CHÍNH SÁCH RIÊNG TƯ",
];
const shoppingItems = [
  "VẬN CHUYỂN VÀ TRẢ HÀNG",
  "MUA HÀNG AN TOÀN",
  "VẬN QUỐC TẾ",
  "LIÊN KẾT",
  "DỊCH VỤ GIẢM GIÁ",
];
const socialIcons = [
  { Icon: FaTwitter, color: "text-gray-500" },
  { Icon: FaGooglePlusG, color: "text-yellow-500" },
  { Icon: FaFacebookF, color: "text-gray-500" },
  { Icon: FaLinkedinIn, color: "text-gray-500" },
  { Icon: FaSignal, color: "text-gray-500" },
];

const Footer = () => {
  return (
    <footer className="w-full border-t">
      <div className="px-4 md:px-10 lg:px-20 xl:px-40 2xl:px-72 w-full flex flex-col items-center space-y-8 py-10">
        {/* Logo Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 border-b-2 border-gray-200">
          {footerLogos.map((logo, index) => (
            <div
              key={logo}
              className={cn(
                "w-full flex items-center justify-center py-6 md:py-10",
                index !== footerLogos.length - 1 &&
                  "md:border-r-2 border-gray-100 border-b md:border-b-0"
              )}
            >
              <Image
                src={logo}
                alt="logo"
                width={150}
                height={100}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Links Section */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-sm tracking-widest font-bold mb-4">
              THÔNG TIN
            </h1>
            {infoItems.map((item, index) => (
              <span
                key={index}
                className="text-xs text-gray-700 hover:text-yellow-600 cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-sm tracking-widest font-bold mb-4">MUA HÀNG</h1>
            {shoppingItems.map((item, index) => (
              <span
                key={index}
                className="text-xs text-gray-700 hover:text-yellow-600 cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-sm tracking-widest font-bold mb-2">
              GỬI EMAIL
            </h1>
            <span className="text-xs text-gray-700">
              Gửi email cho chúng tôi để được hỗ trợ
            </span>
            <div className="flex items-center w-full max-w-xs">
              <Input
                type="email"
                placeholder="Enter email"
                className="rounded-none text-xs border-black h-9"
              />
              <Button className="rounded-none bg-black dark:bg-gray-800 h-9">
                Gửi
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-2">
              {socialIcons.map(({ Icon, color }, index) => (
                <Icon
                  key={index}
                  className={cn("size-4 cursor-pointer", color)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-sm tracking-widest font-bold mb-2">LIÊN HỆ</h1>
            <div className="flex gap-2">
              <PiMapPinFill className="size-5 shrink-0" />
              <span className="text-xs">
                Tầng 4, Tòa nhà Hanoi Group Số 442 Đội Cấn, Ba Đình, Hà Nội
              </span>
            </div>
            <div className="flex flex-col gap-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="size-3" /> <span>(04) 6677 2332</span>
              </div>
              <div className="flex items-center gap-2">
                <IoIosMail className="size-4" />{" "}
                <span className="text-yellow-500 italic">
                  Support@bizweb.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t py-4">
        <div className="px-4 md:px-10 lg:px-20 xl:px-40 2xl:px-72 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[10px] md:text-xs! text-gray-500 text-center">
            &copy; Copyright 2008-2014 DKT Technology JSC
          </span>
          <div className="flex items-center gap-4 md:gap-8 opacity-70 scale-75 md:scale-100">
            <FaCcMastercard className="size-8" />
            <RiVisaLine className="size-10" />
            <FaCcPaypal className="size-8" />
            <BsFillCreditCard2FrontFill className="size-8" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
