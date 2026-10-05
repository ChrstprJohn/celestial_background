export function moonMatch(first, second) {
  const a = Math.max(0, Math.min(1, first.fraction))
  const b = Math.max(0, Math.min(1, second.fraction))
  const opposite = first.waxing !== second.waxing
  const coverage = opposite ? Math.min(1, a + b) : Math.max(a, b)
  const overlap = opposite ? Math.max(0, a + b - 1) : Math.min(a, b)
  return { coverage, overlap, fit: Math.round((coverage - overlap) * 100) }
}
