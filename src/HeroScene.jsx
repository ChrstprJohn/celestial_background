import { useEffect, useRef, useState } from 'react'
import { GALAXY_IMAGE } from './lib/featured.js'
import './hero-comets.css'

export default function HeroScene() {
  const layer = useRef(null)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    let inView = false
    const update = () => setRunning(inView && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    })
    observer.observe(layer.current)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return (
    <div ref={layer} className={`hero-scene${running ? ' is-running' : ''}`} aria-hidden="true">
      <div className="galaxy-scene"><img src={GALAXY_IMAGE} srcSet={`${GALAXY_IMAGE.replace('w=1000', 'w=480')} 480w, ${GALAXY_IMAGE.replace('w=1000', 'w=800')} 800w, ${GALAXY_IMAGE} 1000w`} sizes="(max-width: 1000px) 100vw, 1100px" alt="" width="1000" height="1100" decoding="async" fetchPriority="high" /></div>
    </div>
  )
}
