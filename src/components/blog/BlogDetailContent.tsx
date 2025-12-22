"use client";

import "@/src/i18n/i18n";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import BreadcrumbComponent from "@/src/components/breadcrumb/BreadcrumbComponent";
import SocialShare from "./SocialShare";
import BlogMeta from "./BlogMeta";
import BackButton from "./BackButton";
import BlogContent from "./BlogContent";
import CommentsSection from "@/src/app/blog/[id]/commentSection";
import type { BlogPost } from "@/src/lib/api";

interface BlogDetailContentProps {
  post: BlogPost;
}

export default function BlogDetailContent({ post }: BlogDetailContentProps) {
  const { t } = useTranslation();

  // Get translated title
  const getTitleTranslation = (id: string, originalTitle: string) => {
    const key = `blog.title.${id}`;
    const translated = t(key);
    return translated !== key ? translated : originalTitle;
  };

  const displayTitle = getTitleTranslation(post.id, post.title);

  const breadcrumbItems = [
    { label: t("breadcrumb.home"), href: "/" },
    { label: t("breadcrumb.blog"), href: "/blog" },
    { label: displayTitle },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <BreadcrumbComponent items={breadcrumbItems} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton href="/blog" text={t("blog.backButton")} />
          </div>

          {/* Blog Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold mb-4">
              {displayTitle}
            </h1>
            <BlogMeta
              date={post.date}
              author={post.author}
              views={post.views}
              category={post.category}
              className="mb-4 lg:mb-6"
            />
          </div>

          {/* Featured Image */}
          <div className="mb-6 lg:mb-8">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={displayTitle}
              width={800}
              height={450}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Blog Content */}
          <BlogContent content={post.content} />

          {/* Social Share */}
          <SocialShare />

          <CommentsSection />

          {/* Back to Blog */}
          <BackButton href="/blog" text={t("blog.backButton")} className="mt-6" />
        </div>
      </div>
    </div>
  );
}



