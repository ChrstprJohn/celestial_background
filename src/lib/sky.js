import { Body, Equator, Horizon, HorizonFromVector, Observer, RotateVector, Rotation_EQJ_HOR, Spherical, VectorFromSphere, SearchRiseSet } from 'astronomy-engine'
import { MORE_LOCATIONS } from './location-presets.js'

export const CITIES = [
  { id: 'singapore', name: 'Singapore', latitude: 1.3521, longitude: 103.8198, timeZone: 'Asia/Singapore', group: 'Asia & Pacific' },
  { id: 'london', name: 'London', latitude: 51.5074, longitude: -.1278, timeZone: 'Europe/London', group: 'Europe' },
  { id: 'new-york', name: 'New York', latitude: 40.7128, longitude: -74.006, timeZone: 'America/New_York', group: 'Americas' },
  { id: 'tokyo', name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, timeZone: 'Asia/Tokyo', group: 'Asia & Pacific' },
  { id: 'sydney', name: 'Sydney', latitude: -33.8688, longitude: 151.2093, timeZone: 'Australia/Sydney', group: 'Asia & Pacific' },
  { id: 'cape-town', name: 'Cape Town', latitude: -33.9249, longitude: 18.4241, timeZone: 'Africa/Johannesburg', group: 'Africa' },
  { id: 'quito', name: 'Quito', latitude: -.1807, longitude: -78.4678, timeZone: 'America/Guayaquil', group: 'Americas' },
  ...MORE_LOCATIONS,
]

export function projectSky(altitude, azimuth, radius = 270, center = 350) {
  const r = (90 - altitude) / 90 * radius
  const angle = azimuth * Math.PI / 180
  return { x: center - r * Math.sin(angle), y: center - r * Math.cos(angle), visible: altitude >= 0 }
}

export function placeSkyLabels(bodies, fontSize = 11) {
  const boxes = []
  return bodies.filter((body) => body.visible).map((body) => {
    const width = body.name.length * fontSize * .6
    let label
    for (let step = 0; step < 24; step++) {
      const x = Math.min(635 - width, Math.max(65, body.x + 8))
      const y = Math.min(630, Math.max(75, body.y - 8 + step * fontSize * 1.5))
      const box = { left: x - 3, right: x + width + 3, top: y - fontSize, bottom: y + 3 }
      if (!boxes.some((other) => box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top)) {
        boxes.push(box); label = { x, y }; break
      }
    }
    return { ...body, label: label || { x: body.x + 8, y: body.y - 8 } }
  })
}

export function skyBodies(time, location) {
  const observer = new Observer(location.latitude, location.longitude, 0)
  return ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].map((name) => {
    const equator = Equator(Body[name], time, observer, true, true)
    const horizon = Horizon(time, observer, equator.ra, equator.dec, 'normal')
    return { name, altitude: horizon.altitude, azimuth: horizon.azimuth, ...projectSky(horizon.altitude, horizon.azimuth) }
  })
}

export function nextRiseSet(name, time, location) {
  const observer = new Observer(location.latitude, location.longitude, 0)
  return { rise: SearchRiseSet(Body[name], observer, 1, time, 2)?.date, set: SearchRiseSet(Body[name], observer, -1, time, 2)?.date }
}

export function skyProjection(time, location) {
  const rotation = Rotation_EQJ_HOR(time, new Observer(location.latitude, location.longitude, 0))
  return ([raDegrees, dec]) => {
    const vector = VectorFromSphere(new Spherical(dec, raDegrees, 1), time)
    const horizon = HorizonFromVector(RotateVector(rotation, vector), null)
    return projectSky(horizon.lat, horizon.lon)
  }
}

export function skyTime(date, minutes) {
  const time = new Date(`${date}T00:00:00Z`)
  time.setUTCMinutes(minutes)
  return time
}

export function localSkyTime(time, location) {
  return new Intl.DateTimeFormat('en-US', { timeZone: location.timeZone || 'UTC', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(time)
}
