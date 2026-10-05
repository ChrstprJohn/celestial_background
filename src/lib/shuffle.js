import { ARCHIVE_START, nasaToday } from './dates.js'
import { imagePreviewUrl } from './image-preview.js'

const DAY = 86400000

export function randomArchiveDate(today, excluded = new Set(), random = Math.random) {
  const start = Date.parse(`${ARCHIVE_START}T12:00:00Z`)
  const end = Date.parse(`${today}T12:00:00Z`)
  const count = Math.floor((end - start) / DAY) + 1
  if (!Number.isFinite(count) || count < 1) throw new Error('The archive date range is unavailable.')
  const first = Math.min(count - 1, Math.max(0, Math.floor(random() * count)))
  // A bounded scan also works when the random generator hits an earlier date.
  for (let offset = 0; offset < count; offset++) {
    const date = new Date(start + ((first + offset) % count) * DAY).toISOString().slice(0, 10)
    if (!excluded.has(date)) return date
  }
  throw new Error('You’ve explored every available day. Refresh to start again.')
}

export function imageIdentity(source) {
  const url = new URL(source)
  return `${url.origin}${url.pathname}`
}

function isArchiveImage(entry) {
  return entry.mediaType === 'image' && entry.image && !/(?:news-thumbnail|nasa[-_]logo)\./i.test(entry.image)
}

export async function nextDiscovery({ fetchEntry, prepareImage, seenDates, seenImages, signal, today = nasaToday(), random = Math.random }) {
  for (let attempt = 0; attempt < 8; attempt++) {
    signal?.throwIfAborted()
    const date = randomArchiveDate(today, seenDates, random)
    seenDates.add(date)
    let entry
    try { entry = await fetchEntry(date, signal) } catch (error) {
      if (error.code === 'APOD_NOT_FOUND') continue
      throw error
    }
    signal?.throwIfAborted()
    if (!isArchiveImage(entry) || seenImages.has(imageIdentity(entry.image))) continue
    try { await prepareImage(entry.image, signal) } catch (error) {
      if (signal?.aborted) signal.throwIfAborted()
      if (error.code === 'IMAGE_PREVIEW_UNAVAILABLE') continue
      throw error
    }
    signal?.throwIfAborted()
    seenImages.add(imageIdentity(entry.image))
    return entry
  }
  throw new Error('Those archive images weren’t available. Press Surprise me to try another set.')
}

export function prepareDiscoveryImage(source, signal) {
  return new Promise((resolve, reject) => {
    signal?.throwIfAborted()
    const image = new Image()
    const unavailable = () => Object.assign(new Error('The image could not load.'), { code: 'IMAGE_PREVIEW_UNAVAILABLE' })
    const cleanup = () => {
      clearTimeout(timeout)
      signal?.removeEventListener('abort', cancel)
      image.onload = null
      image.onerror = null
    }
    const cancel = () => {
      cleanup()
      image.removeAttribute('src')
      reject(signal.reason)
    }
    const timeout = setTimeout(() => { cleanup(); image.removeAttribute('src'); reject(unavailable()) }, 12000)
    image.onload = () => { cleanup(); image.naturalWidth > 0 ? resolve() : reject(unavailable()) }
    image.onerror = () => { cleanup(); reject(unavailable()) }
    signal?.addEventListener('abort', cancel, { once: true })
    image.src = imagePreviewUrl(source)
  })
}
