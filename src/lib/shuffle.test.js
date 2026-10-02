import test from 'node:test'
import assert from 'node:assert/strict'
import { ARCHIVE_START } from './dates.js'
import { imageIdentity, nextDiscovery, randomArchiveDate } from './shuffle.js'

test('random archive dates include both bounds and never reuse excluded dates', () => {
  const today = '2026-10-03'
  assert.equal(randomArchiveDate(today, new Set(), () => 0), ARCHIVE_START)
  assert.equal(randomArchiveDate(today, new Set(), () => .999999), today)
  assert.equal(randomArchiveDate(today, new Set([ARCHIVE_START]), () => 0), '1995-06-17')
  assert.throws(() => randomArchiveDate(ARCHIVE_START, new Set([ARCHIVE_START]), () => 0))
})

test('shuffle skips video, placeholder, repeated photos, missing entries and failed image previews', async () => {
  const seenDates = new Set()
  const seenImages = new Set([imageIdentity('https://example.com/seen.jpg?w=100')])
  const samples = [
    { mediaType: 'video' },
    { mediaType: 'image', image: 'https://example.com/news-thumbnail.png' },
    { mediaType: 'image', image: 'https://example.com/seen.jpg?w=1000' },
    { missing: true },
    { mediaType: 'image', image: 'https://example.com/broken.jpg' },
    { mediaType: 'image', image: 'https://example.com/new.jpg' },
  ]
  let calls = 0
  const prepared = []
  const entry = await nextDiscovery({
    today: '2026-10-03', random: () => 0, seenDates, seenImages,
    fetchEntry: async (date) => {
      const sample = samples[calls++]
      if (sample.missing) throw Object.assign(new Error('Missing date'), { code: 'APOD_NOT_FOUND' })
      return { ...sample, date }
    },
    prepareImage: async (image) => {
      prepared.push(image)
      if (image.endsWith('broken.jpg')) throw Object.assign(new Error('Missing image'), { code: 'IMAGE_PREVIEW_UNAVAILABLE' })
    },
  })
  assert.equal(entry.image, 'https://example.com/new.jpg')
  assert.equal(calls, 6)
  assert.equal(seenDates.size, 6)
  assert.deepEqual(prepared, ['https://example.com/broken.jpg', 'https://example.com/new.jpg'])
  assert.ok(seenImages.has(imageIdentity(entry.image)))
})

test('network and rate-limit failures stop immediately rather than repeatedly calling NASA', async () => {
  let calls = 0
  await assert.rejects(nextDiscovery({
    seenDates: new Set(), seenImages: new Set(),
    fetchEntry: async () => { calls++; throw new Error('NASA is receiving too many requests.') },
    prepareImage: async () => {},
  }), /too many requests/)
  assert.equal(calls, 1)
})

test('shuffle stops after eight unavailable candidates and respects cancellation', async () => {
  let calls = 0
  const options = {
    seenDates: new Set(), seenImages: new Set(),
    fetchEntry: async () => { calls++; return { mediaType: 'video' } },
    prepareImage: async () => {},
  }
  await assert.rejects(nextDiscovery(options), /try another set/)
  assert.equal(calls, 8)
  await assert.rejects(nextDiscovery({ ...options, signal: AbortSignal.abort() }), { name: 'AbortError' })
  assert.equal(calls, 8)
})
