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

  // Category translation using stable identifiers + alias map
  const CATEGORY_TRANSLATION_KEYS: Record<string, string> = {
    knowledge: "blog.category.knowledge",
    news: "blog.category.news",
    guide: "blog.category.guide",
    event: "blog.category.event",
  };

  const CATEGORY_ALIAS_MAP: Record<string, string> = {
    "kiến thức": "knowledge",
    knowledge: "knowledge",
    "tin tức": "news",
    news: "news",
    "hướng dẫn": "guide",
    guide: "guide",
    "sự kiện": "event",
    event: "event",
  };

  const getCategoryTranslation = (category: string) => {
    const normalized = category.trim().toLowerCase();
    const identifier = CATEGORY_ALIAS_MAP[normalized] ?? normalized;
    const translationKey = CATEGORY_TRANSLATION_KEYS[identifier];

    if (translationKey) {
      const translated = t(translationKey);
      return translated !== translationKey ? translated : category;
    }

    // Fallback: return original if no mapping
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
