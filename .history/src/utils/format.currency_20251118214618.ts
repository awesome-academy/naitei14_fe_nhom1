// Assuming UI_TEXT and CONFIG are defined and imported from a separate file:
export const UI_TEXT = {
  // ... other texts
  DEFAULT_CURRENCY_STRING: "0 đ",
  CURRENCY_SYMBOL: "đ", // Added this symbol for general use
};
export const CONFIG = {
  // ... other configs
  DEFAULT_LOCALE: "vi-VN",
};

export const formatCurrency = (amount: number, showCurrency = true): string => {
  // C024, C067 Fix: Use constants for locale and default currency string.
  const locale = CONFIG.DEFAULT_LOCALE;
  const currencySymbol = UI_TEXT.CURRENCY_SYMBOL;

  if (!amount || isNaN(amount))
    return showCurrency ? UI_TEXT.DEFAULT_CURRENCY_STRING : "0";

  // Determine if the amount is a whole number
  const isDecimal = amount % 1 !== 0;

  // C067: Using constant for locale
  const formatted = amount.toLocaleString(locale, {
    // Ensure consistent formatting for decimals/integers
    minimumFractionDigits: isDecimal ? 2 : 0,
    maximumFractionDigits: isDecimal ? 2 : 0,
  });

  // Append currency symbol (using the constant or the explicit symbol if 'đ' is the required suffix)
  return showCurrency ? `${formatted} ${currencySymbol}` : formatted;
};

export const formatPrice = (price: number) => formatCurrency(price);
export const formatAmount = (amount: number) => formatCurrency(amount, false);
export const formatDiscount = (amount: number) => `-${formatPrice(amount)}`;
export const formatPriceWithColor = (price: number, isDiscount = false) => {
  const formatted = formatPrice(price);
  return isDiscount ? `-${formatted}` : formatted;
};
