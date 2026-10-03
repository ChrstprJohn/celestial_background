// Rounded gravity values (m/s²), NASA NSSDCA Planetary Fact Sheet, accessed 2026-10-03.
export const GRAVITY_WORLDS = [
  { id: 'earth', name: 'Earth', gravity: 9.8, color: '#99bacc' },
  { id: 'moon', name: 'Moon', gravity: 1.6, color: '#c9c1f0' },
  { id: 'mars', name: 'Mars', gravity: 3.7, color: '#c8805e' },
  { id: 'mercury', name: 'Mercury', gravity: 3.7, color: '#aaa49a' },
  { id: 'venus', name: 'Venus', gravity: 8.9, color: '#d7bb83' },
  { id: 'pluto', name: 'Pluto', gravity: .7, color: '#d2b49a' },
]
export function gravityJump(mass, earthHeight, gravity) {
  if (![mass, earthHeight, gravity].every((value) => Number.isFinite(value) && value > 0)) throw new Error('Enter a positive mass, jump height, and gravity.')
  const speed = Math.sqrt(2 * 9.8 * earthHeight)
  return { speed, height: speed ** 2 / (2 * gravity), duration: 2 * speed / gravity, force: mass * gravity, earthEquivalent: mass * gravity / 9.8 }
}
export function jumpHeightAt(time, speed, gravity) {
  return Math.max(0, speed * time - .5 * gravity * time ** 2)
}
