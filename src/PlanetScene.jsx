import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { planetTexture } from './lib/planets.js'

const ZOOM_STEP = 1.1
const MAX_ZOOM = 1.2

export default function PlanetScene({ planet, decorative = false, onRetry }) {
  const host = useRef(null)
  const actions = useRef(null)
  const [status, setStatus] = useState('loading')
  const [zoomBounds, setZoomBounds] = useState({ near: false, far: true })

  useEffect(() => {
    const container = host.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      // Schedule feedback after setup so the component remains effect-safe.
      const timer = setTimeout(() => setStatus('unsupported'), 0)
      return () => clearTimeout(timer)
    }
    let disposed = false
    let frame = 0
    let visible = true
    let loaded = false
    const textures = []
    const materials = []
    const geometries = []
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    renderer.shadowMap.enabled = planet.id === 'saturn' && !decorative
    renderer.shadowMap.type = THREE.PCFShadowMap
    const canvas = renderer.domElement
    canvas.setAttribute('aria-hidden', 'true')
    container.appendChild(canvas)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.0001, 50)
    const controls = new OrbitControls(camera, container)
    controls.enablePan = false
    controls.enableDamping = false
    controls.rotateSpeed = 0.65
    controls.zoomSpeed = 0.7
    controls.cursorStyle = 'grab'
    controls.enabled = !decorative
    const group = new THREE.Group()
    group.rotation.z = THREE.MathUtils.degToRad(planet.tilt)
    scene.add(group)
    scene.add(new THREE.AmbientLight(0xc8d2ef, 0.35))
    const sunlight = new THREE.DirectionalLight(0xfff1dd, 2.8)
    sunlight.position.set(-4, 3, 3)
    sunlight.castShadow = renderer.shadowMap.enabled
    sunlight.shadow.mapSize.set(1024, 1024)
    Object.assign(sunlight.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.1, far: 15 })
    sunlight.shadow.bias = -0.0002
    sunlight.shadow.normalBias = 0.015
    scene.add(sunlight)

    const geometry = new THREE.SphereGeometry(1, 96, 64)
    geometries.push(geometry)
    const surface = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.96, metalness: 0 })
    materials.push(surface)
    const sphere = new THREE.Mesh(geometry, surface)
    sphere.castShadow = renderer.shadowMap.enabled
    sphere.receiveShadow = renderer.shadowMap.enabled
    sphere.rotation.y = planet.id === 'earth' ? 2.4 : 0.5
    if (planet.id === 'saturn') sphere.scale.y = 0.9
    if (planet.id === 'jupiter') sphere.scale.y = 0.935
    group.add(sphere)

    function render() {
      if (disposed || !visible || document.hidden || !loaded) return
      camera.far = Math.max(50, camera.position.length() + 10)
      camera.updateProjectionMatrix()
      if (!decorative) {
        const distance = camera.position.length()
        setZoomBounds((current) => {
          const near = distance <= controls.minDistance + 0.001
          const far = distance >= controls.maxDistance - 0.001
          return current.near === near && current.far === far ? current : { near, far }
        })
      }
      renderer.render(scene, camera)
    }
    function invalidate() {
      if (!frame && !disposed) frame = requestAnimationFrame(() => { frame = 0; render() })
    }
    function resize() {
      if (disposed) return
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return
      const oldAspect = camera.aspect
      camera.aspect = width / height
      renderer.setSize(width, height)
      // Fit the complete subject at every rotation, including the ring edges.
      const radius = planet.id === 'saturn' ? 2.36 : 1.12
      const verticalAngle = THREE.MathUtils.degToRad(18)
      const fitAngle = Math.min(verticalAngle, Math.atan(Math.tan(verticalAngle) * camera.aspect))
      const defaultDistance = radius / Math.sin(fitAngle) * (decorative ? 1.05 : 1.25)
      // Two gentle enlargement steps, shared by all zoom inputs.
      const globeRadius = planet.id === 'saturn' ? 2.32 : planet.id === 'earth' ? 1.008 : 1
      controls.minDistance = Math.sqrt(globeRadius ** 2 + (defaultDistance ** 2 - globeRadius ** 2) / MAX_ZOOM ** 2)
      controls.maxDistance = defaultDistance
      if (!loaded || Math.abs(oldAspect - camera.aspect) > 0.02) {
        camera.position.set(0, 0.24, 1).setLength(defaultDistance)
        controls.update()
        controls.saveState()
      }
      invalidate()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; invalidate() })
    intersection.observe(container)
    controls.addEventListener('change', invalidate)
    document.addEventListener('visibilitychange', invalidate)
    window.addEventListener('resize', resize)

    const loader = new THREE.TextureLoader()
    const loadTexture = (url) => new Promise((resolve, reject) => {
      loader.load(url, (texture) => {
        if (disposed) { texture.dispose(); resolve(null); return }
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
        textures.push(texture)
        resolve(texture)
      }, undefined, reject)
    })
    async function prepare() {
      try {
        const map = await loadTexture(planetTexture(planet.id))
        if (disposed) return
        surface.map = map
        surface.needsUpdate = true
        if (planet.id === 'saturn') {
          const ringMap = await loadTexture('/textures/planets/saturn-ring.png')
          if (disposed) return
          const ringGeometry = new THREE.RingGeometry(1.23, 2.32, 192, 8)
          const positions = ringGeometry.attributes.position
          const uv = ringGeometry.attributes.uv
          for (let i = 0; i < positions.count; i++) {
            const radius = Math.hypot(positions.getX(i), positions.getY(i))
            uv.setXY(i, (radius - 1.23) / (2.32 - 1.23), 0.5)
          }
          geometries.push(ringGeometry)
          const ringMaterial = new THREE.MeshStandardMaterial({ map: ringMap, side: THREE.DoubleSide, transparent: true, alphaTest: 0.03, roughness: 1, depthWrite: false })
          materials.push(ringMaterial)
          const rings = new THREE.Mesh(ringGeometry, ringMaterial)
          rings.castShadow = renderer.shadowMap.enabled
          rings.receiveShadow = renderer.shadowMap.enabled
          rings.rotation.x = -Math.PI / 2
          group.add(rings)
        }
        if (planet.id === 'earth') {
          const clouds = await loadTexture('/textures/planets/earth-clouds.jpg')
          if (disposed) return
          const cloudMaterial = new THREE.MeshStandardMaterial({ alphaMap: clouds, transparent: true, opacity: 0.65, depthWrite: false, roughness: 1 })
          materials.push(cloudMaterial)
          const cloudSphere = new THREE.Mesh(geometry, cloudMaterial)
          cloudSphere.scale.setScalar(1.008)
          cloudSphere.rotation.y = sphere.rotation.y
          group.add(cloudSphere)
        }
        resize()
        loaded = true
        setStatus('ready')
        invalidate()
      } catch {
        if (!disposed) setStatus('error')
      }
    }

    function zoom(factor) {
      const distance = THREE.MathUtils.clamp(camera.position.length() * factor, controls.minDistance, controls.maxDistance)
      camera.position.setLength(distance)
      controls.update()
      invalidate()
    }
    function zoomStep(direction) {
      const radius = planet.id === 'saturn' ? 2.32 : planet.id === 'earth' ? 1.008 : 1
      const distance = camera.position.length()
      const base = controls.maxDistance ** 2 - radius ** 2
      const magnification = Math.sqrt(base / (distance ** 2 - radius ** 2))
      const target = direction > 0
        ? (magnification < ZOOM_STEP - 0.001 ? ZOOM_STEP : MAX_ZOOM)
        : (magnification > ZOOM_STEP + 0.001 ? ZOOM_STEP : 1)
      zoom(Math.sqrt(radius ** 2 + base / target ** 2) / distance)
    }
    function rotate(horizontal, vertical) {
      const position = new THREE.Spherical().setFromVector3(camera.position)
      position.theta += horizontal
      position.phi = THREE.MathUtils.clamp(position.phi + vertical, 0.08, Math.PI - 0.08)
      camera.position.setFromSpherical(position)
      controls.update()
      invalidate()
    }
    function keydown(event) {
      const keyActions = {
        ArrowLeft: () => rotate(-0.12, 0), ArrowRight: () => rotate(0.12, 0),
        ArrowUp: () => rotate(0, -0.12), ArrowDown: () => rotate(0, 0.12),
        '+': () => zoomStep(1), '=': () => zoomStep(1), '-': () => zoomStep(-1),
        r: () => controls.reset(), R: () => controls.reset(),
      }
      if (keyActions[event.key]) { event.preventDefault(); keyActions[event.key]() }
    }
    function contextLost(event) { event.preventDefault(); if (!disposed) setStatus('lost') }
    container.addEventListener('keydown', keydown)
    canvas.addEventListener('webglcontextlost', contextLost)
    actions.current = { reset: () => controls.reset(), zoomStep }
    resize()
    prepare()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', invalidate)
      window.removeEventListener('resize', resize)
      container.removeEventListener('keydown', keydown)
      canvas.removeEventListener('webglcontextlost', contextLost)
      controls.dispose()
      textures.forEach((texture) => texture.dispose())
      materials.forEach((material) => material.dispose())
      geometries.forEach((item) => item.dispose())
      renderer.dispose()
      sunlight.shadow.map?.dispose()
      renderer.forceContextLoss()
      canvas.remove()
      actions.current = null
    }
  }, [planet, decorative])

  return (
    <div className="planet-viewer">
      <div ref={host} className={`planet-stage${decorative ? ' planet-stage-decorative' : ''}`} aria-busy={status === 'loading'} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : `Interactive 3D ${planet.name}. Arrow keys rotate; plus and minus zoom; R resets.`} aria-hidden={decorative || undefined} tabIndex={decorative ? undefined : 0} />
      {!decorative && status !== 'ready' && <div className="planet-stage-feedback" role="status">
        {status === 'loading' ? <><span className="planet-loading-orbit" aria-hidden="true" /><p>Preparing {planet.name}…</p></> : <>
          <p>{status === 'unsupported' ? 'The 3D view needs a browser with WebGL support.' : 'The planet view could not load.'}</p>
          <p className="planet-error-help">You can still explore the story and facts.</p>
          {status !== 'unsupported' && <button className="planet-text-button" onClick={onRetry}>Try again <RotateCcw size={15} aria-hidden="true" /></button>}
        </>}
      </div>}
      {!decorative && <div className="planet-view-controls">
        <p className="planet-drag-hint">Drag to rotate <span>·</span> Scroll or pinch to zoom</p>
        <div className="planet-control-buttons">
          <button disabled={status !== 'ready' || zoomBounds.far} onClick={() => actions.current?.zoomStep(-1)} aria-label="Zoom out"><Minus size={17} /></button>
          <button disabled={status !== 'ready' || zoomBounds.near} onClick={() => actions.current?.zoomStep(1)} aria-label="Zoom in"><Plus size={17} /></button>
          <button disabled={status !== 'ready'} onClick={() => actions.current?.reset()} aria-label="Reset planet view"><RotateCcw size={17} /></button>
        </div>
      </div>}
    </div>
  )
}
