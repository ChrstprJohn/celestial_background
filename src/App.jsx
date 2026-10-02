import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Orbit, Telescope } from 'lucide-react'
import gsap from 'gsap'
import axios from 'axios'
import { fetchApod } from './lib/apod.js'
import { ARCHIVE_START, nasaToday, validateDate } from './lib/dates.js'
import BirthdayImage from './BirthdayImage.jsx'
import Starfield from './Starfield.jsx'
import MoonVisual from './MoonVisual.jsx'
import './discovery-headings.css'

const MoonPage = lazy(() => import('./MoonPage.jsx'))

const galaxyImage = 'https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2024/january/ngc1232b_vlt_3969.jpg?w=1000&h=1100&fit=clip'
const services = [
  { title: 'Birthday sky', description: 'See NASA’s image from the day you were born.', href: '/birthday', action: 'Find your sky', art: 'galaxy' },
  { title: 'Moon on your day', description: 'Discover the Moon’s phase on a day that matters.', href: '/moon', action: 'Find your Moon', art: 'moon' },
]

function EmptyPreview() {
  return (
    <div className="empty-preview">
      <Orbit size={40} strokeWidth={1} aria-hidden="true" /><p>Your sky awaits</p>
    </div>
  )
}

function LandingPage() {
  return (
    <>
      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="galaxy-scene" aria-hidden="true"><img src={galaxyImage} alt="" width="1000" height="1100" fetchPriority="high" /></div>
        <div className="hero-copy">
          <h1 id="hero-title">Your place<br />among the <em>stars.</em></h1>
          <p>Find the sky on a day that matters.</p>
          <a href="#services" className="primary-button explore-button">Explore <ArrowDown size={18} aria-hidden="true" /></a>
        </div>
      </section>

      <section id="services" className="services-section" aria-labelledby="services-title" tabIndex={-1}>
        <h2 id="services-title">Discoveries</h2>
        <div className="services-grid">
          {services.map(({ title, description, href, action, art }) => (
            <a key={href} href={href} className="service-card">
              <div className={`service-art${art === 'moon' ? ' service-art-moon' : ''}`} aria-hidden="true">
                {art === 'moon' ? <MoonVisual fraction={.218} waxing decorative /> : <img className="service-photo" src={galaxyImage} alt="" loading="lazy" />}
              </div>
              <div className="service-copy"><h3>{title}</h3><p>{description}</p><span>{action} <ArrowRight size={18} aria-hidden="true" /></span></div>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

function VideoResult({ entry }) {
  return (
    <div className="video-result">
      {entry.mediaType === 'video' && entry.video ? <iframe className="result-video" src={entry.video} title={entry.title} allow="fullscreen; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <Telescope size={40} strokeWidth={1.2} aria-hidden="true" />}
      <p className="media-note">NASA shared {entry.mediaType === 'video' ? 'a video' : 'an image available on its website'} on this date. Open the original below.</p>
    </div>
  )
}

function BirthdayPage() {
  const request = useRef(null)
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const today = nasaToday()

  useEffect(() => () => request.current?.abort(), [])

  async function discover(selectedDate) {
    setDate(selectedDate)
    request.current?.abort()
    const validation = validateDate(selectedDate, today)
    if (validation) { setError(validation); setLoading(false); return }
    const controller = new AbortController()
    request.current = controller
    setLoading(true)
    setError('')
    try {
      const entry = await fetchApod(selectedDate, controller.signal)
      if (!controller.signal.aborted) setResult(entry)
    } catch (issue) {
      if (!axios.isCancel(issue) && !controller.signal.aborted) setError(issue.message)
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  return (
    <section className="birthday-workspace" aria-labelledby="birthday-title">
      <div className="birthday-controls">
        <a className="back-link" href="/#services"><ArrowLeft size={16} aria-hidden="true" /> All discoveries</a>
        <h1 id="birthday-title">Your birthday.<br /><em>Your sky.</em></h1>
        <p className="birthday-description">A little piece of the universe, from your first day.</p>
        <div id="birthday" className="birthday-form" aria-busy={loading}>
          <label htmlFor="birthdate">Your birthday</label>
          <div className="date-input-wrap"><CalendarDays size={19} strokeWidth={1.5} aria-hidden="true" /><input id="birthdate" name="birthdate" type="date" required min={ARCHIVE_START} max={today} value={date} onChange={(event) => discover(event.target.value)} aria-describedby={error ? 'date-help lookup-error' : 'date-help'} aria-invalid={Boolean(error)} /></div>
          <p id="date-help" className="date-help">Available from June 16, 1995.</p>
          {error && <p id="lookup-error" className="form-error" role="alert">{error}</p>}
          <p className="date-help" role="status">{loading ? 'Looking up NASA’s picture for your selected date…' : ''}</p>
        </div>
      </div>

      <div className="image-workspace" role="region" aria-label="Birthday image preview" tabIndex={-1} aria-busy={loading}>
        {result ? <>
          {result.mediaType === 'image' && result.image ? <BirthdayImage key={result.date} entry={result} /> : <VideoResult entry={result} />}
          <div className="result-attribution">
            <a className="source-link" href={result.source} target="_blank" rel="noreferrer">NASA original <ArrowUpRight size={14} aria-hidden="true" /></a>
            {result.credit && <p className="image-credit">{result.credit}</p>}
          </div>
        </> : <EmptyPreview />}
      </div>
    </section>
  )
}

export default function App() {
  const root = useRef(null)
  const isBirthday = /^\/birthday\/?$/.test(window.location.pathname)
  const isMoon = /^\/moon\/?$/.test(window.location.pathname)
  const isDiscovery = isBirthday || isMoon

  useEffect(() => {
    document.title = isBirthday ? 'Birthday sky — Celestial' : isMoon ? 'Moon on your day — Celestial' : 'Celestial — Among the stars'
    if (isMoon) return
    const context = gsap.context(() => {
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-copy > *, .birthday-controls > *', { y: 18, autoAlpha: 0, stagger: 0.09, ease: 'expo.out', duration: 1 })
      })
    }, root)
    return () => context.revert()
  }, [isBirthday, isMoon])

  return (
    <div ref={root} className="site-shell">
      <Starfield />
      <a href={isBirthday ? '#birthday' : isMoon ? '#moon-form' : '#services'} className="skip-link">{isBirthday ? 'Skip to birthday lookup' : isMoon ? 'Skip to Moon lookup' : 'Skip to discoveries'}</a>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Celestial home"><Orbit size={27} strokeWidth={1.2} aria-hidden="true" /><span>celestial</span></a>
        <nav aria-label="Main navigation"><a href={isDiscovery ? '/#services' : '#services'}>Discoveries <ArrowUpRight size={15} aria-hidden="true" /></a></nav>
      </header>
      <main>{isBirthday ? <BirthdayPage /> : isMoon ? <Suspense fallback={<p className="moon-route-loading" role="status">Opening your Moon…</p>}><MoonPage /></Suspense> : <LandingPage />}</main>
      <footer className="site-footer"><span>celestial</span><a href="https://science.nasa.gov/apod/" target="_blank" rel="noreferrer">Imagery via NASA APOD <ArrowUpRight size={13} aria-hidden="true" /></a><span>Independent project · Galaxy: ESO / VLT</span></footer>
    </div>
  )
}
