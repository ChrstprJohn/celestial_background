import { useMemo, useState } from 'react'
import { CITIES, skyTime } from './lib/sky.js'

export default function useSkyControls() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [minutes, setMinutes] = useState(720)
  const [city, setCity] = useState('singapore')
  const [latitude, setLatitude] = useState('1.3521')
  const [longitude, setLongitude] = useState('103.8198')
  const preset = CITIES.find((item) => item.id === city)
  const valid = preset || (latitude.trim() && longitude.trim() && Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude)) && Math.abs(Number(latitude)) <= 90 && Math.abs(Number(longitude)) <= 180)
  const location = useMemo(() => preset || (valid ? { name: 'Your coordinates', latitude: Number(latitude), longitude: Number(longitude), timeZone: 'UTC' } : CITIES[0]), [preset, valid, latitude, longitude])
  const time = useMemo(() => skyTime(date, minutes), [date, minutes])
  return { date, setDate, minutes, setMinutes, city, setCity, latitude, setLatitude, longitude, setLongitude, location, valid: Boolean(valid), time }
}
