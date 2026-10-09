import { useEffect, useRef, useState } from 'react'
import { moonForDate } from './lib/moon.js'
import { drawMoonMatch, loadMoonTexture } from './lib/moon-render.js'
import './moon-match.css'

const first = moonForDate('2005-09-05')
const second = moonForDate('2006-05-15')

export default function MoonMatchPreview() {
  const host = useRef(null)
  const a = useRef(null), b = useRef(null), together = useRef(null)
  const [ready, setReady] = useState(false)
  const [combined, setCombined] = useState(false)
  useEffect(() => {
    let active = true
    loadMoonTexture().then((texture) => {
      if (!active) return
      drawMoonMatch(a.current, b.current, together.current, texture, first, second)
      setReady(true)
    }).catch(() => {})
    return () => { active = false }
  }, [])
  useEffect(() => {
    const card = host.current.closest('.service-card')
    const motion = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    function enter() { if (ready && motion.matches) setCombined(true) }
    function leave() { setCombined(false) }
    card.addEventListener('pointerenter', enter)
    card.addEventListener('pointerleave', leave)
    motion.addEventListener('change', leave)
    return () => {
      card.removeEventListener('pointerenter', enter)
      card.removeEventListener('pointerleave', leave)
      motion.removeEventListener('change', leave)
    }
  }, [ready])
  return <div ref={host} className={`moon-match-visual card-moon-match${combined ? ' is-combined' : ''}`} aria-hidden="true">
    <figure className="match-moon"><canvas ref={a} width="360" height="360" /></figure>
    <figure className="match-moon"><canvas ref={b} width="360" height="360" /></figure>
    <figure className="match-combined"><canvas ref={together} width="360" height="360" /></figure>
  </div>
}
