export function dateValue(date) {
  return date.toISOString().slice(0, 10)
}

export function boundedDate(value, min, max) {
  return value < min ? min : value > max ? max : value
}

export function moveCalendarMonth(value, offset, min, max) {
  const source = new Date(`${value}T12:00:00Z`)
  const target = new Date(Date.UTC(source.getUTCFullYear(), source.getUTCMonth() + offset, 1, 12))
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate()
  target.setUTCDate(Math.min(source.getUTCDate(), lastDay))
  return boundedDate(dateValue(target), min, max)
}

export function moveCalendarDay(value, offset, min, max) {
  const target = new Date(`${value}T12:00:00Z`)
  target.setUTCDate(target.getUTCDate() + offset)
  return boundedDate(dateValue(target), min, max)
}

export function calendarDays(value) {
  const month = new Date(`${value.slice(0, 7)}-01T12:00:00Z`)
  month.setUTCDate(1 - month.getUTCDay())
  return Array.from({ length: 42 }, (_, index) => moveCalendarDay(dateValue(month), index, '0001-01-01', '9999-12-31'))
}
