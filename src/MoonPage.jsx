import { useState } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import DatePicker from './DatePicker.jsx'
import MoonVisual from './MoonVisual.jsx'
import { ArtDownload } from './DiscoveryLayout.jsx'
import { drawMoon, loadMoonTexture } from './lib/moon-render.js'
import { saveCanvasPng } from './lib/art-export.js'
import { drawCollectibleBorder } from './lib/collectible-card.js'
import { MOON_END, MOON_START, localToday, moonForDate, validateMoonDate } from './lib/moon.js'
import { formatDate } from './lib/dates.js'

export default function MoonPage() {
  const [result, setResult] = useState(() => moonForDate(localToday()))
  const [date, setDate] = useState(result.date)
  const [error, setError] = useState('')

  function discover(selectedDate) {
    setDate(selectedDate)
    const validation = validateMoonDate(selectedDate)
    if (validation) { setError(validation); return }
    setError('')
    setResult(moonForDate(selectedDate))
  }

  const illumination = `${(result.fraction * 100).toFixed(1)}% illuminated`

  async function exportCard(filename) {
    const [texture] = await Promise.all([loadMoonTexture(), document.fonts.ready])
    const moon = document.createElement('canvas')
    moon.width = 720; moon.height = 720
    drawMoon(moon, texture, result.fraction, result.waxing)
    const canvas = document.createElement('canvas')
    canvas.width = 1080; canvas.height = 1350
    const context = canvas.getContext('2d')
    context.fillStyle = '#070b17'; context.fillRect(0, 0, 1080, 1350)
    context.textAlign = 'center'; context.fillStyle = '#f3f0e9'; context.font = '90px "Instrument Serif"'
    context.fillText('Your Moon.', 540, 205)
    context.drawImage(moon, 180, 275, 720, 720)
    context.fillStyle = '#c9c1f0'; context.font = '60px "Instrument Serif"'
    context.fillText(result.name, 540, 1055)
    context.fillStyle = '#b5bbd0'; context.font = '28px "DM Sans"'
    context.fillText(formatDate(result.date), 540, 1115)
    context.font = '24px "DM Sans"'; context.fillText(illumination, 540, 1170)
    drawCollectibleBorder(context)
    return saveCanvasPng(canvas, filename, {
      Description: `${formatDate(result.date)}: ${result.name}, ${illumination}. Phase at 12:00 UTC; simplified north-up visualization.`,
      Source: 'Astronomy Engine; Moon surface: three.js r150 examples texture.',
    })
  }

  return (
    <section className="moon-workspace sticky-moon-title" aria-labelledby="moon-title">
      <div className="moon-controls">
        <a className="back-link" href="/#services"><ArrowLeft size={20} aria-hidden="true" /> Back</a>
        <h1 id="moon-title">Moon <em>phase.</em></h1>
        <p className="moon-description">A familiar world. A moment that’s yours.</p>
        <div id="moon-form" className="moon-form">
          <label htmlFor="moondate">Choose your date</label>
          <DatePicker id="moondate" name="moondate" label="Choose your date" min={MOON_START} max={MOON_END} today={localToday()} value={date} onChange={discover} describedBy={error ? 'moon-date-help moon-error' : 'moon-date-help'} invalid={Boolean(error)} />
          <p className="date-help" id="moon-date-help">Choose any day from 1900 to 2100.</p>
          {error && <p className="form-error" id="moon-error" role="alert">{error}</p>}
        </div>
      </div>
      <div className="moon-result" role="region" aria-label="Your Moon visualization" tabIndex={-1}>
        <figure className="moon-figure">
          <MoonVisual fraction={result.fraction} waxing={result.waxing} label={`${result.name}, ${illumination}, on ${formatDate(result.date)}. Simplified phase visualization.`} />
          <figcaption aria-live="polite" aria-atomic="true">
            <p className="result-date">{formatDate(result.date)}</p>
            <h2>{result.name}</h2>
            <p className="moon-illumination">{illumination}</p>
          </figcaption>
        </figure>
        <ArtDownload key={result.date} label="Download my Moon card" filename={`celestial-moon-${result.date}.png`} makeImage={exportCard} />
        <p className="moon-reference">Phase visualization · 12:00 UTC · Simplified north-up view</p>
        <div className="moon-sources"><a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noreferrer">Astronomy Engine <ArrowUpRight size={12} aria-hidden="true" /></a><a href="https://github.com/mrdoob/three.js/blob/r150/examples/textures/planets/moon_1024.jpg" target="_blank" rel="noreferrer">Surface texture <ArrowUpRight size={12} aria-hidden="true" /></a></div>
      </div>
    </section>
  )
}
