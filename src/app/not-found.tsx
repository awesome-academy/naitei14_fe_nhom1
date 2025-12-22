"use client";

import "@/src/i18n/i18n";
import { useEffect, useState } from "react";
import { useLayoutStore } from "@/src/stores/layout.store";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import wine404 from "@/public/Image_Rudu/wine404.png";
import logo3 from "@/public/Image_Rudu/logo3.jpg";
import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  const setHideHeaderFooter = useLayoutStore(
    (state) => state.setHideHeaderFooter
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const failedSearch = searchParams?.get("search");

  useEffect(() => {
    setHideHeaderFooter(true);
    return () => setHideHeaderFooter(false);
  }, [setHideHeaderFooter]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center my-12">
      {/* Background Image - Wine bottles */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20">
        <Image
          src={wine404}
          alt="Wine bottles"
          width={400}
          height={600}
          className="object-contain"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white w-full mt-20">
        {/* Large 404 text */}
        <div className="relative mb-8 w-full h-min leading-none">
          <h1 className="text-[20rem] bg-[#E5AE49] font-semibold font-sans text-white leading-none select-none">
            {t("notFound.title")}
          </h1>

          {/* Overlay text */}
          <div className="absolute inset-0 flex gap-6 items-center justify-center">
            <div className="text-black text-[10rem] font-normal italic mb-2">
              {t("notFound.error")}
            </div>
            <div className="flex flex-col items-center bg-[#E5AE49]">
              <div className="text-black text-4xl font-light uppercase tracking-wider">
                {failedSearch ? t("notFound.notFound") : t("notFound.notAPage")}
              </div>
              <div className="text-black text-lg md:text-4xl italic font-bold">
                {failedSearch
                  ? t("notFound.searchResult", { query: failedSearch })
                  : t("notFound.notYourPage")}
              </div>
            </div>
          </div>
        </div>

        {/* Additional message for failed search */}
        {failedSearch && (
          <div className="mt-8 text-black text-lg">
            <p className="mb-4">
              {t("notFound.suggestion")}
            </p>
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-20 flex items-center justify-center gap-4 text-black text-sm font-semibold uppercase tracking-wider">
          <div className="mx-12">
            <Image
              src={logo3}
              alt="Wine House Logo"
              width={120}
              height={80}
              className="mx-auto object-contain"
            />
          </div>
          <Link
            href="/"
            className="hover:underline transition-all duration-300 hover:text-gray-700"
          >
            {t("notFound.links.home")}
          </Link>
          <Link
            href="/products"
            className="hover:underline transition-all duration-300 hover:text-gray-700"
          >
            {t("notFound.links.products")}
          </Link>
          <Link
            href="/lien-he"
            className="hover:underline transition-all duration-300 hover:text-gray-700"
          >
            {t("notFound.links.contact")}
          </Link>
          <div className="flex items-center space-x-2 border-2 border-gray-300 px-4">
            <Search
              className="size-6 cursor-pointer hover:text-gray-600"
              onClick={handleSearch}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("notFound.searchAgain")}
              className="border-none focus-visible:ring-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
