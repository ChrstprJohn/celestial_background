import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, LoaderCircle, Orbit, Telescope } from 'lucide-react'
import axios from 'axios'
import { fetchApod } from './lib/apod.js'
import { ARCHIVE_START, nasaToday, validateDate } from './lib/dates.js'
import BirthdayImage from './BirthdayImage.jsx'
import DatePicker from './DatePicker.jsx'

function EmptyPreview({ loading = false }) {
  return (
    <div className="empty-preview" role={loading ? 'status' : undefined}>
      {loading ? <LoaderCircle className="loading-icon" size={32} strokeWidth={1.5} aria-hidden="true" /> : <Orbit size={40} strokeWidth={1} aria-hidden="true" />}<p>{loading ? 'Loading NASA’s picture' : 'Choose a date'}</p>
    </div>
  )
}

function VideoResult({ entry }) {
  return (
    <div className="video-result">
      {entry.mediaType === 'video' && entry.video ? <iframe className="result-video" src={entry.video} title={entry.title} allow="fullscreen; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <Telescope size={40} strokeWidth={1.2} aria-hidden="true" />}
      <p className="media-note">{entry.mediaType === 'video' ? 'This date features a video.' : 'The image preview is unavailable for this date.'}</p>
    </div>
  )
}

export default function BirthdayPage() {
  const request = useRef(null)
  const [today] = useState(nasaToday)
  const [date, setDate] = useState(today)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [imageStatus, setImageStatus] = useState('loading')
  const busy = loading || Boolean(result?.mediaType === 'image' && result.image && imageStatus === 'loading')
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
    setImageStatus('loading')
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
        <a className="back-link" href="/#services"><ArrowLeft size={20} aria-hidden="true" /> Back</a>
        <h1 id="birthday-title">Your birthday.<br /><em>Your picture.</em></h1>
        <p className="birthday-description">Choose your birthday or any date to see NASA’s Astronomy Picture of the Day. Some dates feature videos.</p>
        <div id="birthday" className="birthday-form" aria-busy={loading}>
          <label htmlFor="birthdate">Birthday or date</label>
          <DatePicker id="birthdate" name="birthdate" label="Birthday or date" min={ARCHIVE_START} max={today} today={today} value={date} onChange={discover} describedBy={error ? 'date-help lookup-error' : 'date-help'} invalid={Boolean(error)} />
          <p id="date-help" className="date-help">Available from June 16, 1995.</p>
          {error && <p id="lookup-error" className="form-error" role="alert">{error}</p>}
          <p className="date-help" role="status">{loading ? 'Looking up NASA’s picture for your selected date…' : ''}</p>
        </div>
      </div>

      <div className="image-workspace" role="region" aria-label="NASA archive preview" tabIndex={-1} aria-busy={busy}>
        {loading ? <EmptyPreview loading /> : result ? <>
          {result.mediaType === 'image' && result.image ? <BirthdayImage key={result.date} entry={result} onStatusChange={setImageStatus} /> : <VideoResult entry={result} />}
          {result.credit && <div className="result-attribution"><p className="image-credit">{result.credit}</p></div>}
        </> : <EmptyPreview loading={loading} />}
      </div>
    </section>
  )
}


