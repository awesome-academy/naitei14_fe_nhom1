import { CONFIG, UI_TEXT } from "@/src/constants/ui";

const VIETNAM_LOCALE = CONFIG.DEFAULT_LOCALE;
const DEFAULT_CURRENCY_STRING_TEST = UI_TEXT.DEFAULT_CURRENCY_STRING;

export const formatCurrency = (
  amount: number | string | null | undefined,
  showCurrency = true
): string => {
  let parsedAmount: number | null | undefined;

  if (typeof amount === "string") {
    parsedAmount = parseFloat(amount);
  } else {
    parsedAmount = amount;
  }

  if (!parsedAmount || isNaN(parsedAmount)) {
    return showCurrency ? DEFAULT_CURRENCY_STRING_TEST : "0";
  }

  const isDecimal = parsedAmount % 1 !== 0;

  const formatted = parsedAmount.toLocaleString(VIETNAM_LOCALE, {
    minimumFractionDigits: isDecimal ? 2 : 0,
    maximumFractionDigits: isDecimal ? 2 : 0,
  });

  return showCurrency ? `${formatted} đ` : formatted;
};

export const formatPrice = (price: number) => formatCurrency(price);
export const formatAmount = (amount: number) => formatCurrency(amount, false);

export const formatDiscount = (amount: number) => `-${formatPrice(amount)}`;

export const formatPriceWithColor = (price: number, isDiscount = false) => {
  const formatted = formatPrice(price);
  return isDiscount ? `-${formatted}` : formatted;
};
