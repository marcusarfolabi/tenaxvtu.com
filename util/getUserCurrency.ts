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
