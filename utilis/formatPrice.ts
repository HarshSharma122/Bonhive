export function formatPrice(num: number) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "k";
  }
  return num.toLocaleString();
}
