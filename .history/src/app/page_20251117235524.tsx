import AboutSection from "@/src/app/components/sections/AboutSection";
import FeaturedProductSection from "@/src/app/components/sections/FeaturedProductSection";
import NewProductsSection from "@/src/app/components/sections/NewProductsSection";
import GallerySection from "@/src/app/components/sections/GallerySection";
import BestSellersSection from "@/src/app/components/sections/BestSellersSection";
import BlogSection from "@/src/app/components/sections/BlogSection";
import TestimonialSection from "@/src/app/components/sections/TestimonialSection";
import ProductCompareButton from "@/src/app/components/ProductCompareButton";

// --- COMPLETE MOCK DATA ---
const mockProduct = {
  id: "1", // Changed to string to match interface
  name: "Rượu Vang Đỏ Mẫu Đặc Biệt",
  price: 500000,
  originalPrice: 750000, // Added for completeness
  image: "https://i.pravatar.cc/300?img=wine1",
  // FIX: ADDED THE MANDATORY COUNTDOWN OBJECT
  countdown: {
    days: 5,
    hours: 12,
    minutes: 30,
    seconds: 45,
  },
};

const mockProductsList = [
  { ...mockProduct, id: "2", name: "Vang Trắng Tuyệt Hảo" },
  { ...mockProduct, id: "3", name: "Sparkling Joy Bubbly" },
];

const mockBlogPost = {
  id: "1",
  title: "Bí quyết chọn rượu vang ngon như chuyên gia",
  image: "https://i.pravatar.cc/300?img=blog",
};

const mockTestimonial = {
  id: "1",
  name: "Nguyễn Văn A",
  role: "Chủ nhà hàng",
  content: "Dịch vụ tuyệt vời, rượu chất lượng cao, giao hàng nhanh chóng!",
};

const mockAbout = {
  title: "GIỚI THIỆU",
  content:
    "Chào mừng đến với DinkShop - nơi cung cấp những chai rượu vang tuyệt hảo từ khắp nơi trên thế giới. Chúng tôi cam kết mang đến trải nghiệm thưởng thức tinh tế nhất.",
  image: "https://i.pravatar.cc/300?img=about",
};

const mockGallery = [
  {
    id: "1",
    src: "https://i.pravatar.cc/300?img=g1",
    alt: "Gallery Item 1",
    gridClass: "col-span-2 row-span-2",
  },
  {
    id: "2",
    src: "https://i.pravatar.cc/300?img=g2",
    alt: "Gallery Item 2",
    gridClass: "col-span-1",
  },
];
// --- END MOCK DATA ---

export default async function HomePage() {
  // Direct assignment of mock data replaces all API fetching
  const newProducts = mockProductsList;
  const bestSellers = mockProductsList;
  const blogPosts = [mockBlogPost];
  const testimonials = [mockTestimonial];
  const about = mockAbout;
  const featured = mockProduct; // Now carries the correct countdown property
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
