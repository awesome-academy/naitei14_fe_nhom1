export const formatCurrency = (
  value: number | string | null | undefined
): string => {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  if (numberValue === null || numberValue === undefined || isNaN(numberValue)) return "0 đ";
  return numberValue.toLocaleString("vi-VN") + " đ";
};
