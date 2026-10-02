// Eye positions are measured against the full square character assets, in percent.
export const PETS = [
  {
    id: 'nebula', name: 'Nebula', description: 'A little cloud of stars with a universe of curiosity.',
    image: '/pets/nebula.png',
    eyes: [{ x: 39.45, y: 43, width: 12.2, height: 14.8 }, { x: 58.4, y: 43, width: 12.2, height: 14.8 }],
  },
  {
    id: 'orbit', name: 'Orbit', description: 'A gentle little planet. Keeps its friends in a close orbit.',
    image: '/pets/orbit.png',
    eyes: [{ x: 40.1, y: 44.1, width: 10.4, height: 14 }, { x: 57.8, y: 44.1, width: 10.4, height: 14 }],
  },
  {
    id: 'comet', name: 'Comet', description: 'Usually racing through the cosmos. Slows down to say hello.',
    image: '/pets/comet.png',
    eyes: [{ x: 47.4, y: 60.6, width: 14.8, height: 16.3 }, { x: 69.7, y: 60.6, width: 14.8, height: 16.3 }],
  },
  {
    id: 'nova', name: 'Nova', description: 'A small star with a warm heart and a quietly bright smile.',
    image: '/pets/nova.png',
    eyes: [{ x: 38.8, y: 48.4, width: 11.65, height: 15.5 }, { x: 59.1, y: 48.4, width: 11.65, height: 15.5 }],
  },
  {
    id: 'luna', name: 'Luna', description: 'A sleepy moonbeam. Always happy to share a quiet moment.',
    image: '/pets/luna.png',
    eyes: [{ x: 54.9, y: 49.4, width: 11.5, height: 14.7 }, { x: 72.9, y: 49.4, width: 11.5, height: 14.7 }],
  },
  {
    id: 'eclipse', name: 'Eclipse', description: 'A tiny black hole with an irresistible pull toward new friends.',
    image: '/pets/eclipse.png',
    eyes: [{ x: 39.4, y: 43.1, width: 11.1, height: 14.8 }, { x: 58.75, y: 43.1, width: 11.1, height: 14.8 }],
  },
]

// A continuous direction, with a small neutral area and an elliptical travel limit.
export function pupilOffset(dx, dy, width, height) {
  const distance = Math.hypot(dx, dy)
  if (distance < 2 || width <= 0 || height <= 0) return { x: 0, y: 0 }
  const strength = Math.min(1, distance / Math.max(width * 4, 1))
  const travel = .18 * strength
  return { x: dx / distance * width * travel, y: dy / distance * height * travel }
}
