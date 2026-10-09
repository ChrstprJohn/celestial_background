import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import DiscoveryLayout from './DiscoveryLayout.jsx'
import { GRAVITY_WORLDS, gravityJump, jumpHeightAt } from './lib/gravity.js'
import './playgrounds.css'

export default function GravityPage() {
  const [selected, setSelected] = useState('moon')
  const [mass, setMass] = useState('70')
  const [centimeters, setCentimeters] = useState(40)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [peaks, setPeaks] = useState(false)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const elapsed = useRef(0)
  const world = GRAVITY_WORLDS.find((item) => item.id === selected)
  const valid = mass !== '' && Number(mass) >= 1 && Number(mass) <= 300
  const result = gravityJump(valid ? Number(mass) : 70, centimeters / 100, world.gravity)
  const earth = gravityJump(valid ? Number(mass) : 70, centimeters / 100, 9.8)
  const duration = Math.max(result.duration, earth.duration)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduced(preference.matches); setRunning(false) }
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!running) return
    let frame
    const start = performance.now() - elapsed.current * 1000
    const tick = (now) => {
      elapsed.current = Math.min(duration, (now - start) / 1000)
      setTime(elapsed.current)
      if (elapsed.current < duration) frame = requestAnimationFrame(tick)
      else setRunning(false)
    }
    const pauseHidden = () => { if (document.hidden) setRunning(false) }
    document.addEventListener('visibilitychange', pauseHidden)
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', pauseHidden) }
  }, [running, duration])
  function reset() { setRunning(false); setTime(0); elapsed.current = 0; setPeaks(false) }
  function launch() {
    if (reduced) { setPeaks(true); return }
    if (elapsed.current >= duration) { elapsed.current = 0; setTime(0) }
    setRunning(true)
  }
  const maxHeight = Math.max(result.height, earth.height) * 1.18
  const y = (height) => 340 - height / maxHeight * 270
  const earthY = y(peaks ? earth.height : jumpHeightAt(time, earth.speed, 9.8))
  const worldY = y(peaks ? result.height : jumpHeightAt(time, result.speed, world.gravity))
  return <DiscoveryLayout id="gravity" title="Gravity" emphasis="playground." description="Compare the same jump on different worlds." controls={<>
    <label htmlFor="gravity-mass">Your mass (kg)</label><input id="gravity-mass" type="number" inputMode="decimal" className="text-field" min="1" max="300" step="any" value={mass} aria-invalid={!valid} onChange={(event) => setMass(event.target.value)} />
    {!valid && <p className="form-error" role="alert">Enter a mass between 1 and 300 kg.</p>}
    <fieldset className="playground-fieldset"><legend>Choose a world</legend><div className="world-selector">{GRAVITY_WORLDS.map((item) => <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => { reset(); setSelected(item.id) }}>{item.name}</button>)}</div></fieldset>
    <label htmlFor="earth-jump">Your jump on Earth · {centimeters} cm</label><input id="earth-jump" type="range" className="sky-time-slider" min="10" max="100" step="5" value={centimeters} aria-valuetext={`${centimeters} centimeters on Earth`} onChange={(event) => { reset(); setCentimeters(Number(event.target.value)) }} />
    <div className="button-row"><button className="secondary-button" type="button" disabled={!valid || running} onClick={launch}><Play size={16} />{reduced ? 'Show jump heights' : time > 0 && time < duration ? 'Resume jump' : 'Try the jump'}</button><button className="secondary-button" type="button" disabled={!running} onClick={() => setRunning(false)}><Pause size={16} />Pause</button><button className="secondary-button" type="button" onClick={reset}><RotateCcw size={16} />Reset</button></div>
    <p className="discovery-note">Same takeoff speed. Constant gravity, no air resistance.</p>
  </>}>
    <svg className="gravity-stage" viewBox="0 0 700 430" role="img" aria-label={`Jump height comparison: Earth ${earth.height.toFixed(2)} meters, ${world.name} ${result.height.toFixed(2)} meters. The same takeoff speed is used.`}>
      {[1, 2, 3].map((index) => <g key={index}><line x1="90" x2="650" y1={y(maxHeight * index / 4)} y2={y(maxHeight * index / 4)} stroke="#282e44" strokeDasharray="3 8" /><text x="72" y={y(maxHeight * index / 4) + 5} textAnchor="end">{(maxHeight * index / 4).toFixed(1)} m</text></g>)}
      <line x1="90" x2="650" y1="340" y2="340" stroke="#8d84bd" />
      <line x1="250" x2="250" y1={y(earth.height)} y2="340" stroke="#789bbd" strokeDasharray="5 7" />
      <line x1="510" x2="510" y1={y(result.height)} y2="340" stroke={world.color} strokeDasharray="5 7" />
      <circle cx="250" cy={y(earth.height)} r="5" fill="none" stroke="#99bacc" /><circle cx="510" cy={y(result.height)} r="5" fill="none" stroke={world.color} />
      <circle cx="250" cy={earthY} r="13" fill="#99bacc" /><circle cx="510" cy={worldY} r="13" fill={world.color} />
      <text x="250" y="382" textAnchor="middle" className="gravity-world-name">Earth</text><text x="510" y="382" textAnchor="middle" className="gravity-world-name">{world.name}</text>
      <text x="250" y="411" textAnchor="middle">{earth.height.toFixed(2)} m peak</text><text x="510" y="411" textAnchor="middle">{result.height.toFixed(2)} m peak</text>
    </svg>
    <p className="gravity-status" role="status">{reduced ? 'Peak heights shown. Reduced motion is on.' : running ? 'Jumping…' : time >= duration ? 'Landed.' : time > 0 ? 'Paused.' : 'Ready to jump.'}</p>
    {valid && <div className="gravity-results" aria-live="polite"><h2>On {world.name}</h2><dl className="space-facts"><div><dt>Your weight force</dt><dd>{result.force.toFixed(1)} <span>N</span></dd></div><div><dt>Earth-scale equivalent</dt><dd>{result.earthEquivalent.toFixed(1)} <span>kg</span></dd></div><div><dt>Jump height</dt><dd>{result.height.toFixed(2)} <span>m</span></dd></div><div><dt>Time in the air</dt><dd>{result.duration.toFixed(2)} <span>s</span></dd></div></dl><p className="discovery-note">Earth-scale reading. Your mass stays {mass} kg.</p></div>}
  </DiscoveryLayout>
}
