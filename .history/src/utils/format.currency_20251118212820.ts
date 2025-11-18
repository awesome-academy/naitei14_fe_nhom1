// Define constants for locale and default currency string
const VIETNAM_LOCALE = "vi-VN";
const DEFAULT_CURRENCY_STRING = "0 đ";

export const formatCurrency = (
  value: number | string | null | undefined
): string => {
  const parsedNumberValue = typeof value === "string" ? parseInt(value) : value;

  if (parsedNumberValue === null || parsedNumberValue === undefined)
    return DEFAULT_CURRENCY_STRING;

  return parsedNumberValue.toLocaleString(VIETNAM_LOCALE) + " đ";
};
