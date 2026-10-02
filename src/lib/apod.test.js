import test from 'node:test'
import assert from 'node:assert/strict'
import { ARCHIVE_START, apodDateCode, nasaToday, validateDate } from './dates.js'
import { safeUrl, selectApod, videoEmbedUrl } from './apod-data.js'

test('date validation accepts archive bounds and leap days, rejects impossible dates', () => {
  const today = '2026-10-02'
  assert.equal(validateDate(ARCHIVE_START, today), '')
  assert.equal(validateDate(today, today), '')
  assert.equal(validateDate('2024-02-29', today), '')
  for (const date of ['', '2023-02-29', '2024-02-30', '1995-06-15', '2026-10-03']) {
    assert.notEqual(validateDate(date, today), '')
  }
})

test('NASA day follows Eastern time rather than the visitor timezone', () => {
  assert.equal(nasaToday(new Date('2026-10-02T02:00:00Z')), '2026-10-01')
  assert.equal(nasaToday(new Date('2026-10-02T12:00:00Z')), '2026-10-02')
})

test('new NASA route uses YYMMDD including dates in the previous century', () => {
  assert.equal(apodDateCode('1995-06-16'), '950616')
  assert.equal(apodDateCode('2024-01-01'), '240101')
})

test('API data must match the requested date, never silently show a different birthday', () => {
  const entry = { date: '2024-01-01', title: 'Galaxy', media_type: 'image' }
  assert.equal(selectApod(entry, entry.date), entry)
  assert.equal(selectApod([entry], entry.date), entry)
  assert.throws(() => selectApod(entry, '2024-01-02'))
  assert.throws(() => selectApod([], entry.date))
})

test('media links reject executable URLs and embeds use approved hosts', () => {
  assert.equal(safeUrl('javascript:alert(1)'), '')
  assert.equal(safeUrl('not-a-url'), '')
  assert.equal(videoEmbedUrl('https://youtu.be/dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
  assert.equal(videoEmbedUrl('https://youtube.com/embed/dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
  assert.equal(videoEmbedUrl('https://player.vimeo.com/video/123456'), 'https://player.vimeo.com/video/123456')
  assert.equal(videoEmbedUrl('https://youtube.com.evil.example/embed/dQw4w9WgXcQ'), '')
})
