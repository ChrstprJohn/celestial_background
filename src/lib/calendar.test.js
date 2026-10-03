import test from 'node:test'
import assert from 'node:assert/strict'
import { calendarDays, moveCalendarDay, moveCalendarMonth } from './calendar.js'

const min = '1900-01-01'
const max = '2100-12-31'

test('month and year navigation preserve the day where possible and clamp leap days', () => {
  assert.equal(moveCalendarMonth('2024-01-31', 1, min, max), '2024-02-29')
  assert.equal(moveCalendarMonth('2024-02-29', 12, min, max), '2025-02-28')
  assert.equal(moveCalendarMonth('2026-01-31', -1, min, max), '2025-12-31')
})

test('calendar keyboard navigation respects archive boundaries', () => {
  assert.equal(moveCalendarMonth('1995-07-02', -1, '1995-06-16', max), '1995-06-16')
  assert.equal(moveCalendarDay('1995-06-16', -7, '1995-06-16', max), '1995-06-16')
  assert.equal(moveCalendarMonth('2026-09-30', 1, min, '2026-10-03'), '2026-10-03')
  assert.equal(moveCalendarDay('2026-10-03', 1, min, '2026-10-03'), '2026-10-03')
})

test('six calendar weeks start on Sunday and include leap days and adjacent months', () => {
  const days = calendarDays('2024-02-29')
  assert.equal(days.length, 42)
  assert.equal(days[0], '2024-01-28')
  assert.ok(days.includes('2024-02-29'))
  assert.equal(days.at(-1), '2024-03-09')
})
