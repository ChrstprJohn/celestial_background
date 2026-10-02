export function safeUrl(value) {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

export function selectApod(payload, date) {
  const entries = Array.isArray(payload) ? payload : [payload]
  const entry = entries.find((item) => item?.date === date)
  if (!entry || !entry.title || !['image', 'video'].includes(entry.media_type)) {
    throw Object.assign(new Error('NASA has no entry available for that date. Try another day.'), { code: 'APOD_NOT_FOUND' })
  }
  return entry
}

export function videoEmbedUrl(value) {
  const source = safeUrl(value)
  if (!source) return ''
  const url = new URL(source)
  const host = url.hostname.replace(/^www\./, '')
  if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'youtu.be') {
    const id = host === 'youtu.be'
      ? url.pathname.slice(1)
      : url.pathname.startsWith('/embed/') ? url.pathname.split('/')[2] : url.searchParams.get('v')
    return /^[\w-]{11}$/.test(id ?? '') ? `https://www.youtube-nocookie.com/embed/${id}` : ''
  }
  if (host === 'player.vimeo.com' && /^\/video\/\d+$/.test(url.pathname)) return source
  if (host === 'vimeo.com' && /^\/\d+$/.test(url.pathname)) return `https://player.vimeo.com/video${url.pathname}`
  return ''
}
