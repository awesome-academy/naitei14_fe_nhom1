"use client";

import "@/src/i18n/i18n";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import BlogCardSkeleton from "@/src/components/products/BlogCardSkeleton";
import { useTranslation } from "react-i18next";
// Import type BlogPost từ api
import type { BlogPost } from "@/src/lib/api";

interface BlogSectionProps {
  posts: BlogPost[]; // Đã sửa từ any[]
  title?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function BlogSection({
  posts,
  title,
  imageUrl = "/Image_Rudu/title-dark.png",
  buttonText,
  buttonLink = "/blog",
}: BlogSectionProps) {
  const { t } = useTranslation();
  const defaultTitle = title || t("home.sections.newsBlog");
  const defaultButtonText = buttonText || t("home.sections.viewAllPosts");

  // Helper function to get translated title
  const getTitleTranslation = (id: string, originalTitle: string) => {
    const key = `blog.title.${id}`;
    const translated = t(key);
    // If translation doesn't exist, i18next returns the key, so fallback to original
    return translated !== key ? translated : originalTitle;
  };

  // Helper function to get translated excerpt
  const getExcerptTranslation = (id: string, originalExcerpt: string) => {
    const key = `blog.excerpt.${id}`;
    const translated = t(key);
    // If translation doesn't exist, i18next returns the key, so fallback to original
    return translated !== key ? translated : originalExcerpt;
  };

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">{defaultTitle}</h2>
          <Image
            className="block mx-auto"
            alt="Decorative title image"
            src={imageUrl}
            width={200}
            height={200}
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {posts.length > 0
            ? posts.map((post) => {
                const displayTitle = getTitleTranslation(post.id, post.title);
                const displayExcerpt = getExcerptTranslation(post.id, post.excerpt);
                
                return (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={displayTitle}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4 lg:p-6">
                      <Link href={`/blog/${post.id}`}>
                        <h3 className="font-bold text-lg mb-2 hover:text-yellow-600 transition-colors cursor-pointer">
                          {displayTitle}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {displayExcerpt}
                      </p>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-yellow-600 hover:underline text-sm"
                      >
                        {t("home.sections.readMoreLink")}
                      </Link>
                    </CardContent>
                  </Card>
                );
              })
            : Array(2)
                .fill(0)
                .map((_, i) => <BlogCardSkeleton key={i} />)}
        </div>
        <div className="text-center mt-8">
          <Link href={buttonLink}>
            <Button variant="outline" className="bg-transparent">
              {defaultButtonText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
