export type CurrencyValue = number | string | null | undefined;

export const toNumber = (value: CurrencyValue): number => {
  if (value === null || value === undefined) return 0;

  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const formatCurrency = (
  amount: CurrencyValue,
  showCurrency = true
): string => {
  const num = toNumber(amount);

  const formatted = num.toLocaleString("vi-VN");
  return showCurrency ? `${formatted} đ` : formatted;
};

export const formatPrice = (price: CurrencyValue): string =>
  formatCurrency(price, true);

export const formatAmount = (amount: CurrencyValue): string =>
  formatCurrency(amount, false);

export const formatDiscount = (amount: CurrencyValue): string =>
  `-${formatPrice(amount)}`;

export const formatPriceWithColor = (
  price: CurrencyValue,
  isDiscount = false
): string => {
  const formatted = formatPrice(price);
  return isDiscount ? `-${formatted}` : formatted;
};
