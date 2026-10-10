import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import './card-objects.css'
import { DEFAULT_WORLD } from './lib/world-builder.js'

const CardObjectScene = lazy(() => import('./CardObjectScene.jsx'))
const PlanetScene = lazy(() => import('./PlanetScene.jsx'))
const MoonMatchPreview = lazy(() => import('./MoonMatchPreview.jsx'))
const modeled = new Set(['galaxy', 'moon', 'age', 'gravity', 'planets', 'builder', 'moon-match'])
const fictionalPlanet = { id: 'custom-world', name: 'an imaginary world', tilt: 22 }

export default function CardObjectPreview({ type, children }) {
  const host = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!modeled.has(type)) return
    const desktop = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const card = host.current.closest('.service-card')
    let timer
    let active = false
    function enter(event) {
      if (timer || active || !desktop.matches || event.pointerType !== 'mouse' || navigator.connection?.saveData) return
      // A pointer passing over cards during a scroll never creates a renderer.
      timer = setTimeout(() => { timer = null; active = true; setReady(false); setEnabled(true) }, 180)
    }
    function leave() { clearTimeout(timer); timer = null; active = false; setEnabled(false); setReady(false) }
    card.addEventListener('pointerenter', enter)
    card.addEventListener('pointermove', enter, { passive: true })
    card.addEventListener('pointerleave', leave)
    window.addEventListener('scroll', leave, { passive: true })
    desktop.addEventListener('change', leave)
    return () => {
      clearTimeout(timer)
      card.removeEventListener('pointerenter', enter)
      card.removeEventListener('pointermove', enter)
      card.removeEventListener('pointerleave', leave)
      window.removeEventListener('scroll', leave)
      desktop.removeEventListener('change', leave)
    }
  }, [type])
  return <div ref={host} className={`card-object-preview${type === 'planets' ? ' card-object-planets' : ''}${enabled && ready ? ' has-object' : ''}`}>
    <div className="card-object-fallback">{children}</div>
    {enabled && <Suspense fallback={null}>{type === 'builder' ? <div className="card-object-scene"><PlanetScene planet={fictionalPlanet} appearance={DEFAULT_WORLD} decorative onCaptureReady={setReady} /></div> : type === 'moon-match' ? <div className="card-object-scene"><MoonMatchPreview onReady={setReady} /></div> : <CardObjectScene type={type} onReady={setReady} />}</Suspense>}
  </div>
}
