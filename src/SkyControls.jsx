import DatePicker from './DatePicker.jsx'
import { CITIES } from './lib/sky.js'

const LOCATION_GROUPS = ['Philippines', 'Asia & Pacific', 'Europe', 'Americas', 'Africa']

export default function SkyControls({ state, prefix }) {
  const { date, setDate, minutes, setMinutes, city, setCity, latitude, setLatitude, longitude, setLongitude, valid } = state
  const time = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
  return <>
    <label htmlFor={`${prefix}-city`}>Your location</label><select id={`${prefix}-city`} className="text-field" value={city} onChange={(event) => setCity(event.target.value)}>{LOCATION_GROUPS.map((group) => <optgroup key={group} label={group}>{CITIES.filter((item) => item.group === group).sort((a, b) => a.name.localeCompare(b.name)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</optgroup>)}<option value="custom">Enter coordinates</option></select>
    <p className="date-help">Locations use city centers. Enter coordinates for a more precise spot.</p>
    {city === 'custom' && <><div className="coordinate-fields"><div><label htmlFor={`${prefix}-latitude`}>Latitude</label><input id={`${prefix}-latitude`} className="text-field" type="number" inputMode="decimal" min="-90" max="90" step="any" value={latitude} onChange={(event) => setLatitude(event.target.value)} aria-invalid={!valid} /></div><div><label htmlFor={`${prefix}-longitude`}>Longitude</label><input id={`${prefix}-longitude`} className="text-field" type="number" inputMode="decimal" min="-180" max="180" step="any" value={longitude} onChange={(event) => setLongitude(event.target.value)} aria-invalid={!valid} /></div></div>{!valid && <p className="form-error" role="alert">Enter latitude from −90 to 90 and longitude from −180 to 180.</p>}</>}
    <label htmlFor={`${prefix}-date`}>Date (UTC)</label><DatePicker id={`${prefix}-date`} name="date" label="Date (UTC)" value={date} onChange={setDate} min="1900-01-01" max="2100-12-31" today={new Date().toISOString().slice(0, 10)} />
    <label htmlFor={`${prefix}-time`}>Time (UTC)</label><input id={`${prefix}-time`} className="text-field" type="time" required value={time} onChange={(event) => { if (event.target.value) { const [hours, mins] = event.target.value.split(':').map(Number); setMinutes(hours * 60 + mins) } }} />
    <p className="date-help">Change the date or time to move through the sky. Your location stays on this device.</p>
  </>
}
