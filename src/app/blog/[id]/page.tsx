import { notFound } from "next/navigation";
import { getBlogPostById, getAllBlogPosts } from "@/src/lib/api";
import BlogDetailContent from "@/src/components/blog/BlogDetailContent";

// Tạo các tham số tĩnh cho trang
export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({
      id: post.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params for blog posts:", error);
    return [];
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const post = await getBlogPostById(params.id);
    return <BlogDetailContent post={post} />;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}
