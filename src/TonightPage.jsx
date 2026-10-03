import { useMemo, useState } from 'react'
import DiscoveryLayout, { SourceNote } from './DiscoveryLayout.jsx'
import SkyControls from './SkyControls.jsx'
import SkyChart from './SkyChart.jsx'
import useSkyControls from './useSkyControls.js'
import { localSkyTime, nextRiseSet, skyBodies } from './lib/sky.js'

const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest']

export default function TonightPage() {
  const state = useSkyControls()
  const [selected, setSelected] = useState('Moon')
  const bodies = skyBodies(state.time, state.location).filter((body) => body.name !== 'Sun')
  const body = bodies.find((item) => item.name === selected)
  const events = useMemo(() => nextRiseSet(selected, state.time, state.location), [selected, state.time, state.location])
  return <DiscoveryLayout id="tonight" title="Familiar worlds." emphasis="Above your horizon." description="Find the Moon and planets, then see when they rise and set." controls={<>
    <SkyControls state={state} prefix="tonight" />
    <label htmlFor="sky-time-slider">Move through the day</label><input className="sky-time-slider" id="sky-time-slider" type="range" min="0" max="1425" step="15" value={Math.floor(state.minutes / 15) * 15} onChange={(event) => state.setMinutes(Number(event.target.value))} aria-valuetext={`${Math.floor(state.minutes / 60)}:${String(state.minutes % 60).padStart(2, '0')} UTC`} />
    <p className="discovery-note">Above the horizon doesn’t guarantee a clear view. Clouds, sunlight, and nearby buildings matter too.</p><SourceNote href="https://github.com/cosinekitty/astronomy">Calculated with Astronomy Engine</SourceNote>
  </>}>{state.valid ? <>
    <div className="sky-body-list" aria-label="Choose a celestial body">{bodies.map((item) => <button type="button" key={item.name} aria-pressed={selected === item.name} onClick={() => setSelected(item.name)}>{item.name}<span>{item.visible ? 'Above horizon' : 'Below horizon'}</span></button>)}</div>
    <div className="sky-body-detail" aria-live="polite"><h2>{selected}</h2><p>{body.visible ? `Look ${directions[Math.round(body.azimuth / 45) % 8]}, ${body.altitude.toFixed(0)}° above the horizon.` : `Currently ${Math.abs(body.altitude).toFixed(0)}° below the horizon.`}</p><dl><div><dt>Next rise</dt><dd>{events.rise ? localSkyTime(events.rise, state.location) : 'No rise in the next 48 hours'}</dd></div><div><dt>Next set</dt><dd>{events.set ? localSkyTime(events.set, state.location) : 'No set in the next 48 hours'}</dd></div></dl></div>
    <SkyChart time={state.time} location={state.location} title="Your sky, tonight" />
  </> : <p className="discovery-empty" role="status">Enter valid coordinates to find your sky.</p>}</DiscoveryLayout>
}
