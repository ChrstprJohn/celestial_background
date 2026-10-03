import { useEffect, useState } from 'react'
import { analyticsEnabled, shareVisitorLocation } from './lib/analytics.js'
import './location-sharing.css'

const choiceKey = 'celestial-location-choice'

function hasLocationChoice() {
  // Old "shared" choices were saved before delivery was acknowledged. Allow a retry.
  try { const choice = window.localStorage.getItem(choiceKey); return Boolean(choice && choice !== 'shared') }
  catch { return false }
}

function rememberLocationChoice(choice) {
  try { window.localStorage.setItem(choiceKey, choice) }
  catch { /* Storage may be unavailable in private or restricted browsers. */ }
}

export default function LocationSharing() {
  const [state, setState] = useState('idle')
  const [message, setMessage] = useState('')
  const [dismissed, setDismissed] = useState(hasLocationChoice)
  useEffect(() => {
    if (state !== 'shared') return
    const timer = window.setTimeout(() => setDismissed(true), 3000)
    return () => window.clearTimeout(timer)
  }, [state])
  if (!analyticsEnabled) return null
  if (dismissed) return <button className="location-reopen" onClick={() => { setState('idle'); setMessage(''); setDismissed(false) }}>Share location</button>
  function share() {
    if (!window.isSecureContext || !navigator.geolocation) {
      setMessage('Location sharing is unavailable in this browser. You can keep exploring.')
      return
    }
    setState('pending')
    setMessage('Waiting for location permission…')
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      setMessage('Sending your location…')
      try {
        await shareVisitorLocation(coords)
        rememberLocationChoice('delivered')
        setState('shared')
        setMessage(`Location submitted for analytics. Reported accuracy: approximately ${Math.ceil(coords.accuracy)} metres.`)
      } catch (error) {
        setState('idle')
        setMessage(error.message === 'Analytics is disabled; your location was not sent.' ? error.message : 'Location could not be sent. Check your connection or content blocker, then try again.')
      }
    }, (error) => {
      if (error.code === 1) rememberLocationChoice('declined')
      setState('idle')
      setMessage(error.code === 1 ? 'Location was not shared. To try again, allow location in your browser’s site settings.' : error.code === 3 ? 'The location request timed out. You can try again.' : 'Your device could not determine its location. You can try again.')
    }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 })
  }
  return <section className="location-sharing" aria-labelledby="location-sharing-title">
    <div>
      <h2 id="location-sharing-title">Share where you’re visiting from</h2>
      <p id="location-sharing-description">Help us understand where our visitors are from by sharing your current location. It’s optional, and your browser will ask permission. We only collect it once when you share—we don’t track your movement.</p>
      <p role="status">{message}</p>
    </div>
    <div className="location-sharing-actions">
      <button className="primary-button" onClick={share} disabled={state !== 'idle'} aria-describedby="location-sharing-description">{state === 'pending' ? 'Locating…' : state === 'shared' ? 'Location submitted' : 'Share location'}</button>
      <button className="location-dismiss" disabled={state === 'pending'} onClick={() => { rememberLocationChoice(state === 'shared' ? 'delivered' : 'dismissed'); setDismissed(true) }}>{state === 'shared' ? 'Close' : 'Not now'}</button>
    </div>
  </section>
}
