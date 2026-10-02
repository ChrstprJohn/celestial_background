import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Download, LoaderCircle } from 'lucide-react'
import axios from 'axios'
import { formatDate } from './lib/dates.js'

export default function BirthdayImage({ entry }) {
  const [imageFailed, setImageFailed] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const request = useRef(null)
  const downloads = useRef(new Map())

  useEffect(() => {
    const activeDownloads = downloads.current
    return () => {
      request.current?.abort()
      for (const [url, timer] of activeDownloads) {
        clearTimeout(timer)
        URL.revokeObjectURL(url)
      }
    }
  }, [])

  async function downloadImage() {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setDownloading(true)
    setError('')
    setStatus('')
    try {
      const { data: blob } = await axios.get(entry.image, { responseType: 'blob', signal: controller.signal, timeout: 30000 })
      if (!blob.type.startsWith('image/')) throw new Error('The image file is unavailable.')
      const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp', 'image/avif': 'avif', 'image/tiff': 'tif', 'image/svg+xml': 'svg' }[blob.type.split(';')[0]] || 'img'
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `celestial-${entry.date}.${extension}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      downloads.current.set(url, setTimeout(() => {
        URL.revokeObjectURL(url)
        downloads.current.delete(url)
      }, 60000))
      setStatus('Your image download has started.')
    } catch (issue) {
      if (!axios.isCancel(issue) && !controller.signal.aborted) setError('Couldn’t download the image. Try again, or open the original image to save it.')
    } finally {
      if (!controller.signal.aborted) setDownloading(false)
    }
  }

  return (
    <figure className="birthday-image">
      {imageFailed ? <div className="image-fallback"><p>The preview couldn’t load.</p><a href={entry.image} target="_blank" rel="noreferrer">Open original image <ArrowUpRight size={14} aria-hidden="true" /></a></div> : <img className="original-image" src={entry.image} alt={entry.alt} onError={() => setImageFailed(true)} />}
      <div className="image-details">
        <figcaption><p className="result-date">{formatDate(entry.date)}</p><h2>{entry.title}</h2></figcaption>
        <button className="image-download" type="button" onClick={downloadImage} disabled={downloading}>{downloading ? <><LoaderCircle className="loading-icon" size={16} aria-hidden="true" /> Downloading</> : <><Download size={16} strokeWidth={1.5} aria-hidden="true" /> Download</>}</button>
      </div>
      {error && <><p className="form-error" role="alert">{error}</p><a className="source-link" href={entry.image} target="_blank" rel="noreferrer">Open original image <ArrowUpRight size={14} aria-hidden="true" /></a></>}
      <p className="sr-only" role="status">{status}</p>
    </figure>
  )
}
