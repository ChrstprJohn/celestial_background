import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, LoaderCircle, Orbit, Telescope } from 'lucide-react'
import gsap from 'gsap'
import axios from 'axios'
import { fetchApod } from './lib/apod.js'
import { ARCHIVE_START, formatDate, nasaToday, validateDate } from './lib/dates.js'

const featured = {
  title: 'NGC 1232: A Grand Design Spiral Galaxy',
  image: 'https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2024/january/ngc1232b_vlt_3969.jpg?w=1000&h=1100&fit=clip',
  alt: 'A luminous spiral galaxy, with blue stars and dark dust lanes winding around its golden center.',
  source: 'https://science.nasa.gov/image-article/apod-2024-january-1-ngc-1232-a-grand-design-spiral-galaxy/',
}

function ApodMedia({ entry }) {
  const [failedImage, setFailedImage] = useState('')
  if (entry.mediaType === 'video' && entry.video) {
    return <iframe className="result-video" src={entry.video} title={entry.title} loading="lazy" allow="fullscreen; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
  }
  if (entry.mediaType === 'image' && entry.image && failedImage !== entry.image) {
    return <img className="result-image" src={entry.image} alt={entry.alt} onError={() => setFailedImage(entry.image)} loading="lazy" />
  }
  return (
    <div className="media-fallback">
      <Telescope size={36} strokeWidth={1.25} aria-hidden="true" />
      <p>{entry.mediaType === 'video' ? 'This day’s discovery is a video.' : 'This image is available on NASA’s website.'}</p>
      <a href={entry.source} target="_blank" rel="noreferrer">View it on NASA <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>
  )
}

