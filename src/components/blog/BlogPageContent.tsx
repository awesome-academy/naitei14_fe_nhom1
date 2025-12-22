"use client";

import "@/src/i18n/i18n";
import Image from "next/image";
import BreadcrumbComponent from "@/src/components/breadcrumb/BreadcrumbComponent";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "@/src/lib/api";
import BlogList from "./BlogList";

interface BlogPageContentProps {
  blogPosts: BlogPost[];
}

export default function BlogPageContent({ blogPosts }: BlogPageContentProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-white blog-page">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 w-full">
        <div className="container mx-auto px-4">
          <BreadcrumbComponent
            items={[
              { label: t("breadcrumb.home"), href: "/" },
              { label: t("breadcrumb.blog") },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <h2 className="text-lg font-bold mb-4 mt-4">
          {t("blog.page.title")}
          <Image
            src="/Image_Rudu/titleleft-dark.png"
            alt="arrow-trang-tri"
            width={50}
            height={20}
            className="ml-2 inline-block"
          />
        </h2>
      </div>

      {/* Hero Section */}
      <div className="w-full flex-1">
        <div className="container mx-auto px-4">
          <div className="relative rounded-lg overflow-hidden">
            <Image
              src="/Image_Rudu/slide-1.jpg"
              alt="anh-banner"
              width={1920}
              height={400}
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              {t("blog.page.newsAndPosts")}
            </h2>
            <Image
              src="/Image_Rudu/title-dark.png"
              alt="trang-tri"
              width={250}
              height={30}
              className="mx-auto"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 mb-16">
          <BlogList initialPosts={blogPosts} />
        </div>
      </div>
    </div>
  );
}



