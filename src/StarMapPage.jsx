import { useRef, useState } from 'react'
import DiscoveryLayout, { ArtDownload, SourceNote } from './DiscoveryLayout.jsx'
import SkyControls from './SkyControls.jsx'
import SkyChart from './SkyChart.jsx'
import useSkyControls from './useSkyControls.js'

export default function StarMapPage() {
  const state = useSkyControls()
  const [title, setTitle] = useState('The sky on your day')
  const [ready, setReady] = useState(false)
  const svg = useRef(null)
  return <DiscoveryLayout id="star-map" title="A moment." emphasis="Written in stars." description="Choose a place and time. Keep a little map of the sky above it." controls={<>
    <SkyControls state={state} prefix="map" />
    <label htmlFor="map-title">Give your map a title</label><input id="map-title" className="text-field" value={title} maxLength={42} onChange={(event) => setTitle(event.target.value)} />
    <ArtDownload svgRef={svg} filename="celestial-my-star-map.png" label="Save my star map" disabled={!ready || !state.valid} />
    <p className="discovery-note">An overhead chart: north at the top, east on the left. Positions are approximate; weather and light pollution aren’t included.</p>
    <SourceNote href="https://github.com/ofrohn/d3-celestial">Star catalog and constellation lines</SourceNote>
  </>}>{state.valid ? <SkyChart time={state.time} location={state.location} title={title} svgRef={svg} onReady={setReady} /> : <p className="discovery-empty" role="status">Enter valid coordinates to create your star map.</p>}</DiscoveryLayout>
}
