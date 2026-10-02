export const ARCHIVE_START = '1995-06-16'

export function nasaToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const get = (type) => parts.find((part) => part.type === type).value
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function validateDate(value, today = nasaToday()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Choose your birthday to begin.'
  const date = new Date(`${value}T12:00:00Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return 'That date does not exist. Please choose a valid date.'
  }
  if (value < ARCHIVE_START) {
    return 'NASA’s archive starts June 16, 1995. Try your birthday in a later year.'
  }
  if (value > today) return 'That day is still ahead of us. Choose a date up to today.'
  return ''
}

export function apodDateCode(date) {
  return date.slice(2).replaceAll('-', '')
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`))
}
