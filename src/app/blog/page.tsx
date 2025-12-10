import Image from "next/image";
import BreadcrumbComponent from "@/src/components/breadcrumb/BreadcrumbComponent";
import { getAllBlogPosts } from "@/src/lib/api";
import type { BlogPost } from "@/src/lib/api";
import BlogList from "@/src/components/blog/BlogList"; // Import component mới tạo ở bước 1
import "./blog.css";

export default async function BlogPage() {
  // Fetch dữ liệu từ server
  let blogPosts: BlogPost[] = [];
  try {
    blogPosts = await getAllBlogPosts();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu bài viết:", error);
    blogPosts = [];
  }

  return (
    <div className="flex flex-col min-h-screen bg-white blog-page">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 w-full">
        <div className="container mx-auto px-4">
          <BreadcrumbComponent
            items={[{ label: "Trang chủ", href: "/" }, { label: "Blog" }]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <h2 className="text-lg font-bold mb-4 mt-4">
          BLOG
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
              TIN TỨC & BÀI VIẾT
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
