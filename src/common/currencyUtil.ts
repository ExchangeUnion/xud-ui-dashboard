export const satsToCoinsStr = (
  valueInSats: string | number,
  currency?: string
): string => {
  const sats =
    typeof valueInSats === "string" ? Number(valueInSats) : valueInSats;
  const coinsFixedStr = (sats / 10 ** 8).toFixed(8);
  return currency ? `${coinsFixedStr} ${currency}` : coinsFixedStr;
};

export const getCurrencyFullName = (currency: string): string => {
  switch (currency.toUpperCase()) {
    case "BTC":
      return "Bitcoin";
    case "LTC":
      return "Litecoin";
    case "ETH":
      return "Ethereum";
  }
  return currency;
};
