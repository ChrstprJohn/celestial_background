import { lazy, Suspense, useState } from 'react'

const PlanetScene = lazy(() => import('./PlanetScene.jsx'))

export default function DiscoveryPlanet({ planet, captureRef, onCaptureReady }) {
  const [retry, setRetry] = useState(0)
  return <Suspense fallback={<p className="discovery-note">Opening the view…</p>}><PlanetScene key={`${planet.id}-${retry}`} planet={planet} decorative showFeedback captureRef={captureRef} onCaptureReady={onCaptureReady} onRetry={() => setRetry((value) => value + 1)} /></Suspense>
}
