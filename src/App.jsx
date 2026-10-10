import { lazy, Suspense, useEffect } from 'react'
import { ArrowUpRight, Orbit } from 'lucide-react'
import Starfield from './Starfield.jsx'
import PreviewCursor from './PreviewCursor.jsx'
import ShootingStars from './ShootingStars.jsx'
import { EXTRA_DISCOVERIES } from './lib/discoveries.js'
import './discoveries.css'
import LocationSharing from './LocationSharing.jsx'
import './discovery-headings.css'
import './solar-system.css'
import './pet-eyes.css'
import './mobile-workspaces.css'
import usePagePath from './usePagePath.js'

const LandingPage = lazy(() => import('./LandingPage.jsx'))
const MoonPage = lazy(() => import('./MoonPage.jsx'))
const BirthdayPage = lazy(() => import('./BirthdayPage.jsx'))
const ShufflePage = lazy(() => import('./ShufflePage.jsx'))
const SolarSystemPage = lazy(() => import('./SolarSystemPage.jsx'))
const PetsPage = lazy(() => import('./PetsPage.jsx'))
const extraPages = {
  '/moon-match': lazy(() => import('./MoonMatchPage.jsx')),
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
const routes = new Set(['/', '/birthday', '/moon', '/shuffle', '/solar-system', '/pets', ...EXTRA_DISCOVERIES.filter((service) => service.enabled).map((service) => service.href)])

export default function App() {
  const pathname = usePagePath(routes)
  const extraService = EXTRA_DISCOVERIES.find((service) => service.enabled && service.href === pathname)
  const ExtraPage = extraService ? extraPages[pathname] : null
  const isBirthday = pathname === '/birthday'
  const isMoon = pathname === '/moon'
  const isShuffle = pathname === '/shuffle'
  const isSolar = pathname === '/solar-system'
  const isPets = pathname === '/pets'
  const isDiscovery = isBirthday || isMoon || isShuffle || isSolar || isPets || Boolean(ExtraPage)

  useEffect(() => {
    document.title = extraService ? `${extraService.title} — Celestial` : isBirthday ? 'Your birthday picture — Celestial' : isMoon ? 'Moon phase — Celestial' : isShuffle ? 'Cosmic shuffle — Celestial' : isSolar ? 'Solar System — Celestial' : isPets ? 'Cosmic pets — Celestial' : 'Celestial — Among the stars'
  }, [isBirthday, isMoon, isShuffle, isSolar, isPets, extraService])

  return (
    <div className="site-shell">
      <Starfield />
      <ShootingStars />
      <PreviewCursor />
      <a href={ExtraPage ? '#discovery-controls' : isBirthday ? '#birthday' : isMoon ? '#moon-form' : isShuffle ? '#shuffle-button' : isSolar ? '#planet-selection' : isPets ? '#pets-gallery' : '#services'} className="skip-link">{ExtraPage ? 'Skip to discovery controls' : isBirthday ? 'Skip to birthday lookup' : isMoon ? 'Skip to Moon lookup' : isShuffle ? 'Skip to shuffle' : isSolar ? 'Skip to planet selection' : isPets ? 'Skip to pets' : 'Skip to explore'}</a>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Celestial home"><Orbit size={27} strokeWidth={1.2} aria-hidden="true" /><span>celestial</span></a>
        <nav aria-label="Main navigation"><a href={isDiscovery ? '/#services' : '#services'}>Explore <ArrowUpRight size={15} aria-hidden="true" /></a></nav>
      </header>
      <main>{ExtraPage ? <Suspense fallback={<p className="moon-route-loading" role="status">Opening {extraService.title}…</p>}><ExtraPage /></Suspense> : isBirthday ? <Suspense fallback={<p className="moon-route-loading" role="status">Opening your birthday picture…</p>}><BirthdayPage /></Suspense> : isMoon ? <Suspense fallback={<p className="moon-route-loading" role="status">Opening your Moon…</p>}><MoonPage /></Suspense> : isShuffle ? <Suspense fallback={<p className="moon-route-loading" role="status">Opening Cosmic shuffle…</p>}><ShufflePage /></Suspense> : isSolar ? <Suspense fallback={<p className="moon-route-loading" role="status">Opening the Solar System…</p>}><SolarSystemPage /></Suspense> : isPets ? <Suspense fallback={<p className="moon-route-loading" role="status">The pets are arriving…</p>}><PetsPage /></Suspense> : <Suspense fallback={<p className="moon-route-loading" role="status">Opening Celestial…</p>}><LandingPage /></Suspense>}</main>
      {pathname === '/' && <LocationSharing />}
      <footer className="site-footer"><span className="footer-wordmark"><Orbit size={27} strokeWidth={1.2} aria-hidden="true" /><span>celestial</span></span><div className="footer-credit">{isPets && <span>Little companions, made for Celestial.</span>}<span>Made by .dcd</span></div></footer>
    </div>
  )
}
