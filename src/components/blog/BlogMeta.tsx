"use client";

import "@/src/i18n/i18n";
import { Calendar, User, Eye } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { useTranslation } from "react-i18next";

interface BlogMetaProps {
  date: string;
  author: string;
  views: number;
  category: string;
  className?: string;
}

const BlogMeta = ({
  date,
  author,
  views,
  category,
  className = "",
}: BlogMetaProps) => {
  const { t, i18n } = useTranslation();

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
    return date.toLocaleDateString(locale);
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

  return (
    <div
      className={`flex flex-wrap items-center text-sm text-gray-500 gap-2 lg:gap-4 ${className}`}
    >
      <div className="flex items-center space-x-1">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(date)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <User className="w-4 h-4" />
        <span>{author}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Eye className="w-4 h-4" />
        <span>{views} {t("blog.meta.views")}</span>
      </div>
      <Badge
        variant="secondary"
        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      >
        {getCategoryTranslation(category)}
      </Badge>
    </div>
  );
};

export default BlogMeta;
