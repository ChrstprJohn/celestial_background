import { useEffect, useState } from 'react'
import './hero-comets.css'

export default function ShootingStars() {
  const [running, setRunning] = useState(() => !document.hidden)

  useEffect(() => {
    const update = () => setRunning(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  return <div className={`hero-comets${running ? ' is-running' : ''}`} aria-hidden="true">
    {Array.from({ length: 9 }, (_, index) => <span className="hero-comet" key={index} />)}
  </div>
}
