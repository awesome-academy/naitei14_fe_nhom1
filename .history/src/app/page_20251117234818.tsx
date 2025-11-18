import AboutSection from "@/src/app/components/sections/AboutSection";
import FeaturedProductSection from "@/src/app/components/sections/FeaturedProductSection";
import NewProductsSection from "@/src/app/components/sections/NewProductsSection";
import GallerySection from "@/src/app/components/sections/GallerySection";
import BestSellersSection from "@/src/app/components/sections/BestSellersSection";
import BlogSection from "@/src/app/components/sections/BlogSection";
import TestimonialSection from "@/src/app/components/sections/TestimonialSection";
import ProductCompareButton from "@/src/app/components/ProductCompareButton";

const mockProduct = {
  id: 1,
  name: "Rượu Vang Đỏ Mẫu",
  price: 500000,
  image: "/Image_Rudu/mock-wine-1.jpg",
};

const mockProductsList = [
  { ...mockProduct, id: 2, name: "Vang Trắng Tuyệt Hảo" },
  { ...mockProduct, id: 3, name: "Sparkling Joy" },
];

const mockBlogPost = {
  id: 1,
  title: "Bí quyết chọn rượu vang",
  image: "https://i.pravatar.cc/300",
};

const mockTestimonial = {
  id: 1,
  quote: "Dịch vụ tuyệt vời, rượu chất lượng cao!",
  author: "Khách hàng A",
};

const mockAbout = {
  title: "GIỚI THIỆU",
  content:
    "Chào mừng đến với DinkShop - nơi cung cấp những chai rượu vang tuyệt hảo từ khắp nơi trên thế giới. Đây là nội dung giả lập.",
  image: "https://i.pravatar.cc/300",
};

const mockGallery = [
  { id: 1, url: "https://i.pravatar.cc/300", alt: "Gallery Item 1" },
  { id: 2, url: "https://i.pravatar.cc/300", alt: "Gallery Item 2" },
];

export default async function HomePage() {
  const newProducts = mockProductsList;
  const bestSellers = mockProductsList;
  const blogPosts = [mockBlogPost];
  const testimonials = [mockTestimonial];
  const about = mockAbout;
  const featured = mockProduct;
  const galleryData = mockGallery;

  return (
    <div className="min-h-screen bg-white">
      <AboutSection about={about} />
      <FeaturedProductSection product={featured} />
      <NewProductsSection products={newProducts} />
      <GallerySection gallery={galleryData} />
      <BestSellersSection products={bestSellers} />
      <BlogSection posts={blogPosts} />
      <TestimonialSection testimonials={testimonials} />
      <ProductCompareButton />
    </div>
  );
}
