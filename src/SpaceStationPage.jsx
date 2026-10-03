import { useEffect, useState } from 'react'
import { Pause, Play, RefreshCw } from 'lucide-react'
import DiscoveryLayout, { SourceNote } from './DiscoveryLayout.jsx'
import EarthGlobe from './EarthGlobe.jsx'
import { feedError, fetchStation } from './lib/space-data.js'

export default function SpaceStationPage() {
  const [station, setStation] = useState(null)
  const [paused, setPaused] = useState(false)
  const [follow, setFollow] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [receivedAt, setReceivedAt] = useState(0)
  useEffect(() => {
    let active = true
    let controller
    let timer
    async function update() {
      clearTimeout(timer)
      if (paused || document.hidden) return
      controller?.abort()
      controller = new AbortController()
      try {
        const result = await fetchStation(controller.signal)
        if (active && !controller.signal.aborted) { setStation(result); setReceivedAt(Date.now() / 1000); setError('') }
      } catch (issue) {
        if (active && !controller.signal.aborted) setError(feedError(issue, 'the station feed'))
      } finally {
        if (active && !controller.signal.aborted && !paused && !document.hidden) timer = setTimeout(update, 15000)
      }
    }
    function visibility() { clearTimeout(timer); controller?.abort(); if (!document.hidden) update() }
    update()
    document.addEventListener('visibilitychange', visibility)
    return () => { active = false; clearTimeout(timer); controller?.abort(); document.removeEventListener('visibilitychange', visibility) }
  }, [paused, retry])
  const stale = station && receivedAt - station.timestamp > 90
  return <DiscoveryLayout id="station" title="A little outpost." emphasis="Above our world." description="Follow the International Space Station as it travels around Earth." controls={<>
    <div className="button-row"><button type="button" className="secondary-button" disabled={!station && !error} onClick={() => setPaused((value) => !value)}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}{paused ? 'Resume updates' : 'Pause updates'}</button><button className="secondary-button" type="button" onClick={() => { setPaused(false); setRetry((value) => value + 1) }}><RefreshCw size={16} aria-hidden="true" /> Refresh</button></div>
    <label className="check-control"><input type="checkbox" checked={follow} onChange={(event) => setFollow(event.target.checked)} /> Follow station</label>
    <p className="discovery-note" role="status">{paused ? 'Updates paused.' : error ? 'Live updates are interrupted.' : stale ? 'The feed returned an older position.' : station ? 'Updating approximately every 15 seconds.' : 'Finding the station’s current position…'}</p>
    {error && <p className="form-error" role="alert">{error}{station ? ' The last received position remains visible.' : ''}</p>}
    <p className="discovery-note">The white marker is the station. Its trail builds as you watch. The globe texture is a fixed Earth illustration.</p>
    <SourceNote href="https://wheretheiss.at/w/developer">Live position: Where the ISS at?</SourceNote>
  </>}>
    <EarthGlobe station={station} follow={follow} />
    {station && <><dl className="space-facts"><div><dt>Altitude</dt><dd>{station.altitude.toFixed(0)} <span>km</span></dd></div><div><dt>Speed</dt><dd>{station.velocity.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span>km/h</span></dd></div><div><dt>Latitude</dt><dd>{Math.abs(station.latitude).toFixed(2)}° <span>{station.latitude >= 0 ? 'N' : 'S'}</span></dd></div><div><dt>Longitude</dt><dd>{Math.abs(station.longitude).toFixed(2)}° <span>{station.longitude >= 0 ? 'E' : 'W'}</span></dd></div></dl><p className="discovery-note">Position received for {new Date(station.timestamp * 1000).toLocaleString()}. {stale ? 'This is an older observation.' : ''}</p></>}
    <SourceNote href="https://www.solarsystemscope.com/textures/">Earth texture: Solar System Scope · CC BY 4.0</SourceNote>
  </DiscoveryLayout>
}
