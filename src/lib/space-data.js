import axios from 'axios'

export function normalizeStation(data) {
  const keys = ['latitude', 'longitude', 'altitude', 'velocity', 'timestamp']
  if (!data || !keys.every((key) => typeof data[key] === 'number' && Number.isFinite(data[key])) || Math.abs(data.latitude) > 90 || Math.abs(data.longitude) > 180 || data.altitude <= 0 || data.velocity < 0 || data.timestamp <= 0) throw new Error('The station feed returned an incomplete position. Please try again.')
  return { latitude: data.latitude, longitude: data.longitude, altitude: data.altitude, velocity: data.velocity, timestamp: data.timestamp }
}

export async function fetchStation(signal) {
  const { data } = await axios.get('https://api.wheretheiss.at/v1/satellites/25544', { timeout: 15000, signal })
  return normalizeStation(data)
}

export function normalizeAsteroids(data, date) {
  const entries = data?.near_earth_objects?.[date]
  if (!Array.isArray(entries)) throw new Error('NASA returned an incomplete asteroid feed. Please try again.')
  return entries.flatMap((item) => {
    const approach = item.close_approach_data?.find((entry) => entry.close_approach_date === date)
    const size = item.estimated_diameter?.meters
    const distance = Number(approach?.miss_distance?.kilometers)
    const velocity = Number(approach?.relative_velocity?.kilometers_per_hour)
    if (!approach || !size || ![size.estimated_diameter_min, size.estimated_diameter_max, distance, velocity].every((value) => Number.isFinite(value) && value >= 0)) return []
    return [{ id: String(item.id), name: String(item.name), minSize: size.estimated_diameter_min, maxSize: size.estimated_diameter_max, distance, velocity, lunarDistances: distance / 384400, source: `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodeURIComponent(item.id)}` }]
  }).sort((a,b) => a.distance - b.distance)
}

const asteroidCache = new Map()
export async function fetchAsteroids(date, signal) {
  if (asteroidCache.has(date)) return asteroidCache.get(date)
  const { data } = await axios.get('https://api.nasa.gov/neo/rest/v1/feed', { params: { start_date: date, end_date: date, api_key: import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY' }, timeout: 20000, signal })
  const entries = normalizeAsteroids(data, date)
  asteroidCache.set(date, entries)
  return entries
}

export function feedError(error, service) {
  if (error.response?.status === 429) return `${service} has reached its request limit. Please wait a little, then try again.`
  if ([401,403].includes(error.response?.status)) return `${service} couldn’t authorize this request. Please try again later.`
  return `We couldn’t reach ${service}. Check your connection and try again.`
}
