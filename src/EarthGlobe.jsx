import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default function EarthGlobe({ station, follow }) {
  const host = useRef(null)
  const sceneControls = useRef(null)
  const [status, setStatus] = useState('loading')
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    const container = host.current
    let renderer
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }) }
    catch { const timer = setTimeout(() => setStatus('unsupported'), 0); return () => clearTimeout(timer) }
    let disposed = false
    let frame = 0
    let inView = true
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 30)
    camera.position.set(0, .4, 3.6)
    const controls = new OrbitControls(camera, container)
    controls.enablePan = false
    controls.enableZoom = false
    controls.enableDamping = false
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-hidden', 'true')
    const geometry = new THREE.SphereGeometry(1, 64, 48)
    const material = new THREE.MeshBasicMaterial({ color: '#ffffff' })
    const earth = new THREE.Mesh(geometry, material)
    scene.add(earth)
    const markerGeometry = new THREE.SphereGeometry(.025, 16, 12)
    const markerMaterial = new THREE.MeshBasicMaterial({ color: '#f3f0e9' })
    const marker = new THREE.Mesh(markerGeometry, markerMaterial)
    marker.visible = false
    scene.add(marker)
    const trailGeometry = new THREE.BufferGeometry()
    const trailMaterial = new THREE.LineBasicMaterial({ color: '#c9c1f0', transparent: true, opacity: .7 })
    const trail = new THREE.Line(trailGeometry, trailMaterial)
    scene.add(trail)
    const points = []
    let previousTimestamp = null
    const render = () => {
      if (!disposed && inView && !document.hidden && !frame) frame = requestAnimationFrame(() => { frame = 0; renderer.render(scene, camera) })
    }
    function position(data, tracking) {
      controls.enabled = !tracking
      if (data) {
        const latitude = THREE.MathUtils.degToRad(data.latitude)
        const longitude = THREE.MathUtils.degToRad(data.longitude)
        marker.position.set(Math.cos(latitude) * Math.cos(longitude), Math.sin(latitude), -Math.cos(latitude) * Math.sin(longitude)).multiplyScalar(1 + data.altitude / 6371)
        marker.visible = true
        if (data.timestamp !== previousTimestamp) {
          previousTimestamp = data.timestamp
          points.push(marker.position.clone())
          if (points.length > 120) points.shift()
          trailGeometry.setFromPoints(points)
        }
        if (tracking) { camera.position.copy(marker.position).normalize().multiplyScalar(3.6); camera.up.set(0,1,0); camera.lookAt(0,0,0); controls.update() }
      }
      render()
    }
    function rotate(direction) {
      camera.position.applyAxisAngle(new THREE.Vector3(0,1,0), direction * Math.PI / 12)
      camera.lookAt(0,0,0)
      controls.update()
      render()
    }
    function resize() {
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      render()
    }
    const texture = new THREE.TextureLoader().load('/textures/planets/earth.jpg', (loaded) => {
      if (disposed) { loaded.dispose(); return }
      loaded.colorSpace = THREE.SRGBColorSpace
      material.map = loaded
      material.needsUpdate = true
      setStatus('ready')
      render()
    }, undefined, () => { if (!disposed) setStatus('error') })
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; render() })
    observer.observe(container)
    controls.addEventListener('change', render)
    document.addEventListener('visibilitychange', render)
    sceneControls.current = { position, rotate }
    resize()
    return () => {
      disposed = true
      sceneControls.current = null
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      observer.disconnect()
      document.removeEventListener('visibilitychange', render)
      controls.dispose()
      texture.dispose()
      geometry.dispose()
      material.dispose()
      markerGeometry.dispose()
      markerMaterial.dispose()
      trailGeometry.dispose()
      trailMaterial.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [retry])
  useEffect(() => { sceneControls.current?.position(station, follow) }, [station, follow, retry])
  return <div className="earth-viewer">
    <div ref={host} className="earth-stage" tabIndex={0} role="group" aria-label="Earth globe with station position. Turn off Follow station to rotate with left and right arrow keys." onKeyDown={(event) => {
      if (!follow && ['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); sceneControls.current?.rotate(event.key === 'ArrowLeft' ? -1 : 1) }
    }}>
      {status !== 'ready' && <div className="earth-feedback" role="status"><p>{status === 'unsupported' ? 'The 3D globe isn’t supported here. The live coordinates are shown below.' : status === 'error' ? 'The Earth texture couldn’t load.' : 'Opening our world…'}</p>{status === 'error' && <button className="secondary-button" onClick={() => { setStatus('loading'); setRetry((value) => value + 1) }}>Try again</button>}</div>}
    </div>
    <p className="discovery-note">{follow ? 'Following the station. Turn off Follow station to explore Earth.' : 'Drag to rotate, or focus the globe and use left/right arrow keys.'}</p>
  </div>
}
