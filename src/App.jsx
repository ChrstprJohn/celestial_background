import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Orbit } from 'lucide-react'
import gsap from 'gsap'
import Starfield from './Starfield.jsx'
import HeroScene from './HeroScene.jsx'
import PreviewCursor from './PreviewCursor.jsx'
import ShootingStars from './ShootingStars.jsx'
import DiscoveryArt from './DiscoveryArt.jsx'
import { EXTRA_DISCOVERIES } from './lib/discoveries.js'
import './discoveries.css'
import useScrollReveal from './useScrollReveal.js'
import LocationSharing from './LocationSharing.jsx'
import './discovery-headings.css'
import { GALAXY_IMAGE as galaxyImage, SHUFFLE_IMAGE } from './lib/featured.js'
import { PLANETS } from './lib/planets.js'
import { PETS } from './lib/pets.js'
import './solar-system.css'
import './pet-eyes.css'

const MoonPage = lazy(() => import('./MoonPage.jsx'))
const BirthdayPage = lazy(() => import('./BirthdayPage.jsx'))
const MoonVisual = lazy(() => import('./MoonVisual.jsx'))
const ShufflePage = lazy(() => import('./ShufflePage.jsx'))
const SolarSystemPage = lazy(() => import('./SolarSystemPage.jsx'))
const PetsPage = lazy(() => import('./PetsPage.jsx'))
const PlanetScene = lazy(() => import('./PlanetScene.jsx'))
const extraPages = {
  '/build-your-planet': lazy(() => import('./BuildPlanetPage.jsx')),
  '/gravity-playground': lazy(() => import('./GravityPage.jsx')),
  '/cosmic-age': lazy(() => import('./CosmicAgePage.jsx')),
  '/constellation-studio': lazy(() => import('./ConstellationStudioPage.jsx')),
  '/space-detective': lazy(() => import('./SpaceDetectivePage.jsx')),
  '/star-map': lazy(() => import('./StarMapPage.jsx')),
  '/space-station': lazy(() => import('./SpaceStationPage.jsx')),
  '/tonight': lazy(() => import('./TonightPage.jsx')),
  '/cosmic-neighbors': lazy(() => import('./CosmicNeighborsPage.jsx')),
}

const services = [
  { title: 'Your birthday picture', description: 'Enter your birthday to see NASA’s picture from that date, or shuffle for a surprise.', href: '/birthday', action: 'Find my birthday picture', art: 'galaxy' },
  { title: 'Moon phase', description: 'See the Moon’s phase for any date you choose.', href: '/moon', action: 'Find your Moon', art: 'moon' },
  { title: 'Solar System', description: 'Eight worlds. Get a little closer to each one.', href: '/solar-system', action: 'Explore the planets', art: 'planets' },
  { title: 'Cosmic pets', description: 'Meet a little collection of curious cosmic companions.', href: '/pets', action: 'Meet the pets', art: 'pets' },
  ...EXTRA_DISCOVERIES.filter((service) => service.enabled),
]

function PetsArt() {
  const pet = PETS[0]
  return <div className="service-pet-preview">
    <img src={pet.image} alt="" width="1254" height="1254" loading="lazy" />
    <div className="pet-eyes">{pet.eyes.map((eye, index) => <span key={index} className="pet-eye" style={{ left: `${eye.x}%`, top: `${eye.y}%`, width: `${eye.width}%`, height: `${eye.height}%` }}><span className="pet-pupil" /></span>)}</div>
  </div>
}

function SolarSystemArt() {
  const host = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '100px' })
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  return <div ref={host} className="service-planet-preview">{visible && <Suspense fallback={null}><PlanetScene planet={PLANETS[5]} decorative /></Suspense>}</div>
}

function NearViewport({ children }) {
  const host = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { rootMargin: '200px' })
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  return <div ref={host} className="deferred-preview">{visible && <Suspense fallback={null}>{children}</Suspense>}</div>
}

function ShowcaseSection() {
  const video = useRef(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const element = video.current
    let inView = false
    const update = () => {
      if (inView && !document.hidden) {
        setActive(true)
        element.play().catch(() => {})
      } else element.pause()
    }
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update() }, { rootMargin: '100px' })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); element.pause() }
  }, [])
  return (
    <section className="showcase-section" aria-labelledby="showcase-title">
      <h2 id="showcase-title" className="showcase-title" data-scroll-reveal>See it come alive.</h2>
      <div className="showcase-video-wrap" data-scroll-reveal>
        <video
          ref={video}
          className="showcase-video"
          src={active ? '/brag.mp4' : undefined}
          preload="none"
          autoPlay={active}
          muted
          loop
          playsInline
          aria-label="Celestial showcase video"
        />
      </div>
    </section>
  )
}

