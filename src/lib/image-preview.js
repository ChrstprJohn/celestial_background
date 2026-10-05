// NASA's existing image-size parameters keep previews small without changing
// the original URL used for downloads. Other hosts and animated files pass through.
export function imagePreviewUrl(source, size = 1280) {
  try {
    const url = new URL(source)
    if (url.hostname !== 'assets.science.nasa.gov' || !/\.(?:jpe?g|png|webp)$/i.test(url.pathname)) return source
    url.searchParams.set('w', String(size))
    url.searchParams.set('h', String(size))
    url.searchParams.set('fit', 'clip')
    url.searchParams.delete('crop')
    return url.href
  } catch { return source }
}
