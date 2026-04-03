export const getUserCurrency = (): string => {
  try {
    if (typeof window === "undefined") return "USD";
    const locale = window.navigator.language;
    const currency = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
    }).resolvedOptions().currency;

    return currency || "USD";
  } catch (e) {
    return "USD";
  }
};

export const formatCurrency = (
  value: string | number = 0,
  currency: string = "NGN",
  showSymbol: boolean = true,
): string => {
  const amount = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(amount)) return `${currency}\u00A00.00`;

  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return showSymbol ? `${currency}\u00A0${formattedAmount}` : formattedAmount;
};