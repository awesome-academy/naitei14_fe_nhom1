<<<<<<< HEAD
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid px-5 transition-colors hover:border-transparent dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
=======
import {
  getAbout,
  getBestSellers,
  getFeatured,
  getGallery,
  getNewProducts,
  getRecentBlogPosts,
  getTestimonials,
} from "@/src/lib/api";
import AboutSection from "@/src/components/sections/AboutSection";
import FeaturedProductSection from "@/src/components/sections/FeaturedProductSection";
import NewProductsSection from "@/src/components/sections/NewProductsSection";
import GallerySection from "@/src/components/sections/GallerySection";
import BestSellersSection from "@/src/components/sections/BestSellersSection";
import BlogSection from "@/src/components/sections/BlogSection";
import TestimonialSection from "@/src/components/sections/TestimonialSection";
import ProductCompareButton from "@/src/components/ProductCompareButton";

export default async function RenderHomePage() {
  const [newProducts, bestSellers, blogPosts, testimonials, about, featured] =
    await Promise.all([
      getNewProducts().catch(() => []),
      getBestSellers().catch(() => []),
      getRecentBlogPosts().catch(() => []),
      getTestimonials().catch(() => []),
      getAbout().catch(() => ({
        title: "GIỚI THIỆU",
        content:
          "Chào mừng đến với DrinkShop - nơi cung cấp những chai rượu vang tuyệt hảo từ khắp nơi trên thế giới.",
        image: "/Image_Rudu/df3218bb45274009c6c3d5de8a6b98bf.jpg",
      })),
      getFeatured().catch(() => null),
      getGallery().catch(() => []),
    ]);

  const galleryData = await getGallery().catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      <AboutSection about={about} />
      {featured && <FeaturedProductSection product={featured} />}
      <NewProductsSection products={newProducts} />
      <GallerySection gallery={galleryData} />
      <BestSellersSection products={bestSellers} />
      <BlogSection posts={blogPosts} />
      <TestimonialSection testimonials={testimonials} />
      <ProductCompareButton />
>>>>>>> 425669f (init code base)
    </div>
  );
}
