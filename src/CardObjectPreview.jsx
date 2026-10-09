import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import './card-objects.css'

const CardObjectScene = lazy(() => import('./CardObjectScene.jsx'))
const modeled = new Set(['galaxy', 'moon', 'age', 'gravity', 'planets'])

export default function CardObjectPreview({ type, children }) {
  const host = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!modeled.has(type)) return
    const desktop = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)')
    let near = false
    const update = () => setEnabled(near && (desktop.matches || type === 'planets'))
    const observer = new IntersectionObserver(([entry]) => { near = entry.isIntersecting; update() }, { rootMargin: '150px' })
    observer.observe(host.current)
    desktop.addEventListener('change', update)
    return () => { observer.disconnect(); desktop.removeEventListener('change', update) }
  }, [type])
  return <div ref={host} className={`card-object-preview${type === 'planets' ? ' card-object-planets' : ''}${enabled && ready ? ' has-object' : ''}`}>
    <div className="card-object-fallback">{children}</div>
    {enabled && <Suspense fallback={null}><CardObjectScene type={type} onReady={setReady} /></Suspense>}
  </div>
}
