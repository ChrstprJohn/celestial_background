import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Download, LoaderCircle, Pause, Play, RotateCcw } from 'lucide-react'
import { PETS, pupilOffset } from './lib/pets.js'
import { defaultPetImage } from './lib/pet-image.js'
import './pets.css'

function Pet({ pet, index }) {
  const image = useRef(null)
  const downloads = useRef(new Map())
  const [status, setStatus] = useState('loading')
  const [retry, setRetry] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  useEffect(() => {
    const active = downloads.current
    return () => { for (const [url, timer] of active) { clearTimeout(timer); URL.revokeObjectURL(url) } }
  }, [])

  async function download() {
    setDownloading(true)
    setDownloadError('')
    try {
      const blob = await defaultPetImage(image.current, pet)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `celestial-${pet.id}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      downloads.current.set(url, setTimeout(() => { URL.revokeObjectURL(url); downloads.current.delete(url) }, 60000))
    } catch {
      setDownloadError('Couldn’t download the image. Try again.')
    } finally {
      setDownloading(false)
    }
  }
  return (
    <figure className="cosmic-pet">
      <div className="pet-portrait" data-pet={pet.id} data-status={status}>
        <img
          ref={image}
          src={`${pet.image}${retry ? `?retry=${retry}` : ''}`}
          alt={`${pet.name}, ${pet.description.toLowerCase()}`}
          width="1280" height="1280" draggable="false"
          loading={index >= 3 ? 'lazy' : 'eager'} decoding="async"
          onLoad={() => setStatus('ready')} onError={() => setStatus('error')}
        />
        <div className="pet-eyes" aria-hidden="true">
          {pet.eyes.map((eye, index) => (
            <span key={index} className="pet-eye" style={{ left: `${eye.x}%`, top: `${eye.y}%`, width: `${eye.width}%`, height: `${eye.height}%` }}>
              <span className="pet-pupil" />
            </span>
          ))}
        </div>
        {status === 'loading' && <span className="pet-loading" role="status">{pet.name} is arriving…</span>}
        {status === 'error' && <div className="pet-load-error" role="status">
          <p>{pet.name} couldn’t appear.</p>
          <button type="button" onClick={() => { setStatus('loading'); setRetry(value => value + 1) }}><RotateCcw size={14} aria-hidden="true" /> Try again</button>
        </div>}
      </div>
      <figcaption>
        <h2>{pet.name}</h2>
        <p>{pet.description}</p>
        <div className="pet-card-actions"><button className="pet-download" type="button" onClick={download} disabled={status !== 'ready' || downloading} aria-label={`Download ${pet.name} image`} title={`Download ${pet.name} as PNG`}>{downloading ? <LoaderCircle className="loading-icon" size={16} aria-hidden="true" /> : <Download size={16} strokeWidth={1.5} aria-hidden="true" />}<span>{downloading ? 'Saving…' : 'Download'}</span></button></div>
        {downloadError && <p className="pet-download-error" role="alert">{downloadError}</p>}
      </figcaption>
    </figure>
  )
}

export default function PetsPage() {
  const gallery = useRef(null)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = event => setPaused(event.matches)
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    const eyes = [...gallery.current.querySelectorAll('.pet-eye')].map(eye => ({
      element: eye, pupil: eye.firstElementChild, x: 0, y: 0, targetX: 0, targetY: 0,
    }))
    let frame = 0
    let lastTime = 0
    let pointer = null
    let direction = null
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    function paint(time) {
      frame = 0
      const dt = lastTime ? Math.min(time - lastTime, 50) : 16
      lastTime = time
      const ease = reduced.matches ? 1 : 1 - Math.exp(-dt * .018)
      let moving = false
      for (const eye of eyes) {
        eye.x += (eye.targetX - eye.x) * ease
        eye.y += (eye.targetY - eye.y) * ease
        if (Math.abs(eye.targetX - eye.x) + Math.abs(eye.targetY - eye.y) < .03) {
          eye.x = eye.targetX; eye.y = eye.targetY
        } else moving = true
        eye.pupil.style.transform = `translate(${eye.x}px, ${eye.y}px)`
      }
      if (moving) frame = requestAnimationFrame(paint)
      else lastTime = 0
    }

    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(paint)
    }

    function update() {
      for (const eye of eyes) {
        const rect = eye.element.getBoundingClientRect()
        const offset = pointer ? pupilOffset(pointer.x - rect.left - rect.width / 2, pointer.y - rect.top - rect.height / 2, rect.width, rect.height) : direction ? pupilOffset(direction[0] * 1000, direction[1] * 1000, rect.width, rect.height) : { x: 0, y: 0 }
        eye.targetX = offset.x; eye.targetY = offset.y
      }
      schedule()
    }

    function move(event) {
      direction = null
      pointer = { x: event.clientX, y: event.clientY }
      update()
    }

    function reset() { pointer = null; direction = null; update() }

    function visibility() {
      if (!document.hidden) { reset(); return }
      cancelAnimationFrame(frame); frame = 0; lastTime = 0; pointer = null; direction = null
      for (const eye of eyes) {
        eye.x = eye.y = eye.targetX = eye.targetY = 0
        eye.pupil.style.transform = 'translate(0px, 0px)'
      }
    }

    function keys(event) {
      if (event.target !== gallery.current) return
      const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
      if (event.key === 'Escape' || event.key === 'Home') { event.preventDefault(); reset(); return }
      const selected = directions[event.key]
      if (!selected) return
      event.preventDefault()
      pointer = null
      direction = selected
      update()
    }

    // Pausing also returns every pupil to neutral. There is no perpetual render loop.
    if (paused) {
      for (const eye of eyes) eye.pupil.style.transform = 'translate(0px, 0px)'
      return
    }
    const element = gallery.current
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', move, { passive: true })
    window.addEventListener('pointerup', eventReset, { passive: true })
    window.addEventListener('pointercancel', reset)
    window.addEventListener('blur', reset)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    document.addEventListener('visibilitychange', visibility)
    element.addEventListener('keydown', keys)
    element.addEventListener('focusout', reset)
    function eventReset(event) { if (event.pointerType !== 'mouse') reset() }
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', move)
      window.removeEventListener('pointerup', eventReset)
      window.removeEventListener('pointercancel', reset)
      window.removeEventListener('blur', reset)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update)
      document.documentElement.removeEventListener('pointerleave', reset)
      document.removeEventListener('visibilitychange', visibility)
      element.removeEventListener('keydown', keys)
      element.removeEventListener('focusout', reset)
    }
  }, [paused])

  return (
    <section className="pets-page" aria-labelledby="pets-title">
      <div className="pets-intro">
        <a className="back-link" href="/"><ArrowLeft size={16} aria-hidden="true" /> Back to the stars</a>
        <div className="pets-heading-row">
          <div><h1 id="pets-title">Cosmic <em>pets.</em></h1><p>Meet your little collection of cosmic companions.</p></div>
          <button className="pets-pause" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
            {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}{paused ? 'Resume eyes' : 'Pause eyes'}
          </button>
        </div>
      </div>
      <div id="pets-gallery" ref={gallery} className="pets-gallery" tabIndex={0} role="group" aria-label="Cosmic pets" aria-describedby="pets-hint">
        {PETS.map((pet, index) => <Pet key={pet.id} pet={pet} index={index} />)}
      </div>
      <p id="pets-hint" className="pets-hint">
        {paused ? 'Taking a little stargazing break.' : <><span className="pets-mouse-hint">Move your mouse. You have their attention.</span><span className="pets-touch-hint">Touch the sky. You have their attention.</span><span className="pets-keyboard-hint"> You can also focus the pets and use the arrow keys. Escape resets their gaze.</span></>}
      </p>
    </section>
  )
}
