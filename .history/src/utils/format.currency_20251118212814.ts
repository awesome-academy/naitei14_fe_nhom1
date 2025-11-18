// Define constants for locale and default currency string
const VIETNAM_LOCALE = "vi-VN";
const DEFAULT_CURRENCY_STRING = "0 đ";

export const formatCurrency = (
  value: number | string | null | undefined
): string => {
  // C042: Renamed 'numberValue' to 'parsedNumberValue' to avoid naming collision/violation
  const parsedNumberValue = typeof value === "string" ? parseInt(value) : value;

  // C024: Used named constant for default string
  if (parsedNumberValue === null || parsedNumberValue === undefined)
    return DEFAULT_CURRENCY_STRING;

  // C067: Used named constant for locale
  return parsedNumberValue.toLocaleString(VIETNAM_LOCALE) + " đ";
};
