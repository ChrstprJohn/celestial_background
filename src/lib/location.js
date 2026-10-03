// Only call from the visitor's browser with a fresh, consented location reading.
export async function resolveLocation(coords, request = fetch) {
  const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client')
  url.search = new URLSearchParams({ latitude: coords.latitude, longitude: coords.longitude, localityLanguage: 'en' })
  try {
    const response = await request(url, { signal: AbortSignal.timeout(8000), referrerPolicy: 'no-referrer' })
    if (!response.ok) throw new Error('Geocoding failed')
    const data = await response.json()
    const text = (value) => typeof value === 'string' ? value.trim() : ''
    const city = text(data.city)
    const locality = text(data.locality)
    return {
      ...(city ? { city } : {}),
      ...(locality ? { locality } : {}),
      region: text(data.principalSubdivision),
      country: text(data.countryName),
      country_code: text(data.countryCode),
      geocoding_status: city ? 'resolved' : 'city_unavailable',
      geocoding_provider: 'bigdatacloud',
    }
  } catch {
    // Keep the original GPS event even when place names cannot be resolved.
    return { geocoding_status: 'failed' }
  }
}
