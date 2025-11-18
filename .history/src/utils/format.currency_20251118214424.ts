// src/utils/format.currency.ts

import { CONFIG, UI_TEXT } from "@/src/constants/ui"; // Assuming constant import

const VIETNAM_LOCALE = CONFIG.DEFAULT_LOCALE;
const DEFAULT_CURRENCY_STRING_TEST = UI_TEXT.DEFAULT_CURRENCY_STRING;

// FIX: Updated type signature to accept string, null, and undefined
export const formatCurrency = (
  amount: number | string | null | undefined, // <-- FIX: Updated type here
  showCurrency = true
): string => {
  // Convert string input to number if it's a non-empty string
  let parsedAmount: number | null | undefined;

  if (typeof amount === "string") {
    // Attempt to parse string to number
    parsedAmount = parseFloat(amount);
  } else {
    parsedAmount = amount;
  }

  // Check for invalid amount (null, undefined, NaN, or 0)
  if (!parsedAmount || isNaN(parsedAmount)) {
    return showCurrency ? DEFAULT_CURRENCY_STRING_TEST : "0";
  }

  // Determine if the amount is a whole number
  const isDecimal = parsedAmount % 1 !== 0;

  const formatted = parsedAmount.toLocaleString(VIETNAM_LOCALE, {
    // Ensure two decimal places if it's a decimal number, otherwise zero
    minimumFractionDigits: isDecimal ? 2 : 0,
    maximumFractionDigits: isDecimal ? 2 : 0,
  });

  // Append currency symbol (" đ")
  return showCurrency ? `${formatted} đ` : formatted;
};

export const formatPrice = (price: number) => formatCurrency(price);
// Note: formatPrice/formatAmount definitions might also need type updates depending on context
export const formatAmount = (amount: number) => formatCurrency(amount, false);

export const formatDiscount = (amount: number) => `-${formatPrice(amount)}`;

export const formatPriceWithColor = (price: number, isDiscount = false) => {
  const formatted = formatPrice(price);
  return isDiscount ? `-${formatted}` : formatted;
};