export default function App() {
  const root = useRef(null)
  const resultRef = useRef(null)
  const request = useRef(null)
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [featuredFailed, setFeaturedFailed] = useState(false)
  const today = nasaToday()

  useEffect(() => {
    const context = gsap.context(() => {
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.15 } })
        timeline.from('.hero-copy > *', { y: 24, autoAlpha: 0, stagger: 0.1 })
          .from('.sky-print', { clipPath: 'inset(0 0 100% 0)', duration: 1.5 }, 0.12)
          .from('.sky-image', { scale: 1.08, duration: 1.6 }, 0.12)
      })
    }, root)
    return () => { context.revert(); request.current?.abort() }
  }, [])

  useEffect(() => {
    if (!result) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    resultRef.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
    resultRef.current?.focus({ preventScroll: true })
    const context = gsap.context(() => {
      if (!reducedMotion) gsap.from('.result-content', { y: 18, opacity: 0, duration: 0.7, ease: 'expo.out' })
    }, resultRef)
    return () => context.revert()
  }, [result])

  async function discover(selectedDate) {
    const validation = validateDate(selectedDate, today)
    if (validation) { setError(validation); return }
    request.current?.abort()
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

  function handleSubmit(event) {
    event.preventDefault()
    const selectedDate = new FormData(event.currentTarget).get('birthdate')
    setDate(selectedDate)
    discover(selectedDate)
  }

  return (
    <div ref={root} className="site-shell">
      <a href="#birthday" className="skip-link">Skip to birthday lookup</a>
      <header className="site-header flex items-center justify-between">
        <a className="wordmark inline-flex items-center gap-2.5" href="#" aria-label="Celestial home">
          <Orbit size={28} strokeWidth={1.35} aria-hidden="true" />
          <span>celestial</span>
        </a>
        <nav aria-label="Main navigation" className="flex items-center gap-7 sm:gap-10">
          <a href="#about">The idea</a>
          <a className="archive-link inline-flex items-center gap-1.5" href="https://science.nasa.gov/apod/" target="_blank" rel="noreferrer">NASA APOD <ArrowUpRight size={15} aria-hidden="true" /></a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">The sky on<br />your <em>first day.</em></h1>
            <p className="hero-description">Somewhere in the universe, something extraordinary was happening the day you arrived. Let’s find it.</p>

            <form id="birthday" className="birthday-form" onSubmit={handleSubmit} noValidate aria-busy={loading}>
              <label htmlFor="birthdate">When did your story begin?</label>
              <div className="date-controls flex flex-col sm:flex-row">
                <div className="date-input-wrap flex items-center">
                  <CalendarDays size={19} strokeWidth={1.5} aria-hidden="true" />
                  <input id="birthdate" name="birthdate" aria-label="Your birthday" type="date" required min={ARCHIVE_START} max={today} value={date} onChange={(event) => { setDate(event.target.value); setError('') }} aria-describedby={error ? 'date-help lookup-error' : 'date-help'} aria-invalid={Boolean(error)} disabled={loading} />
                </div>
                <button className="discover-button inline-flex items-center justify-center gap-3" type="submit" disabled={loading}>
                  {loading ? <>Finding your sky <LoaderCircle className="loading-icon" size={18} aria-hidden="true" /></> : <>Find my sky <ArrowRight size={18} aria-hidden="true" /></>}
                </button>
              </div>
              <p id="date-help" className="date-help">Discover NASA’s daily feature on your birthday.{' '}<br />The archive begins June 16, 1995.</p>
              {error && <p id="lookup-error" className="form-error" role="alert">{error}</p>}
              <p className="sr-only" role="status">{loading ? 'Looking up NASA’s picture for your selected date.' : ''}</p>
            </form>

            <button type="button" className="today-link inline-flex items-center gap-2" disabled={loading} onClick={() => { setDate(today); discover(today) }}>Just exploring? See today’s sky <ArrowUpRight size={16} aria-hidden="true" /></button>
          </div>

          <figure className="hero-figure">
            <div className="sky-print">
              {!featuredFailed ? <img className="sky-image" src={featured.image} alt={featured.alt} width="1000" height="1100" fetchPriority="high" onError={() => setFeaturedFailed(true)} /> : <div className="featured-fallback"><Orbit size={64} strokeWidth={1} /><p>A universe waiting to be discovered.</p></div>}
              <div className="photo-note"><span>A little perspective.</span><span>A lot of wonder.</span></div>
              <span className="photo-coordinate" aria-hidden="true">NGC 1232 · ERIDANUS</span>
            </div>
            <figcaption className="flex justify-between items-start gap-5">
              <div><p>Featured from the archive</p><span>NGC 1232 · January 1, 2024</span></div>
              <a href={featured.source} target="_blank" rel="noreferrer" aria-label="Read about NGC 1232 on NASA"><ArrowUpRight size={21} strokeWidth={1.4} aria-hidden="true" /></a>
            </figcaption>
          </figure>
        </section>

        {result && (
          <section ref={resultRef} className="result-section" aria-labelledby="result-title" tabIndex={-1}>
            <div className="result-heading flex flex-wrap justify-between items-end gap-5">
              <div><p className="result-date">{formatDate(result.date)}</p><h2 id="result-title">Your day. A universe of wonder.</h2></div>
              <a href="#birthday" className="inline-flex items-center gap-2">Try another date <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
            <div className="result-content">
              <ApodMedia entry={result} />
              <div className="result-story">
                <h3>{result.title}</h3>
                <p className="explanation">{result.explanation || 'Visit NASA to read the story behind this day’s discovery.'}</p>
                {result.credit && <p className="image-credit">Credit: {result.credit}</p>}
                <a className="source-link inline-flex items-center gap-2" href={result.source} target="_blank" rel="noreferrer">Explore the original on NASA <ArrowUpRight size={17} aria-hidden="true" /></a>
              </div>
            </div>
          </section>
        )}

        <section id="about" className="about-section" aria-labelledby="about-title">
          <div className="about-heading"><ArrowDown size={22} strokeWidth={1.4} aria-hidden="true" /><h2 id="about-title">One date.<br /><em>A different perspective.</em></h2></div>
          <div className="about-copy"><p>Since 1995, NASA’s Astronomy Picture of the Day has shared a small window into a very big universe. Celestial takes you back to the one published on your birthday.</p><p>A galaxy, a moon, a quiet corner of the cosmos. It’s a glimpse of what NASA shared that day, and a beautiful place to begin exploring.</p><a href="#birthday" className="inline-flex items-center gap-2">Find your moment <ArrowRight size={16} aria-hidden="true" /></a></div>
        </section>
      </main>

      <footer className="site-footer flex flex-wrap items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2"><Orbit size={18} strokeWidth={1.3} aria-hidden="true" /> A small date in a vast universe.</span>
        <div className="footer-credit">Imagery via NASA APOD · Featured image: ESO / VLT<br /><span>An independent project, unaffiliated with NASA.</span></div>
      </footer>
    </div>
  )
}
