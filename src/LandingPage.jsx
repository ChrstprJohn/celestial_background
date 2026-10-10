import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import HeroScene from './HeroScene.jsx'
import DiscoveryArt from './DiscoveryArt.jsx'
import { EXTRA_DISCOVERIES } from './lib/discoveries.js'
import useScrollReveal from './useScrollReveal.js'
import CardObjectPreview from './CardObjectPreview.jsx'
import { SHUFFLE_IMAGE } from './lib/featured.js'
import { PETS, pupilOffset } from './lib/pets.js'

const staticPreviews = new Set(['galaxy', 'moon', 'moon-match', 'age', 'builder', 'planets', 'gravity'])

const services = [
  { title: 'Your birthday.', emphasis: 'Your picture.', description: 'Enter your birthday to see NASA’s picture from that date.', href: '/birthday', action: 'Find my birthday picture', art: 'galaxy' },
  { title: 'Moon phase', description: 'See the Moon’s phase for any date you choose.', href: '/moon', action: 'Find your Moon', art: 'moon' },
  ...['/moon-match', '/cosmic-age', '/build-your-planet'].flatMap((href) => EXTRA_DISCOVERIES.filter((service) => service.enabled && service.href === href)),
  { title: 'Cosmic pets', description: 'Meet a little collection of curious cosmic companions.', href: '/pets', action: 'Meet the pets', art: 'pets' },
  { title: 'Solar System', description: 'Eight worlds. Get a little closer to each one.', href: '/solar-system', action: 'Explore the planets', art: 'planets' },
  ...EXTRA_DISCOVERIES.filter((service) => service.enabled && !['/moon-match', '/cosmic-age', '/build-your-planet'].includes(service.href)),
]

function PetsArt() {
  const pet = PETS[0]
  const portrait = useRef(null)
  useEffect(() => {
    const container = portrait.current
    const card = container.closest('.service-card')
    const eyes = [...container.querySelectorAll('.pet-eye')]
    const enabled = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let pointer
    function paint() {
      frame = 0
      for (const eye of eyes) {
        const rect = eye.getBoundingClientRect()
        const offset = pointer ? pupilOffset(pointer.x - rect.left - rect.width / 2, pointer.y - rect.top - rect.height / 2, rect.width, rect.height) : { x: 0, y: 0 }
        eye.firstElementChild.style.transform = `translate(${offset.x}px, ${offset.y}px)`
      }
    }
    function move(event) {
      if (!enabled.matches || event.pointerType !== 'mouse') return
      pointer = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(paint)
    }
    function reset() { pointer = null; cancelAnimationFrame(frame); paint() }
    card.addEventListener('pointermove', move, { passive: true })
    card.addEventListener('pointerleave', reset)
    enabled.addEventListener('change', reset)
    window.addEventListener('blur', reset)
    return () => {
      cancelAnimationFrame(frame)
      card.removeEventListener('pointermove', move)
      card.removeEventListener('pointerleave', reset)
      enabled.removeEventListener('change', reset)
      window.removeEventListener('blur', reset)
    }
  }, [])
  return <div ref={portrait} className="service-pet-preview">
    <img src={`/pets/${pet.id}-480.webp`} srcSet={`/pets/${pet.id}-480.webp 480w, /pets/${pet.id}-960.webp 960w`} sizes="(max-width: 600px) 45vw, 300px" alt="" width="1254" height="1254" loading="lazy" decoding="async" />
    <div className="pet-eyes">{pet.eyes.map((eye, index) => <span key={index} className="pet-eye" style={{ left: `${eye.x}%`, top: `${eye.y}%`, width: `${eye.width}%`, height: `${eye.height}%` }}><span className="pet-pupil" /></span>)}</div>
  </div>
}

function ShowcaseSection() {
  const video = useRef(null)
  const [active, setActive] = useState(false)
  const [manual] = useState(() => window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches || Boolean(navigator.connection?.saveData))
  useEffect(() => {
    const element = video.current
    let inView = false
    const update = () => {
      if (!manual && inView && !document.hidden) {
        setActive(true)
        element.play().catch(() => {})
      } else element.pause()
    }
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update() }, { threshold: .25 })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); element.pause() }
  }, [manual])
  return (
    <section className="showcase-section" aria-labelledby="showcase-title">
      <h2 id="showcase-title" className="showcase-title" data-scroll-reveal>See it come alive.</h2>
      <div className="showcase-video-wrap" data-scroll-reveal>
        <video
          ref={video}
          className="showcase-video"
          src={manual || active ? '/brag.mp4' : undefined}
          poster="/previews/showcase.webp"
          preload="none"
          autoPlay={active}
          controls={manual}
          muted
          loop
          playsInline
          aria-label="Celestial showcase video"
        />
      </div>
    </section>
  )
}

export default function LandingPage() {
  const landing = useScrollReveal()
  useEffect(() => {
    // The landing route is lazy-loaded, so the browser's initial anchor lookup
    // can happen before Explore exists. Restore it after React mounts the page.
    function restoreExplore() {
      if (window.location.hash === '#services') {
        landing.current?.querySelector('#services')?.scrollIntoView({ block: 'start', behavior: 'instant' })
      }
    }
    restoreExplore()
    window.addEventListener('hashchange', restoreExplore)
    return () => window.removeEventListener('hashchange', restoreExplore)
  }, [landing])
  return (
    <div ref={landing} className="landing-content">
      <section className="landing-hero" aria-labelledby="hero-title">
        <HeroScene />
        <div className="hero-copy">
          <h1 id="hero-title" aria-label="Your place among the stars.">
            <span className="hero-title-line"><span className="hero-title-word">Your</span>{' '}<span className="hero-title-word">place</span></span>
            <span className="hero-title-line"><span className="hero-title-word">among</span>{' '}<span className="hero-title-word">the</span>{' '}<em className="hero-title-word">stars.</em></span>
          </h1>
          <p>Explore astronomy, planets, and a little imagination.</p>
          <a href="#services" className="primary-button explore-button">Explore <ArrowDown size={18} aria-hidden="true" /></a>
        </div>
      </section>

      <ShowcaseSection />

      <section id="services" className="services-section" aria-labelledby="services-title" tabIndex={-1}>
        <h2 id="services-title" data-scroll-reveal>Explore</h2>
        <div className="services-grid">
          {services.map(({ title, emphasis, description, href, action, art }) => (
            <a key={href} href={href} className="service-card" data-scroll-reveal>
              <div className={`service-art${art === 'moon' ? ' service-art-moon' : ''}`} aria-hidden="true">
                <CardObjectPreview type={art}>
                  {staticPreviews.has(art) ? <img className="service-static-preview" src={`/previews/${art}.webp`} alt="" width="602" height="560" loading="lazy" decoding="async" /> : art === 'pets' ? <PetsArt /> : art === 'shuffle' ? <img className="service-photo" src={SHUFFLE_IMAGE} alt="" loading="lazy" decoding="async" /> : <DiscoveryArt type={art} />}
                </CardObjectPreview>
              </div>
              <div className="service-copy"><h3>{title}{emphasis && <><br /><em>{emphasis}</em></>}</h3><p>{description}</p><span>{action} <ArrowRight size={18} aria-hidden="true" /></span></div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
