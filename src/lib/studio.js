export const STARTER_STARS = [[110,120],[300,80],[440,230],[510,110],[300,380],[160,230],[80,380],[440,440],[300,520],[510,540],[100,530],[500,330]]
export const KITE_PATH = [1, 2, 4, 5, 1, 2, 4, 8]

export function addConnection(path, index) {
  return path.at(-1) === index || path.length >= 100 ? path : [...path, index]
}

export function freshStars(random = Math.random) {
  return Array.from({ length: 12 }, (_, index) => [100 + index % 3 * 200 + (random() - .5) * 36, 90 + Math.floor(index / 3) * 140 + (random() - .5) * 36])
}
