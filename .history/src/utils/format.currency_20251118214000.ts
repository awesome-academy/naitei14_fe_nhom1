// src/utils/format.currency.ts

import { CONFIG } from "@/src/constants/ui"; // <-- Import Constants

// C067: Using CONFIG constant
const VIETNAM_LOCALE = CONFIG.DEFAULT_LOCALE;

export const formatCurrency = (amount: number, showCurrency = true): string => {
  if (!amount || isNaN(amount)) return showCurrency ? "0 VND" : "0";

  // C067: Using named constant VIETNAM_LOCALE
  const formatted = amount.toLocaleString(VIETNAM_LOCALE);
  return showCurrency ? `${formatted} VND` : formatted;
};

export const formatPrice = (price: number) => formatCurrency(price);

export const formatAmount = (amount: number) => formatCurrency(amount, false);

export const formatDiscount = (amount: number) => `-${formatPrice(amount)}`;

export const formatPriceWithColor = (price: number, isDiscount = false) => {
  const formatted = formatPrice(price);
  return isDiscount ? `-${formatted}` : formatted;
};