function LandingPage() {
  const landing = useScrollReveal()
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
          {services.map(({ title, description, href, action, art }) => (
            <a key={href} href={href} className="service-card" data-scroll-reveal>
              <div className={`service-art${art === 'moon' ? ' service-art-moon' : ''}`} aria-hidden="true">
                {art === 'moon' ? <NearViewport><MoonVisual fraction={.218} waxing decorative /></NearViewport> : art === 'planets' ? <SolarSystemArt /> : art === 'pets' ? <PetsArt /> : art === 'galaxy' || art === 'shuffle' ? <img className="service-photo" src={art === 'shuffle' ? SHUFFLE_IMAGE : galaxyImage} alt="" loading="lazy" decoding="async" /> : <DiscoveryArt type={art} />}
              </div>
              <div className="service-copy"><h3>{title}</h3><p>{description}</p><span>{action} <ArrowRight size={18} aria-hidden="true" /></span></div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function App() {
  const root = useRef(null)
  const pathname = window.location.pathname.replace(/\/$/, '') || '/'
  const extraService = EXTRA_DISCOVERIES.find((service) => service.enabled && service.href === pathname)
  const ExtraPage = extraService ? extraPages[pathname] : null
  const isBirthday = /^\/birthday\/?$/.test(window.location.pathname)
  const isMoon = /^\/moon\/?$/.test(window.location.pathname)
  const isShuffle = /^\/shuffle\/?$/.test(window.location.pathname)
  const isSolar = /^\/solar-system\/?$/.test(window.location.pathname)
  const isPets = /^\/pets\/?$/.test(window.location.pathname)
  const isDiscovery = isBirthday || isMoon || isShuffle || isSolar || isPets || Boolean(ExtraPage)

  useEffect(() => {
    document.title = extraService ? `${extraService.title} — Celestial` : isBirthday ? 'Your birthday picture — Celestial' : isMoon ? 'Moon phase — Celestial' : isShuffle ? 'Cosmic shuffle — Celestial' : isSolar ? 'Solar System — Celestial' : isPets ? 'Cosmic pets — Celestial' : 'Celestial — Among the stars'
    if (extraService || isMoon || isShuffle || isSolar || isPets) return
    const context = gsap.context(() => {
      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        if (isBirthday) {
          gsap.from('.birthday-controls > *', { y: 18, autoAlpha: 0, stagger: .09, ease: 'expo.out', duration: 1 })
          return
        }
        const entrance = gsap.timeline({ defaults: { ease: 'expo.out', clearProps: 'transform,opacity,visibility,filter' } })
        entrance.from('.hero-copy', { y: 10, duration: .65 })
      })
    }, root)
    return () => context.revert()
  }, [isBirthday, isMoon, isShuffle, isSolar, isPets, extraService])

  return (
    <div ref={root} className="site-shell">
      <Starfield />
      <ShootingStars />
      <PreviewCursor />
      <a href={ExtraPage ? '#discovery-controls' : isBirthday ? '#birthday' : isMoon ? '#moon-form' : isShuffle ? '#shuffle-button' : isSolar ? '#planet-showcase' : isPets ? '#pets-gallery' : '#services'} className="skip-link">{ExtraPage ? 'Skip to discovery controls' : isBirthday ? 'Skip to birthday lookup' : isMoon ? 'Skip to Moon lookup' : isShuffle ? 'Skip to shuffle' : isSolar ? 'Skip to planet showcase' : isPets ? 'Skip to pets' : 'Skip to explore'}</a>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Celestial home"><Orbit size={27} strokeWidth={1.2} aria-hidden="true" /><span>celestial</span></a>
        <nav aria-label="Main navigation"><a href={isDiscovery ? '/#services' : '#services'}>Explore <ArrowUpRight size={15} aria-hidden="true" /></a></nav>
      </header>
      <main>{ExtraPage ? <Suspense fallback={<p className="moon-route-loading" role="status">Opening {extraService.title}…</p>}><ExtraPage /></Suspense> : isBirthday ? <Suspense fallback={<p className="moon-route-loading" role="status">Opening your birthday picture…</p>}><BirthdayPage /></Suspense> : isMoon ? <Suspense fallback={<p className="moon-route-loading" role="status">Opening your Moon…</p>}><MoonPage /></Suspense> : isShuffle ? <Suspense fallback={<p className="moon-route-loading" role="status">Opening Cosmic shuffle…</p>}><ShufflePage /></Suspense> : isSolar ? <Suspense fallback={<p className="moon-route-loading" role="status">Opening the Solar System…</p>}><SolarSystemPage /></Suspense> : isPets ? <Suspense fallback={<p className="moon-route-loading" role="status">The pets are arriving…</p>}><PetsPage /></Suspense> : <LandingPage />}</main>
      <LocationSharing />
      <footer className="site-footer"><span className="footer-wordmark"><Orbit size={27} strokeWidth={1.2} aria-hidden="true" /><span>celestial</span></span>{isPets && <span>Little companions, made for Celestial.</span>}<span>Made by .dcd</span></footer>
    </div>
  )
}
