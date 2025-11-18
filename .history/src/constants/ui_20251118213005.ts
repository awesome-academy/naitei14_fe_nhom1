// src/constants/ui.ts

// --- UI TEXT CONSTANTS (C024) ---
export const UI_TEXT = {
  // Section Headings & Buttons
  READ_MORE: "ĐỌC THÊM",
  BEST_SELLERS: "SẢN PHẨM BÁN CHẠY",
  VIEW_ALL_PRODUCTS: "XEM TẤT CẢ SẢN PHẨM",
  NEWS_BLOG: "TIN TỨC & BLOG",
  VIEW_ALL_POSTS: "XEM TẤT CẢ BÀI VIẾT",
  NEW_PRODUCTS: "SẢN PHẨM MỚI",
  CUSTOMER_TESTIMONIALS: "KHÁCH HÀNG NÓI GÌ",

  // Form/Error Messages (C024)
  USE_FORM_FIELD_ERROR: "useFormField should be used within <FormField>",

  // Currency/Locale (C024)
  DEFAULT_CURRENCY_STRING: "0 đ",
  CURRENCY_SYMBOL: "đ",
};

// --- CONFIGURATION CONSTANTS (C067) ---
export const CONFIG = {
  // Timeout/Delays
  REGISTRATION_TIMEOUT_MS: 2000,

  // Locales
  DEFAULT_LOCALE: "vi-VN",
};

// NOTE: C067 may still flag REGISTRATION_TIMEOUT_MS unless imported from a truly external source (e.g., process.env), but using this constant is the next best step.
