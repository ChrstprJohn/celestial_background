import { useEffect, useMemo, useRef, useState } from 'react'
import { skyBodies, skyProjection, localSkyTime, placeSkyLabels } from './lib/sky.js'
import './discoveries.css'

let catalogPromise
function loadCatalog() {
  if (!catalogPromise) catalogPromise = Promise.all(['/data/stars.6.json', '/data/constellations.lines.json'].map(async (url) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error('The star catalog couldn’t load.')
    return response.json()
  })).catch((error) => { catalogPromise = null; throw error })
  return catalogPromise
}

export default function SkyChart({ time, location, title = 'Your star map', svgRef, onReady }) {
  const [catalog, setCatalog] = useState(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const chartHost = useRef(null)
  const [labelScale, setLabelScale] = useState(1)
  useEffect(() => {
    if (!chartHost.current) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width) setLabelScale(700 / entry.contentRect.width)
    })
    observer.observe(chartHost.current)
    return () => observer.disconnect()
  }, [catalog])
  useEffect(() => {
    let active = true
    loadCatalog().then((data) => { if (active) { setCatalog(data); setError(''); onReady?.(true) } }).catch((issue) => { if (active) setError(issue.message) })
    return () => { active = false }
  }, [retry, onReady])
  const projection = useMemo(() => {
    if (!catalog) return null
    const project = skyProjection(time, location)
    return { stars: catalog[0].features.map((star) => ({ ...project(star.geometry.coordinates), magnitude: Number(star.properties.mag), id: star.id })).filter((star) => star.visible),
      lines: catalog[1].features.flatMap((item) => item.geometry.coordinates.flatMap((line) => line.slice(1).map((point, index) => [project(line[index]), project(point)]))).filter(([a,b]) => a.visible && b.visible) }
  }, [catalog, time, location])
  if (error) return <div className="discovery-empty" role="alert"><p>{error}</p><button className="secondary-button" onClick={() => setRetry((value) => value + 1)}>Try again</button></div>
  if (!projection) return <p className="discovery-empty" role="status">Opening the star catalog…</p>
  const bodies = skyBodies(time, location)
  return <>
    <div ref={chartHost}><svg ref={svgRef} className="sky-chart" viewBox="0 0 700 680" data-export-view-box="0 0 700 800" role="img" aria-label={`Sky above ${location.name}, ${localSkyTime(time, location)}. North at top and east at left.`}>
      <rect width="700" height="800" fill="#070b17" />
      {[90,180,270].map((radius) => <circle key={radius} cx="350" cy="350" r={radius} fill="none" stroke="#282e44" strokeWidth={radius === 270 ? 1.5 : .6} />)}
      <g fontFamily="DM Sans, Arial, sans-serif" fontSize={14 * labelScale} fill="#c9c1f0" textAnchor="middle"><text x="350" y="58">N</text><text x="52" y="355">E</text><text x="350" y="652">S</text><text x="648" y="355">W</text></g>
      {projection.lines.map(([a,b], index) => <line key={index} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8d84bd" strokeWidth=".7" opacity=".65" />)}
      {projection.stars.map((star) => <circle key={star.id} cx={star.x} cy={star.y} r={Math.max(.65, 3 - star.magnitude * .38)} fill="#f3f0e9" opacity={Math.max(.45, 1 - Math.max(0, star.magnitude) * .08)} />)}
      {placeSkyLabels(bodies,12 * labelScale).map((body) => <g key={body.name}><circle cx={body.x} cy={body.y} r={body.name === 'Sun' || body.name === 'Moon' ? 4 : 2.5} fill={body.name === 'Sun' ? '#e9cb8e' : '#c9c1f0'} /><line x1={body.x} y1={body.y} x2={body.label.x - 2} y2={body.label.y - 3} stroke="#8d84bd" strokeWidth=".5" /><text x={body.label.x} y={body.label.y} fill="#c9c1f0" fontFamily="DM Sans, Arial, sans-serif" fontSize={12 * labelScale}>{body.name}</text></g>)}
      <g className="export-caption"><text x="350" y="710" textAnchor="middle" fill="#f3f0e9" fontFamily="Instrument Serif, Georgia, serif" fontSize={Math.min(28,560 / Math.max(1,title.length * .95))}>{title || 'Your star map'}</text>
      <text x="350" y="744" textAnchor="middle" fill="#b5bbd0" fontFamily="DM Sans, Arial, sans-serif" fontSize="14">{location.name} · {localSkyTime(time, location)}</text>
      <text x="350" y="775" textAnchor="middle" fill="#a4abc2" fontFamily="DM Sans, Arial, sans-serif" fontSize="10">Celestial · Star catalog: d3-celestial / Hipparcos · Approximate positions</text></g>
    </svg></div>
    <div className="art-caption"><h2>{title || 'Your star map'}</h2><p>{location.name} · {localSkyTime(time, location)}</p><p>Celestial · Star catalog: d3-celestial / Hipparcos · Approximate positions</p></div>
    {bodies.find((body) => body.name === 'Sun').visible && <p className="discovery-note">It’s daylight at this location. The chart shows stars for orientation; they won’t all be visible outside.</p>}
  </>
}
