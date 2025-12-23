import { getAllBlogPosts } from "@/src/lib/api";
import type { BlogPost } from "@/src/lib/api";
import BlogPageContent from "@/src/components/blog/BlogPageContent";
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

  return <BlogPageContent blogPosts={blogPosts} />;
}
