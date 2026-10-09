import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, RotateCcw } from 'lucide-react'
import { drawMoon, loadMoonTexture } from './lib/moon-render.js'
import './moon-view.css'

export default function MoonVisual({ fraction, waxing, label, decorative = false }) {
  const canvas = useRef(null)
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    loadMoonTexture().then((texture) => {
      if (!active) return
      drawMoon(canvas.current, texture, fraction, waxing)
      setStatus('ready')
    }).catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [fraction, waxing, attempt])

  return (
    <div className={`moon-stage${decorative ? ' moon-stage-decorative' : ''}`} aria-busy={status === 'loading'}>
      <canvas ref={canvas} className="moon-canvas" width={decorative ? 360 : 720} height={decorative ? 360 : 720} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : label} aria-hidden={decorative || status !== 'ready'} />
      {status === 'loading' && !decorative && <p className="moon-preview-status" role="status"><LoaderCircle className="loading-icon" size={18} aria-hidden="true" /> Preparing your Moon</p>}
      {status === 'error' && !decorative && <div className="moon-preview-status"><p role="alert">The Moon surface couldn’t load.</p><button className="moon-retry" type="button" onClick={() => { setStatus('loading'); setAttempt((value) => value + 1) }}><RotateCcw size={15} aria-hidden="true" /> Try again</button></div>}
    </div>
  )
}
