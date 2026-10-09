import { useEffect, useRef, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import DiscoveryLayout from './DiscoveryLayout.jsx'
import DatePicker from './DatePicker.jsx'
import AsteroidVisual from './AsteroidVisual.jsx'
import { formatDate, nasaToday } from './lib/dates.js'
import { feedError, fetchAsteroids } from './lib/space-data.js'

export default function CosmicNeighborsPage() {
  const [today] = useState(nasaToday)
  const [date, setDate] = useState(today)
  const [result, setResult] = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const request = useRef(null)
  useEffect(() => {
    const controller = new AbortController()
    request.current = controller
    fetchAsteroids(today, controller.signal).then((entries) => { if (!controller.signal.aborted) { setResult({ date: today, entries }); setSelected(entries[0]?.id) } }).catch((issue) => { if (!controller.signal.aborted) setError(feedError(issue, 'NASA’s asteroid feed')) }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => { controller.abort(); request.current?.abort() }
  }, [today])

  async function discover(day) {
    setDate(day)
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setLoading(true)
    setError('')
    try {
      const entries = await fetchAsteroids(day, controller.signal)
      if (!controller.signal.aborted) { setResult({ date: day, entries }); setSelected(entries[0]?.id) }
    } catch (issue) { if (!controller.signal.aborted) setError(feedError(issue, 'NASA’s asteroid feed')) }
    finally { if (!controller.signal.aborted) setLoading(false) }
  }
  const asteroid = result?.entries.find((item) => item.id === selected)
  const size = asteroid ? (asteroid.minSize + asteroid.maxSize) / 2 : 0
  return <DiscoveryLayout id="neighbors" title="Passing visitors." emphasis="Cosmic neighbors." description="Meet the asteroids approaching Earth on a day you choose." controls={<>
    <label htmlFor="asteroid-date">Choose a day</label><DatePicker id="asteroid-date" name="date" label="Choose a day" value={date} onChange={discover} min="1900-01-01" max="2100-12-31" today={today} />
    <p className="discovery-note" role="status">{loading ? 'Looking up NASA’s close approaches…' : result ? `${result.entries.length} recorded visitors for ${formatDate(result.date)}.` : 'Choose a date to explore the feed.'}</p>
    {error && <><p className="form-error" role="alert">{error}</p><button className="secondary-button" type="button" disabled={loading} onClick={() => discover(date)}><RefreshCw size={16} aria-hidden="true" /> Try again</button></>}
    {result?.entries.length > 0 && <><label htmlFor="asteroid-choice">Choose a visitor · nearest first</label><select id="asteroid-choice" className="text-field" value={selected || ''} onChange={(event) => setSelected(event.target.value)}>{result.entries.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></>}
    <p className="discovery-note">“Near Earth” is an orbital classification. A close approach isn’t a prediction of an impact.</p>
  </>}>
    {asteroid ? <div aria-busy={loading}>
      <AsteroidVisual />
      <p className="discovery-note">Illustrative asteroid · {formatDate(result.date)}</p><h2 className="asteroid-name">{asteroid.name}</h2>
      <dl className="space-facts"><div><dt>Estimated diameter</dt><dd>{asteroid.minSize.toFixed(0)}–{asteroid.maxSize.toFixed(0)} <span>m</span></dd></div><div><dt>Closest approach</dt><dd>{asteroid.lunarDistances.toFixed(2)} <span>Moon distances</span></dd></div><div><dt>Speed relative to Earth</dt><dd>{asteroid.velocity.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span>km/h</span></dd></div><div><dt>Distance from Earth</dt><dd>{asteroid.distance.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span>km</span></dd></div></dl>
      <p className="asteroid-comparison">About {Math.max(.1, size / 12).toFixed(1)} bus lengths across.</p><p className="discovery-note">Comparison uses the midpoint of NASA’s estimated diameter range and a 12-metre bus. The illustration isn’t a photograph or a measured shape.</p>
    </div> : <div className="discovery-empty" role="status">{loading ? 'Finding today’s visitors…' : result ? 'No approaches are listed for this date. Try another day.' : 'The asteroid feed will appear here when it’s available.'}</div>}
  </DiscoveryLayout>
}
