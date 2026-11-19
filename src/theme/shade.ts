// Darken (amount < 0) or lighten (amount > 0) a 6-digit hex colour.
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) =>
    Math.max(0, Math.min(255, Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount)));
  const parts = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => f(c).toString(16).padStart(2, '0'));
  return `#${parts.join('')}`;
}
