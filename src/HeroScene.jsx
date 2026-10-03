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
      <div className="galaxy-scene"><img src={GALAXY_IMAGE} alt="" width="1000" height="1100" fetchPriority="high" /></div>
      <div className="hero-comets">
        <span className="hero-comet" />
        <span className="hero-comet" />
        <span className="hero-comet" />
        <span className="hero-comet" />
        <span className="hero-comet" />
        <span className="hero-comet" />
        <span className="hero-comet" />
        <span className="hero-comet" />
        <span className="hero-comet" />
      </div>
    </div>
  )
}
