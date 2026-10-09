import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, ChevronDown } from 'lucide-react'
import PlanetScene from './PlanetScene.jsx'
import { PLANETS, PLANET_FACTS_SOURCE, TEXTURE_SOURCE, findPlanet, planetTexture } from './lib/planets.js'

export default function SolarSystemPage() {
  const [planet, setPlanet] = useState(() => findPlanet(new URLSearchParams(window.location.search).get('planet')))
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const restore = () => setPlanet(findPlanet(new URLSearchParams(window.location.search).get('planet')))
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])

  useEffect(() => {
    document.title = `${planet.name} · Solar System — Celestial`
  }, [planet])

  function choose(selected) {
    if (selected.id === planet.id) return
    const url = new URL(window.location.href)
    url.searchParams.set('planet', selected.id)
    window.history.pushState(null, '', url)
    setPlanet(selected)
  }

  return (
    <section className="solar-workspace" aria-label="Solar System showcase">
      <aside className="planet-sidebar">
        <a className="back-link" href="/#services"><ArrowLeft size={20} aria-hidden="true" /> Back</a>
        <div className="planet-introduction" aria-live="polite" aria-atomic="true">
          <h1>{planet.name}</h1>
          <p className="planet-subtitle">{planet.subtitle}</p>
          <p className="planet-description">{planet.description}</p>
        </div>
        <p className="planet-selector-label">Choose your planet</p>
        <nav className="planet-list" aria-label="Choose a planet">
          {PLANETS.map((item) => <button key={item.id} className={`planet-choice${item.id === planet.id ? ' is-selected' : ''}`} aria-pressed={item.id === planet.id} onClick={() => choose(item)}>
            <span className={`planet-thumbnail planet-thumbnail-${item.id}`} aria-hidden="true" style={{ backgroundImage: `url(${planetTexture(item.id)})`, backgroundColor: item.color }} />
            <span>{item.name}</span>
          </button>)}
        </nav>
      </aside>

      <article id="planet-showcase" className="planet-showcase" tabIndex={-1}>
        <PlanetScene key={`${planet.id}-${retry}`} planet={planet} onRetry={() => setRetry((value) => value + 1)} />
      </article>
      <section className="planet-details" aria-label={`About ${planet.name}`}>
        <dl className="planet-facts" aria-label={`${planet.name} facts`}>
          <div><dt>Equatorial diameter</dt><dd>{planet.diameter}</dd></div>
          <div><dt>One rotation</dt><dd>{planet.rotation}</dd></div>
          <div><dt>One year</dt><dd>{planet.year}</dd></div>
          <div><dt>Planet type</dt><dd>{planet.type}</dd></div>
        </dl>
        <PlanetStory planet={planet} />
        <div className="planet-sources">
          <div><a href={PLANET_FACTS_SOURCE} target="_blank" rel="noreferrer">Facts: NASA <ArrowUpRight size={12} aria-hidden="true" /></a><a href={TEXTURE_SOURCE} target="_blank" rel="noreferrer">Textures: Solar System Scope · CC BY 4.0 <ArrowUpRight size={12} aria-hidden="true" /></a></div>
        </div>
      </section>
    </section>
  )
}

function PlanetStory({ planet }) {
  return <details key={planet.id} className="planet-story">
    <summary>About {planet.name} <ChevronDown size={16} aria-hidden="true" /></summary>
    <p>{planet.story}</p>
    <a className="source-link" href={`https://science.nasa.gov/${planet.id}/facts/`} target="_blank" rel="noreferrer">Explore {planet.name} with NASA <ArrowUpRight size={13} aria-hidden="true" /></a>
  </details>
}
