// src/utils/format.currency.ts

import { CONFIG, UI_TEXT } from "@/src/constants/ui";

const VIETNAM_LOCALE = CONFIG.DEFAULT_LOCALE;
const DEFAULT_CURRENCY_STRING_TEST = UI_TEXT.DEFAULT_CURRENCY_STRING; // Assumed to be "0 đ"

export const formatCurrency = (amount: number, showCurrency = true): string => {
  // Check for invalid amount (null, undefined, NaN, or 0)
  if (!amount || isNaN(amount)) {
    return showCurrency ? DEFAULT_CURRENCY_STRING_TEST : "0";
  }

  // Determine if the amount is a whole number to avoid unnecessary trailing .00
  const isDecimal = amount % 1 !== 0;

  // C067: Using constant for locale
  const formatted = amount.toLocaleString(VIETNAM_LOCALE, {
    // Ensure two decimal places if it's a decimal number, otherwise zero
    minimumFractionDigits: isDecimal ? 2 : 0,
    maximumFractionDigits: isDecimal ? 2 : 0,
  });

  // Append currency symbol (" đ") when showCurrency is true, to match test expectations.
  return showCurrency ? `${formatted} đ` : formatted;
};

export const formatPrice = (price: number) => formatCurrency(price);

export const formatAmount = (amount: number) => formatCurrency(amount, false);

export const formatDiscount = (amount: number) => `-${formatPrice(amount)}`;

export const formatPriceWithColor = (price: number, isDiscount = false) => {
  const formatted = formatPrice(price);
  return isDiscount ? `-${formatted}` : formatted;
};
