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
