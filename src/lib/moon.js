import { Body, Illumination, MoonPhase } from 'astronomy-engine'

export const MOON_START = '1900-01-01'
export const MOON_END = '2100-12-31'

export function validateMoonDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Choose a date to find your Moon.'
  const date = new Date(`${value}T12:00:00Z`)
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return 'That date does not exist. Please choose a valid date.'
  if (value < MOON_START || value > MOON_END) return 'Choose a date between January 1, 1900 and December 31, 2100.'
  return ''
}

export function moonForDate(date) {
  const error = validateMoonDate(date)
  if (error) throw new Error(error)
  const time = new Date(`${date}T12:00:00Z`)
  const phase = MoonPhase(time)
  const fraction = Illumination(Body.Moon, time).phase_fraction
  let name
  if (phase < 2 || phase > 358) name = 'New Moon'
  else if (Math.abs(phase - 90) < 2) name = 'First quarter'
  else if (Math.abs(phase - 180) < 2) name = 'Full Moon'
  else if (Math.abs(phase - 270) < 2) name = 'Last quarter'
  else name = phase < 90 ? 'Waxing crescent' : phase < 180 ? 'Waxing gibbous' : phase < 270 ? 'Waning gibbous' : 'Waning crescent'
  return { date, name, fraction, waxing: phase < 180 }
}

export function localToday(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
