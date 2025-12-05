const API_URL =
  process.env.NEXT_PUBLIC_API_BASE ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : undefined);

if (!API_URL) {
  throw new Error(
    "❌ Missing NEXT_PUBLIC_API_BASE. Set environment variable before running production build."
  );
}

async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);

    if (!response.ok) {
      throw new Error(`❌ API error: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  views: number;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

export interface About {
  title: string;
  content: string;
  image: string;
}

export interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  gridClass: string;
  width?: number;
  height?: number;
}

// ==========================
// API functions
// ==========================

export const getSlides = () => fetchData<Slide[]>("slides");

export const getAllProducts = () => fetchData<Product[]>("products");

export const getProductById = (id: string) =>
  fetchData<Product>(`products/${id}`);

export const getProductsByCategory = (category: string) =>
  fetchData<Product[]>(`products?category=${encodeURIComponent(category)}`);

export const getFeaturedProducts = () =>
  fetchData<Product[]>("products?_limit=4");

export const getBestSellers = () =>
  fetchData<Product[]>("products?_sort=reviews&_order=desc&_limit=4");

export const getNewProducts = () =>
  fetchData<Product[]>("products?_sort=id&_order=desc&_limit=4");

export const getCategories = () => fetchData<Category[]>("categories");

export const getAllBlogPosts = () => fetchData<BlogPost[]>("blogs");

export const getBlogPostById = (id: string) =>
  fetchData<BlogPost>(`blogs/${id}`);

export const getRecentBlogPosts = () =>
  fetchData<BlogPost[]>("blogs?_sort=date&_order=desc&_limit=2");

export const getTestimonials = () => fetchData<Testimonial[]>("testimonials");

export const getAbout = () => fetchData<About>("about");

export const getFeatured = () => fetchData<FeaturedProduct>("featured");

export const getGallery = () => fetchData<GalleryImage[]>("gallery");
