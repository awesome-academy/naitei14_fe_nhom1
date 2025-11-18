export const ROUTE_MAP_SHORTENED = {
  // Common Routes (Prioritize English/Standard Vietnamese/No-diacritic Vietnamese)
  // "/"
  home: "/",
  "trang chủ": "/",
  // "/products"
  products: "/products",
  "sản phẩm": "/products",
  // "/cart"
  cart: "/cart",
  "giỏ hàng": "/cart",
  // "/account"
  account: "/account",
  "tài khoản": "/account",
  // "/login"
  login: "/login",
  "đăng nhập": "/login",
  // "/register"
  register: "/register",
  "đăng ký": "/register",
  // "/blog"
  blog: "/blog",
  "tin tức": "/blog",
  // "/lien-he"
  contact: "/lien-he",
  "liên hệ": "/lien-he",
  // "/gioi-thieu"
  about: "/gioi-thieu",
  "giới thiệu": "/gioi-thieu",

  // Account Sub-Routes (Prioritize English/Standard Vietnamese)
  // "/account/addresses"
  addresses: "/account/addresses",
  "địa chỉ": "/account/addresses",
  // "/account/orders"
  orders: "/account/orders",
  "đơn hàng": "/account/orders",
  // "/account/wishlist"
  wishlist: "/account/wishlist",
  "danh sách ưa thích": "/account/wishlist",
  "yêu thích": "/account/wishlist", // Keeping both because "yêu thích" is shorter and common

  // Product Categories (Prioritize English/Standard Vietnamese)
  // "/products?category=Rượu Vang Đỏ"
  "red wine": "/products?category=Rượu Vang Đỏ",
  "rượu vang đỏ": "/products?category=Rượu Vang Đỏ",
  // "/products?category=Rượu Vang Trắng"
  "white wine": "/products?category=Rượu Vang Trắng",
  "rượu vang trắng": "/products?category=Rượu Vang Trắng",
  // "/products?category=Champagne"
  champagne: "/products?category=Champagne",
  // "/products?category=Rượu Vang Rosé"
  rosé: "/products?category=Rượu Vang Rosé",
  "rượu vang rosé": "/products?category=Rượu Vang Rosé",
  // "/products?category=Rượu Vang Ngọt"
  "sweet wine": "/products?category=Rượu Vang Ngọt",
  "rượu vang ngọt": "/products?category=Rượu Vang Ngọt",
};
