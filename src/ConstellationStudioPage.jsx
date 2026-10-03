import { useRef, useState } from 'react'
import { RotateCcw, Shuffle, Undo2 } from 'lucide-react'
import DiscoveryLayout, { ArtDownload } from './DiscoveryLayout.jsx'
import { addConnection, freshStars, KITE_PATH, STARTER_STARS } from './lib/studio.js'

export default function ConstellationStudioPage() {
  const [stars, setStars] = useState(STARTER_STARS)
  const [path, setPath] = useState([])
  const [name, setName] = useState('A little constellation')
  const svg = useRef(null)
  const points = path.map((index) => stars[index].join(',')).join(' ')
  return <DiscoveryLayout id="studio" title="A few stars." emphasis="Your imagination." description="Tap one star, then another. Keep connecting until you see something you love." controls={<>
    <label htmlFor="constellation-name">Name your constellation</label><input id="constellation-name" className="text-field" value={name} maxLength={48} onChange={(event) => setName(event.target.value)} />
    <button type="button" className="primary-button" onClick={() => { setStars(STARTER_STARS); setPath(KITE_PATH); setName('A little kite') }}>Show me a little kite</button>
    <p className="discovery-note">Try the example to see how it works, then make your own. These stars are an imaginary drawing playground.</p>
    <div className="button-row"><button type="button" className="secondary-button" disabled={!path.length} onClick={() => setPath((current) => current.slice(0, -1))}><Undo2 size={16} aria-hidden="true" /> Undo</button><button type="button" className="secondary-button" disabled={!path.length} onClick={() => setPath([])}><RotateCcw size={16} aria-hidden="true" /> Clear lines</button></div>
    <button type="button" className="secondary-button" onClick={() => { setStars(freshStars()); setPath([]) }}><Shuffle size={16} aria-hidden="true" /> New stars</button>
    <ArtDownload svgRef={svg} filename="celestial-my-constellation.png" disabled={path.length < 2} label="Save my constellation" />
  </>}>
    <div className="studio-board" role="group" aria-label="Constellation drawing area">
      <svg ref={svg} viewBox="0 0 600 575" data-export-view-box="0 0 600 680" className="studio-art" role="img" aria-label={`${name || 'Your constellation'}, ${Math.max(path.length - 1, 0)} connected lines`}>
        <rect width="600" height="680" fill="#070b17" />
        {Array.from({ length: 48 }, (_, i) => <circle key={i} cx={30 + (i * 137) % 540} cy={30 + (i * 193) % 540} r={i % 3 ? .8 : 1.4} fill="#c9c1f0" opacity=".4" />)}
        <polyline points={points} fill="none" stroke="#c9c1f0" strokeWidth="2" strokeLinejoin="round" />
        {stars.map(([x,y], index) => <g key={index}><circle cx={x} cy={y} r={path.includes(index) ? 5 : 3.5} fill={path.includes(index) ? '#f3f0e9' : '#c9c1f0'} />{index === path.at(-1) && <circle cx={x} cy={y} r="11" fill="none" stroke="#c9c1f0" strokeWidth="1" />}</g>)}
        <g className="export-caption"><text x="300" y="628" fill="#f3f0e9" fontFamily="Instrument Serif, Georgia, serif" fontSize={Math.min(26,520 / Math.max(1,name.length * .95))} textAnchor="middle">{name || 'Your constellation'}</text><text x="300" y="657" fill="#a4abc2" fontFamily="DM Sans, Arial, sans-serif" fontSize="11" textAnchor="middle">An imaginary constellation, made with Celestial</text></g>
      </svg>
      {stars.map(([x,y], index) => <button key={index} type="button" className="studio-star" style={{ left:`${x / 6}%`, top:`${y / 5.75}%` }} aria-label={`Connect star ${index + 1}`} aria-pressed={path.includes(index)} onClick={() => setPath((current) => addConnection(current, index))} />)}
    </div>
    <div className="art-caption"><h2>{name || 'Your constellation'}</h2><p>An imaginary constellation, made with Celestial</p></div>
    <p className="studio-instruction" role="status">{path.length === 0 ? 'Start by tapping any bright star.' : path.length === 1 ? 'Now tap another star to draw your first line.' : `${path.length - 1} lines connected. Tap another star, or save your creation.`}</p>
  </DiscoveryLayout>
}
