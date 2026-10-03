import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react'
import { Satellite } from 'lucide-react'
import { GALAXY_IMAGE } from './lib/featured.js'
import { DEFAULT_WORLD } from './lib/world-builder.js'

const stars = [[45,65],[90,42],[143,79],[194,48],[238,96],[68,161],[134,190],[213,174],[37,234],[256,247],[170,259],[103,119]]
const AsteroidVisual = lazy(() => import('./AsteroidVisual.jsx'))
const PlanetScene = lazy(() => import('./PlanetScene.jsx'))
const fictionalPlanet = { id: 'custom-world', name: 'an imaginary world', tilt: 22 }

function BuilderArt() {
  const host = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '100px' })
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  return <div ref={host} className="service-planet-preview">{visible && <Suspense fallback={null}><PlanetScene planet={fictionalPlanet} appearance={DEFAULT_WORLD} decorative /></Suspense>}</div>
}

function NeighborArt() {
  const host = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '100px' })
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  return <div ref={host} className="neighbor-card-art">{visible && <Suspense fallback={null}><AsteroidVisual /></Suspense>}</div>
}

export default function DiscoveryArt({ type }) {
  const id = useId().replaceAll(':','')
  if (type === 'detective') return <div className="detective-card-art"><img src={GALAXY_IMAGE} alt="" loading="lazy" /><span>?</span></div>
  if (type === 'neighbors') return <NeighborArt />
  if (type === 'builder') return <BuilderArt />
  return <svg className={`discovery-card-art art-${type}`} viewBox="0 0 300 300" aria-hidden="true">
    {stars.map(([x,y], index) => <circle key={index} cx={x} cy={y} r={index % 3 ? 1.2 : 2} fill="#c9c1f0" opacity=".6" />)}
    {type === 'gravity' ? <>
      <path d="M35 238h230" fill="none" stroke="#8d84bd" />
      <path d="M95 238v-36m110 36V65" fill="none" stroke="#716894" strokeDasharray="5 7" />
      <circle cx="95" cy="202" r="12" fill="#99bacc" /><circle cx="205" cy="65" r="12" fill="#c9c1f0" />
      <circle cx="95" cy="238" r="4" fill="#99bacc" /><circle cx="205" cy="238" r="4" fill="#c9c1f0" />
      <path d="m197 90 8-8 8 8" fill="none" stroke="#c9c1f0" strokeWidth="1.5" />
    </> : type === 'age' ? <>
      <circle cx="150" cy="150" r="34" fill="#e2c493" /><circle cx="150" cy="150" r="72" fill="none" stroke="#3f4664" /><circle cx="150" cy="150" r="115" fill="none" stroke="#3f4664" />
      <circle cx="204" cy="103" r="12" fill="#99bacc" /><circle cx="74" cy="236" r="20" fill="#d2b49a" /><path d="M249 181a105 105 0 0 1-72 73" fill="none" stroke="#c9c1f0" strokeWidth="2" /><path d="m177 254 10-8m-10 8 12 4" fill="none" stroke="#c9c1f0" strokeWidth="2" />
    </> : type === 'station' ? <>
      <defs><clipPath id={`globe-${id}`}><circle cx="150" cy="150" r="85" /></clipPath></defs>
      <circle cx="150" cy="150" r="85" fill="#1b3051" stroke="#789bbd" strokeWidth="1" /><g clipPath={`url(#globe-${id})`} fill="none" stroke="#789bbd" opacity=".5"><ellipse cx="150" cy="150" rx="36" ry="85" /><ellipse cx="150" cy="150" rx="70" ry="85" /><ellipse cx="150" cy="150" rx="85" ry="32" /><path d="M65 150h170" /></g>
      <ellipse cx="150" cy="150" rx="126" ry="54" transform="rotate(-33 150 150)" fill="none" stroke="#c9c1f0" /><Satellite x="224" y="65" width="34" height="34" color="#f3f0e9" strokeWidth="1.2" />
    </> : type === 'tonight' ? <>
      <path d="M30 235Q150 205 270 235" fill="none" stroke="#4c5270" strokeWidth="1.5" /><circle cx="100" cy="116" r="24" fill="#e4dfec" /><circle cx="114" cy="109" r="23" fill="#0b1021" /><circle cx="212" cy="145" r="6" fill="#c9c1f0" /><path d="M150 235v-20m-75 18v-8m150 8v-8" stroke="#4c5270" />
    </> : type === 'map' ? <>
      <circle cx="150" cy="150" r="108" fill="none" stroke="#8d84bd" /><circle cx="150" cy="150" r="68" fill="none" stroke="#282e44" /><polyline points="90,90 143,79 194,48 213,174 134,190 103,119 90,90" fill="none" stroke="#c9c1f0" strokeWidth="1" /><path d="M150 35v10m0 210v10M35 150h10m210 0h10" stroke="#c9c1f0" />
    </> : <>
      <polyline points="90,42 194,48 213,174 134,190 90,42 134,190 170,259" fill="none" stroke="#c9c1f0" strokeWidth="2" />{[[90,42],[194,48],[213,174],[134,190],[170,259]].map(([x,y]) => <path key={x} d={`M${x} ${y-7}l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z`} fill="#f3f0e9" />)}
    </>}
  </svg>
}
