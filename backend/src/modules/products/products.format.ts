export function formatVndLabel(priceVnd: number): string {
  const n = Number.isFinite(priceVnd) ? Math.max(0, Math.floor(priceVnd)) : 0;
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`;
}

