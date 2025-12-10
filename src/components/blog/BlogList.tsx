"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Calendar, User, Eye } from "lucide-react";
import CustomPagination from "@/src/components/pagination/CustomPagination";
import type { BlogPost } from "@/src/lib/api";

interface BlogListProps {
  initialPosts: BlogPost[];
}

const ITEMS_PER_PAGE = 6;

export default function BlogList({ initialPosts }: BlogListProps) {
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

  if (initialPosts.length === 0) {
    return <div className="text-center py-10">Không có bài viết nào.</div>;
  }

  return (
    <>
      <div
        id="blog-top"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
      >
        {currentPosts.map((post) => (
          <Card
            key={post.id}
            className="group hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="relative">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-4 left-4 bg-yellow-500 text-black text-xs">
                {post.category}
              </Badge>
            </div>
            <CardContent className="p-4 lg:p-6">
              <Link href={`/blog/${post.id}`}>
                <h3 className="font-bold text-base lg:text-lg mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2 cursor-pointer">
                  {post.title}
                </h3>
              </Link>

              <div className="flex flex-wrap items-center text-xs lg:text-sm text-gray-500 mb-3 gap-2 lg:gap-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span>{new Date(post.date).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span>{post.views}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <Link
                href={`/blog/${post.id}`}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
              >
                Đọc thêm
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
