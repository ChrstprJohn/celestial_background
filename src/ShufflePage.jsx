import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, LoaderCircle, Shuffle } from 'lucide-react'
import { fetchApod } from './lib/apod.js'
import { FEATURED_DISCOVERY } from './lib/featured.js'
import { formatDate } from './lib/dates.js'
import { imagePreviewUrl } from './lib/image-preview.js'
import { imageIdentity, nextDiscovery, prepareDiscoveryImage } from './lib/shuffle.js'

export default function ShufflePage() {
  const [result, setResult] = useState(FEATURED_DISCOVERY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFailed, setImageFailed] = useState(false)
  const request = useRef(null)
  const seenDates = useRef(new Set([FEATURED_DISCOVERY.date]))
  const seenImages = useRef(new Set([imageIdentity(FEATURED_DISCOVERY.image)]))

  useEffect(() => () => request.current?.abort(), [])

  async function surprise() {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setLoading(true)
    setError('')
    try {
      const entry = await nextDiscovery({ fetchEntry: fetchApod, prepareImage: prepareDiscoveryImage, seenDates: seenDates.current, seenImages: seenImages.current, signal: controller.signal })
      if (!controller.signal.aborted) {
        setImageFailed(false)
        setResult(entry)
      }
    } catch (issue) {
      if (!controller.signal.aborted) setError(issue.message || 'Couldn’t find your next discovery. Please try again.')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  return (
    <section className="shuffle-workspace" aria-labelledby="shuffle-title">
      <div className="shuffle-controls">
        <a className="back-link" href="/#services"><ArrowLeft size={20} aria-hidden="true" /> Back</a>
        <h1 id="shuffle-title">Cosmic <em>shuffle.</em></h1>
        <p className="shuffle-description">Let the universe surprise you.</p>
        <button id="shuffle-button" className="primary-button lookup-button shuffle-button" type="button" onClick={surprise} disabled={loading}>{loading ? <>Finding a discovery <LoaderCircle className="loading-icon" size={18} aria-hidden="true" /></> : <>Surprise me <Shuffle size={18} aria-hidden="true" /></>}</button>
        <p className="sr-only" role="status">{loading ? 'Finding and loading a different image from NASA’s archive.' : ''}</p>
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
      <div className="shuffle-result">
        <figure className="shuffle-figure" aria-busy={loading}>
          <div className="shuffle-image-stage">
            {imageFailed ? <div className="image-fallback"><p>The preview couldn’t load.</p><a href={result.image} target="_blank" rel="noreferrer">Open original image <ArrowUpRight size={14} aria-hidden="true" /></a></div> : <img className="shuffle-image" src={imagePreviewUrl(result.image)} alt={result.alt || result.title} decoding="async" onError={() => setImageFailed(true)} />}
          </div>
          <figcaption className="shuffle-details" aria-live="polite" aria-atomic="true"><p className="result-date">{formatDate(result.date)}</p><h2>{result.title}</h2></figcaption>
        </figure>
        {result.credit && <div className="result-attribution shuffle-attribution"><p className="image-credit">{result.credit}</p></div>}
      </div>
    </section>
  )
}
