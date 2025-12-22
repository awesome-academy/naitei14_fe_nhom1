"use client";

import "@/src/i18n/i18n";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Calendar, User, Eye } from "lucide-react";
import CustomPagination from "@/src/components/pagination/CustomPagination";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "@/src/lib/api";

interface BlogListProps {
  initialPosts: BlogPost[];
}

const ITEMS_PER_PAGE = 6;

export default function BlogList({ initialPosts }: BlogListProps) {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Tính toán phân trang
  const totalPages = Math.ceil(initialPosts.length / ITEMS_PER_PAGE);
  const indexOfLastPost = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - ITEMS_PER_PAGE;

  // 3. Cắt dữ liệu để hiển thị
  const currentPosts = initialPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 4. Hàm xử lý khi chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll lên đầu khi chuyển trang (tùy chọn)
    const element = document.getElementById("blog-top");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper function to get translated title
  const getTitleTranslation = (id: string, originalTitle: string) => {
    const key = `blog.title.${id}`;
    const translated = t(key);
    return translated !== key ? translated : originalTitle;
  };

  // Helper function to get translated excerpt
  const getExcerptTranslation = (id: string, originalExcerpt: string) => {
    const key = `blog.excerpt.${id}`;
    const translated = t(key);
    return translated !== key ? translated : originalExcerpt;
  };

  // Helper function to get translated category
  const getCategoryTranslation = (category: string) => {
    if (category.includes("Kiến thức") || category.includes("Knowledge")) {
      return t("blog.category.knowledge");
    }
    if (category.includes("Tin tức") || category.includes("News")) {
      return t("blog.category.news");
    }
    if (category.includes("Hướng dẫn") || category.includes("Guide")) {
      return t("blog.category.guide");
    }
    if (category.includes("Sự kiện") || category.includes("Event")) {
      return t("blog.category.event");
    }
    return category;
  };

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
    return date.toLocaleDateString(locale);
  };

  if (initialPosts.length === 0) {
    return <div className="text-center py-10">{t("blog.list.noPosts")}</div>;
  }

  return (
    <>
      <div
        id="blog-top"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
      >
        {currentPosts.map((post) => {
          const displayTitle = getTitleTranslation(post.id, post.title);
          const displayExcerpt = getExcerptTranslation(post.id, post.excerpt);
          const displayCategory = getCategoryTranslation(post.category);
          
          return (
            <Card
              key={post.id}
              className="group hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="relative">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={displayTitle}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black text-xs">
                  {displayCategory}
                </Badge>
              </div>
              <CardContent className="p-4 lg:p-6">
                <Link href={`/blog/${post.id}`}>
                  <h3 className="font-bold text-base lg:text-lg mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2 cursor-pointer">
                    {displayTitle}
                  </h3>
                </Link>

                <div className="flex flex-wrap items-center text-xs lg:text-sm text-gray-500 mb-3 gap-2 lg:gap-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span>{post.views} {t("blog.meta.views")}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {displayExcerpt}
                </p>

                <Link
                  href={`/blog/${post.id}`}
                  className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  {t("blog.list.readMore")}
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
