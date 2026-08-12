export const formatPrice = (value: number): string => {
  if (value >= 1_000_000) {
    const millions = (value / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `Ksh ${millions}M`;
  }

  if (value >= 100_000) {
    const thousands = (value / 1_000).toFixed(1).replace(/\.0$/, "");
    return `Ksh ${thousands}K`;
  }

  return `Ksh ${value.toLocaleString()}`;
};
