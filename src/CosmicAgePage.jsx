import { useRef, useState } from 'react'
import DiscoveryPlanet from './DiscoveryPlanet.jsx'
import DiscoveryLayout, { ArtDownload, SourceNote } from './DiscoveryLayout.jsx'
import DatePicker from './DatePicker.jsx'
import { PLANETS, PLANET_FACTS_SOURCE, TEXTURE_SOURCE, planetTexture } from './lib/planets.js'
import { cosmicAge } from './lib/cosmic-age.js'
import { localToday } from './lib/moon.js'
import { formatDate } from './lib/dates.js'
import { saveCosmicAgePng } from './lib/cosmic-age-share.js'

export default function CosmicAgePage() {
  const [birthday, setBirthday] = useState('2000-01-01')
  const [planetId, setPlanetId] = useState('jupiter')
  const planetCapture = useRef(null)
  const [readyPlanet, setReadyPlanet] = useState('')
  const [now] = useState(() => new Date(`${localToday()}T12:00:00Z`))
  const planet = PLANETS.find((item) => item.id === planetId)
  const result = cosmicAge(birthday, planetId, now)
  return <DiscoveryLayout mobilePreview controlsTitle="Find your cosmic age" id="cosmic-age" title="Your cosmic" emphasis="age." description="See your age in planetary years and your next orbital birthday." controls={<>
    <label htmlFor="cosmic-birthday">Your birthday</label>
    <DatePicker id="cosmic-birthday" name="birthday" label="Your birthday" value={birthday} onChange={setBirthday} min="1900-01-01" max={localToday()} today={localToday()} describedBy="cosmic-age-help" />
    <p id="cosmic-age-help" className="date-help">Starts with January 1, 2000. Choose your birthday to make it yours.</p>
    <p className="control-label">Choose a world</p>
    <div className="world-selector">{PLANETS.map((item) => <button type="button" key={item.id} aria-pressed={item.id === planetId} onClick={() => setPlanetId(item.id)}><span className="planet-thumbnail" style={{ backgroundImage: `url(${planetTexture(item.id)})` }} aria-hidden="true" />{item.name}</button>)}</div>
    <p className="discovery-note">An Earth year is one orbit. Every planet takes a different amount of time.</p>
    <SourceNote href={PLANET_FACTS_SOURCE}>NASA orbital periods</SourceNote>
    <SourceNote href={TEXTURE_SOURCE}>Planet textures: Solar System Scope · CC BY 4.0</SourceNote>
  </>}>
    <div className="mobile-preview age-preview">
      <div className="age-planet"><DiscoveryPlanet planet={planet} captureRef={planetCapture} onCaptureReady={setReadyPlanet} /></div>
      <div className="age-caption" aria-live="polite" aria-atomic="true"><p className="age-number">{result.age.toFixed(2)} <span>{planet.name} years</span></p></div>
    </div>
    <div className="age-caption age-details" aria-live="polite"><p>Your next {planet.name} birthday is <strong>{formatDate(result.next.toISOString().slice(0, 10))}</strong>.</p><p className="age-countdown">Turning {result.nextAge} in approximately {result.remainingDays.toLocaleString()} Earth days.</p></div>
    <div className="age-download"><ArtDownload key={`${birthday}-${planetId}`} filename={`celestial-my-${planetId}-age.png`} label="Download my cosmic age" disabled={readyPlanet !== planetId} makeImage={(filename) => {
      const view = planetCapture.current
      if (view?.planetId !== planetId) throw new Error('The selected planet is not ready.')
      return saveCosmicAgePng({ birthday, planetName: planet.name, planetImage: view.capture(), result, observedDate: now.toISOString().slice(0, 10) }, filename)
    }} /><p className="discovery-note">Save a shareable image of {planet.name}, your age, and your next birthday.</p></div>
    <p className="discovery-note">Estimates use average orbital periods and a midnight UTC birth date. Planet sizes are illustrative.</p>
  </DiscoveryLayout>
}
