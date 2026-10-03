import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { Shuffle, RotateCcw } from 'lucide-react'
import DiscoveryLayout, { ArtDownload, SourceNote } from './DiscoveryLayout.jsx'
import { DEFAULT_WORLD, WORLD_PALETTES } from './lib/world-builder.js'
import { saveWorldPng } from './lib/world-share.js'
import { TEXTURE_SOURCE } from './lib/planets.js'
import './playgrounds.css'

const PlanetScene = lazy(() => import('./PlanetScene.jsx'))
const planet = { id: 'custom-world', name: 'your planet', tilt: 22 }

export default function BuildPlanetPage() {
  const [world, setWorld] = useState(DEFAULT_WORLD)
  const [name, setName] = useState('Asteria')
  const [ready, setReady] = useState('')
  const [retry, setRetry] = useState(0)
  const capture = useRef(null)
  const appearance = useMemo(() => world, [world])
  const displayName = name.trim() || 'Your new world'
  const change = (property, value) => setWorld((current) => ({ ...current, [property]: value }))
  function surprise() {
    setWorld({ terrain: ['ocean', 'rocky', 'gas'][Math.floor(Math.random() * 3)], palette: WORLD_PALETTES[Math.floor(Math.random() * WORLD_PALETTES.length)].id, rings: Math.random() > .35, clouds: Math.random() > .4, seed: Math.floor(Math.random() * 10000) })
  }
  return <DiscoveryLayout id="world-builder" title="A little imagination." emphasis="A whole new world." description="Shape an imaginary planet. Give it a name. Keep it as a card." controls={<>
    <label htmlFor="world-name">Name your world</label><input id="world-name" className="text-field" maxLength={40} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your new world" />
    <fieldset className="playground-fieldset"><legend>Choose the terrain</legend><div className="world-selector">{['ocean', 'rocky', 'gas'].map((type) => <button key={type} type="button" aria-pressed={world.terrain === type} onClick={() => change('terrain', type)}>{type === 'gas' ? 'Gas bands' : type === 'rocky' ? 'Rocky' : 'Oceans'}</button>)}</div></fieldset>
    <fieldset className="playground-fieldset"><legend>Choose the colors</legend><div className="palette-selector">{WORLD_PALETTES.map((palette) => <button key={palette.id} type="button" aria-pressed={world.palette === palette.id} onClick={() => change('palette', palette.id)}><span className="palette-colors" aria-hidden="true"><i style={{ background: palette.sea }} /><i style={{ background: palette.land }} /><i style={{ background: palette.high }} /></span>{palette.name}</button>)}</div></fieldset>
    <label className="check-control"><input type="checkbox" checked={world.rings} onChange={(event) => change('rings', event.target.checked)} />Add rings</label>
    <label className="check-control"><input type="checkbox" checked={world.clouds} onChange={(event) => change('clouds', event.target.checked)} />Add clouds</label>
    <div className="button-row"><button className="secondary-button" type="button" onClick={surprise}><Shuffle size={16} />Surprise me</button><button className="secondary-button" type="button" onClick={() => { setWorld(DEFAULT_WORLD); setName('Asteria') }}><RotateCcw size={16} />Start over</button></div>
    <p className="discovery-note">This world comes from your imagination. Every landscape is generated here on your device.</p>
    <SourceNote href={TEXTURE_SOURCE}>Cloud and ring textures · Solar System Scope · CC BY 4.0</SourceNote>
  </>}>
    <div className="builder-planet"><Suspense fallback={<p className="discovery-note">Preparing your world…</p>}><PlanetScene key={retry} planet={planet} appearance={appearance} captureRef={capture} onCaptureReady={setReady} onRetry={() => setRetry((value) => value + 1)} /></Suspense></div>
    <div className="art-caption" aria-live="polite"><h2>{displayName}</h2><p>{world.terrain === 'ocean' ? 'Oceans and continents' : world.terrain === 'rocky' ? 'A world of rocky terrain' : 'A world of swirling gas bands'}{world.rings ? ' · Ringed' : ''}{world.clouds ? ' · Clouded' : ''}</p></div>
    <ArtDownload key={`${JSON.stringify(world)}-${displayName}`} label="Download my planet card" filename="celestial-my-planet.png" disabled={ready !== planet.id} makeImage={(filename) => {
      if (capture.current?.appearance !== appearance) throw new Error('Your new world is still preparing.')
      return saveWorldPng({ image: capture.current.capture(), name: displayName, appearance }, filename)
    }} />
  </DiscoveryLayout>
}
