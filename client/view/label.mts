export function label(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new RangeError("invalid cents");
  return `$${(cents / 100).toFixed(2)}`;
}
