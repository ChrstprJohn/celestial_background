import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, LoaderCircle, Orbit, Shuffle, Telescope } from 'lucide-react'
import axios from 'axios'
import { fetchApod } from './lib/apod.js'
import { imageIdentity, nextDiscovery, prepareDiscoveryImage } from './lib/shuffle.js'
import { ARCHIVE_START, nasaToday, validateDate } from './lib/dates.js'
import BirthdayImage from './BirthdayImage.jsx'
import DatePicker from './DatePicker.jsx'

function EmptyPreview({ loading = false }) {
  return (
    <div className="empty-preview">
      {loading ? <LoaderCircle className="loading-icon" size={32} strokeWidth={1.5} aria-hidden="true" /> : <Orbit size={40} strokeWidth={1} aria-hidden="true" />}<p>{loading ? 'Loading NASA’s picture' : 'Choose a date or shuffle'}</p>
    </div>
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

export default function BirthdayPage() {
  const request = useRef(null)
  const seenDates = useRef(new Set())
  const seenImages = useRef(new Set())
  const [today] = useState(nasaToday)
  const [date, setDate] = useState(today)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    request.current = controller
    fetchApod(today, controller.signal).then((entry) => {
      if (!controller.signal.aborted) setResult(entry)
    }).catch((issue) => {
      if (!axios.isCancel(issue) && !controller.signal.aborted) setError(issue.message)
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => { controller.abort(); request.current?.abort() }
  }, [today])

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

  async function surprise() {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setLoading(true)
    setError('')
    if (result) {
      seenDates.current.add(result.date)
      if (result.image) seenImages.current.add(imageIdentity(result.image))
    }
    try {
      const entry = await nextDiscovery({ fetchEntry: fetchApod, prepareImage: prepareDiscoveryImage, seenDates: seenDates.current, seenImages: seenImages.current, signal: controller.signal, today })
      if (!controller.signal.aborted) { setResult(entry); setDate(entry.date) }
    } catch (issue) {
      if (!controller.signal.aborted) setError(issue.message)
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  return (
    <section className="birthday-workspace" aria-labelledby="birthday-title">
      <div className="birthday-controls">
        <a className="back-link" href="/#services"><ArrowLeft size={16} aria-hidden="true" /> Explore</a>
        <h1 id="birthday-title">Your birthday.<br /><em>Your picture.</em></h1>
        <p className="birthday-description">Choose your birthday or any date to see NASA’s Astronomy Picture of the Day. Or shuffle for a random archive image. Some dates feature videos.</p>
        <div id="birthday" className="birthday-form" aria-busy={loading}>
          <label htmlFor="birthdate">Birthday or date</label>
          <DatePicker id="birthdate" name="birthdate" label="Birthday or date" min={ARCHIVE_START} max={today} today={today} value={date} onChange={discover} describedBy={error ? 'date-help lookup-error' : 'date-help'} invalid={Boolean(error)} />
          <p id="date-help" className="date-help">Available from June 16, 1995.</p>
          <button className="primary-button lookup-button" type="button" onClick={surprise} disabled={loading}>Shuffle image <Shuffle size={18} aria-hidden="true" /></button>
          {error && <p id="lookup-error" className="form-error" role="alert">{error}</p>}
          <p className="date-help" role="status">{loading ? 'Looking up NASA’s picture for your selected date…' : ''}</p>
        </div>
      </div>

      <div className="image-workspace" role="region" aria-label="NASA archive preview" tabIndex={-1} aria-busy={loading}>
        {result ? <>
          {result.mediaType === 'image' && result.image ? <BirthdayImage key={result.date} entry={result} /> : <VideoResult entry={result} />}
          <div className="result-attribution">
            <a className="source-link" href={result.source} target="_blank" rel="noreferrer">NASA original <ArrowUpRight size={14} aria-hidden="true" /></a>
            {result.credit && <p className="image-credit">{result.credit}</p>}
          </div>
        </> : <EmptyPreview loading={loading} />}
      </div>
    </section>
  )
}


