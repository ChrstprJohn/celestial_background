import { useEffect, useMemo, useRef, useState } from 'react'
import { Combine, Columns2, RotateCcw } from 'lucide-react'
import DiscoveryLayout, { ArtDownload, SourceNote } from './DiscoveryLayout.jsx'
import DatePicker from './DatePicker.jsx'
import { localToday, moonForDate, MOON_START } from './lib/moon.js'
import { formatDate } from './lib/dates.js'
import { drawMoon, loadMoonTexture } from './lib/moon-render.js'
import { moonMatch } from './lib/moon-match.js'
import { saveCanvasPng } from './lib/art-export.js'
import { drawCollectibleBorder } from './lib/collectible-card.js'
import './moon-match.css'

export default function MoonMatchPage() {
  const [firstDate, setFirstDate] = useState('2005-09-05')
  const [secondDate, setSecondDate] = useState('2006-05-15')
  const [combined, setCombined] = useState(false)
  const [status, setStatus] = useState('loading')
  const [retry, setRetry] = useState(0)
  const [today] = useState(localToday)
  const first = useMemo(() => moonForDate(firstDate), [firstDate])
  const second = useMemo(() => moonForDate(secondDate), [secondDate])
  const match = moonMatch(first, second)
  const firstCanvas = useRef(null), secondCanvas = useRef(null), combinedCanvas = useRef(null)
  const readyDates = useRef('')
  const visual = useRef(null)
  const datesKey = `${firstDate}:${secondDate}`

  function showTogether() {
    setCombined(!combined)
  }

  function replayCollision() {
    visual.current?.getAnimations({ subtree: true }).forEach((animation) => {
      animation.currentTime = 0
      animation.play()
    })
  }

  useEffect(() => {
    let active = true
    readyDates.current = ''
    loadMoonTexture().then((texture) => {
      if (!active) return
      drawMoon(firstCanvas.current, texture, first.fraction, first.waxing)
      drawMoon(secondCanvas.current, texture, second.fraction, second.waxing)
      const ctx = combinedCanvas.current.getContext('2d')
      const a = firstCanvas.current.getContext('2d').getImageData(0, 0, 480, 480)
      const b = secondCanvas.current.getContext('2d').getImageData(0, 0, 480, 480)
      for (let i = 0; i < a.data.length; i++) a.data[i] = Math.max(a.data[i], b.data[i])
      ctx.putImageData(a, 0, 0)
      readyDates.current = datesKey
      setStatus('ready')
    }).catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [first, second, retry, datesKey])

  async function exportCard(filename) {
    if (readyDates.current !== datesKey) throw new Error('Your Moons are still preparing.')
    await document.fonts.ready
    if (readyDates.current !== datesKey) throw new Error('Your birthdays changed. Download the updated card instead.')
    const canvas = document.createElement('canvas')
    canvas.width = 1080; canvas.height = 1350
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#070b17'; ctx.fillRect(0, 0, 1080, 1350)
    ctx.textAlign = 'center'; ctx.fillStyle = '#f3f0e9'; ctx.font = '90px "Instrument Serif"'
    ctx.fillText('Our birthday Moons.', 540, 205)
    ctx.drawImage(combinedCanvas.current, 210, 285, 660, 660)
    ctx.fillStyle = '#c9c1f0'; ctx.font = '48px "Instrument Serif"'
    ctx.fillText(`${match.fit}% full-Moon fit`, 540, 1015)
    ctx.fillStyle = '#b5bbd0'; ctx.font = '26px "DM Sans"'
    ctx.fillText(`${formatDate(firstDate)} + ${formatDate(secondDate)}`, 540, 1080)
    ctx.font = '22px "DM Sans"'; ctx.fillText('A playful phase comparison, not relationship compatibility.', 540, 1160)
    drawCollectibleBorder(ctx)
    return saveCanvasPng(canvas, filename, { Description: 'Moon phases at noon UTC. Fit measures illuminated area covered by exactly one phase, not relationship compatibility.', Source: 'Astronomy Engine; Moon texture: Solar System Scope, CC BY 4.0.' })
  }

  return <DiscoveryLayout mobilePreview controlsTitle="Choose your birthdays" id="moon-match" title="Two birthdays." emphasis="One Moon?" description="Compare your birthday Moons. See how their light comes together." controls={<>
    <label htmlFor="match-first">Your birthday</label>
    <DatePicker id="match-first" name="first-birthday" label="Your birthday" value={firstDate} min={MOON_START} max={today} today={today} onChange={(date) => { if (date !== firstDate) { setStatus('loading'); setFirstDate(date) } }} describedBy="match-example" />
    <label htmlFor="match-second">Their birthday</label>
    <DatePicker id="match-second" name="second-birthday" label="Their birthday" value={secondDate} min={MOON_START} max={today} today={today} onChange={(date) => { if (date !== secondDate) { setStatus('loading'); setSecondDate(date) } }} describedBy="match-example" />
    <p id="match-example" className="date-help">Example birthdays shown. Choose yours to compare.</p>
    <p className="date-help">Calculated at noon UTC on each date. Illustrations show the phase, not the exact view at your birth time or location.</p>
    <button className="primary-button" type="button" disabled={status !== 'ready'} onClick={showTogether}>{combined ? <><Columns2 size={18} aria-hidden="true" />See both Moons</> : <><Combine size={18} aria-hidden="true" />Combine our Moons</>}</button>
    <p className="discovery-note">For fun: Moon phases cannot tell whether two people are compatible.</p>
    <SourceNote href="https://github.com/cosinekitty/astronomy">Phases: Astronomy Engine · noon UTC</SourceNote>
    <SourceNote href="https://www.solarsystemscope.com/textures/">Moon texture: Solar System Scope · CC BY 4.0</SourceNote>
  </>}>
    <div className="mobile-preview match-preview">
      <div ref={visual} className={`moon-match-visual${combined ? ' is-combined' : ''}`} aria-busy={status === 'loading'}>
        <figure className="match-moon" aria-hidden={combined}><canvas ref={firstCanvas} width="480" height="480" role="img" aria-label={`Your Moon: ${first.name}, ${Math.round(first.fraction * 100)}% illuminated`} /><figcaption><span>Your Moon · {formatDate(firstDate)}</span><h2>{first.name}</h2><p>{Math.round(first.fraction * 100)}% illuminated</p></figcaption></figure>
        <figure className="match-moon" aria-hidden={combined}><canvas ref={secondCanvas} width="480" height="480" role="img" aria-label={`Their Moon: ${second.name}, ${Math.round(second.fraction * 100)}% illuminated`} /><figcaption><span>Their Moon · {formatDate(secondDate)}</span><h2>{second.name}</h2><p>{Math.round(second.fraction * 100)}% illuminated</p></figcaption></figure>
        <figure className="match-combined"><canvas ref={combinedCanvas} width="480" height="480" role="img" aria-label="Both birthday Moon phases layered together" /><figcaption><h2>Your light, together.</h2><p>Both phases layered in the same north-up orientation.</p></figcaption></figure>
      </div>
      {status === 'loading' && <p className="discovery-note" role="status">Preparing your Moons…</p>}
      {status === 'error' && <p className="form-error" role="alert">The Moon texture couldn’t load. <button className="secondary-button" onClick={() => { setStatus('loading'); setRetry(retry + 1) }}>Try again</button></p>}
      <p className="match-score" aria-live="polite">{match.fit}% <span>full-Moon fit</span></p>
    </div>
    <div className="match-summary" aria-live="polite"><p>{match.fit >= 90 ? 'Your phases nearly complete a full Moon with very little overlap.' : match.fit >= 60 ? 'Your phases fill much of the Moon together, with some gaps or overlap.' : 'Your phases leave more gaps or overlap. Every pair has its own pattern.'}</p><p className="discovery-note">Fit is the share of the Moon lit by exactly one phase. Gaps and overlapping light reduce the score. This is a visual comparison, not a prediction about your relationship.</p></div>
    <div className="match-actions">
      {combined && <button type="button" className="secondary-button match-replay" disabled={status !== 'ready'} onClick={replayCollision}><RotateCcw size={16} aria-hidden="true" />Replay merge</button>}
      <ArtDownload key={datesKey} label="Download our Moon card" filename="celestial-moon-match.png" disabled={status !== 'ready'} makeImage={exportCard} />
    </div>
  </DiscoveryLayout>
}
