import {
  getAbout,
  getBestSellers,
  getFeatured,
  getGallery,
  getNewProducts,
  getRecentBlogPosts,
  getTestimonials,
} from "@/src/lib/api";
import FeaturedProductSection from "@/src/components/sections/FeaturedProductSection";
import NewProductsSection from "@/src/components/sections/NewProductsSection";
import BestSellersSection from "../components/sections/BestSellersSection";
import AboutSection from "../components/sections/AboutSection";
import ProductCompareButton from "../components/ProductCompareButton";
import GallerySection from "../components/sections/GallerySection";
import BlogSection from "../components/sections/BlogSection";
import TestimonialSection from "../components/sections/TestimonialSection";

export default async function HomePage() {
  // Fetch data in parallel with fallbacks so trang chủ luôn render
  const [
    newProducts,
    bestSellers,
    blogPosts,
    testimonials,
    about,
    featured,
    gallery,
  ] = await Promise.all([
    getNewProducts().catch(() => []),
    getBestSellers().catch(() => []),
    getRecentBlogPosts().catch(() => []),
    getTestimonials().catch(() => []),
    getAbout().catch(() => ({
      title: "GIỚI THIỆU",
      content:
        "Chào mừng đến với DinkShop - nơi cung cấp những chai rượu vang tuyệt hảo từ khắp nơi trên thế giới.",
      image: "/Image_Rudu/df3218bb45274009c6c3d5de8a6b98bf.jpg",
    })),
    getFeatured().catch(() => null),
    getGallery().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <AboutSection about={about} />
      {featured && <FeaturedProductSection product={featured} />}
      <NewProductsSection products={newProducts} />
      <GallerySection gallery={gallery} />
      <BestSellersSection products={bestSellers} />
      <BlogSection posts={blogPosts} />
      <TestimonialSection testimonials={testimonials} />
      <ProductCompareButton />
    </div>
  );
}
