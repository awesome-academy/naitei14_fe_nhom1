export interface Product {
  id: string;
  status?: string;
  reviewCount?: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  stock: number;
  features: string[];
  discount?: number;
}
