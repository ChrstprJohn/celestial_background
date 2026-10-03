const DAY = 86400000
// Mean sidereal orbital periods in Earth days, NASA Planetary Fact Sheet.
export const ORBIT_DAYS = { mercury: 88, venus: 224.7, earth: 365.256, mars: 687, jupiter: 4331, saturn: 10747, uranus: 30589, neptune: 59800 }

export function cosmicAge(birthday, planet, now = new Date()) {
  const start = new Date(`${birthday}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday) || !Number.isFinite(start.getTime()) || start.toISOString().slice(0, 10) !== birthday) throw new Error('Choose a valid birthday.')
  if (start > now) throw new Error('Choose a birthday up to today.')
  const period = ORBIT_DAYS[planet]
  if (!period) throw new Error('Choose one of the eight planets.')
  const days = (now - start) / DAY
  const age = days / period
  const next = new Date(start.getTime() + (Math.floor(age) + 1) * period * DAY)
  return { age, days, next, nextAge: Math.floor(age) + 1, remainingDays: Math.ceil((next - now) / DAY), period }
}
