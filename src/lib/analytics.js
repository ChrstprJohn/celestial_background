import { resolveLocation } from './location.js'

const token = import.meta.env.VITE_POSTHOG_TOKEN

export const analyticsEnabled = Boolean(token)
let clientPromise
function analyticsClient() {
  if (!clientPromise) clientPromise = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(token, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: 'history_change',
      person_profiles: 'identified_only',
      disable_session_recording: true,
      loaded: (client) => client.register({ site_name: 'celestial' }),
      before_send: (event) => {
        if (event) event.properties = { ...event.properties, site_name: 'celestial' }
        return event
      },
    })
    return posthog
  }).catch((error) => { clientPromise = undefined; throw error })
  return clientPromise
}
export async function shareVisitorLocation(coords) {
  if (!token) throw new Error('Analytics is disabled; your location was not sent.')
  const posthog = await analyticsClient()
  if (posthog.has_opted_out_capturing()) throw new Error('Analytics is disabled; your location was not sent.')
  const place = await resolveLocation(coords)
  if (posthog.has_opted_out_capturing()) throw new Error('Analytics is disabled; your location was not sent.')
  // This explicit opt-in event needs an HTTP acknowledgement before hiding the prompt.
  // Reuse the SDK identity, but send only one event rather than also queueing a capture.
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'
  const response = await fetch(`${host.replace(/\/$/, '')}/i/v0/e/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      api_key: token,
      event: 'visitor_location_shared',
      properties: {
        distinct_id: posthog.get_distinct_id(),
        site_name: 'celestial',
        ...place,
        latitude: coords.latitude, longitude: coords.longitude,
        accuracy_meters: coords.accuracy, location_source: 'browser_geolocation',
        $current_url: window.location.href,
        $process_person_profile: false,
      },
      timestamp: new Date().toISOString(),
    }),
  })
  if (!response.ok) throw new Error('Location could not be sent. Please try again.')
  return true
}

if (token) {
  const start = () => {
    const load = () => { analyticsClient().catch(() => {}) }
    if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 3000 })
    else window.setTimeout(load, 1000)
  }
  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start, { once: true })
}
