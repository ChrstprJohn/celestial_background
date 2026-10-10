import { useEffect, useRef, useState } from 'react'
import { Hand, Minus, Plus, RotateCcw } from 'lucide-react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { planetTexture } from './lib/planets.js'
import { cropPlanetImage } from './lib/planet-export.js'
import { makeWorldTexture } from './lib/world-builder.js'

const ZOOM_STEP = 1.1
const MAX_ZOOM = 1.2
// Reuse decoded bundled images across planet changes; GPU textures still dispose.
THREE.Cache.enabled = true

export default function PlanetScene({ planet, decorative = false, hoverPreview = true, showFeedback = false, onRetry, captureRef, onCaptureReady, appearance }) {
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
    const previewCard = decorative && hoverPreview ? container.closest('.service-card') : null
    const previewMotion = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let previewBounds
    let previewHover = false
    const previewTarget = { x: 0, y: 0 }
    let previewElapsed = 0
    let previewLast = 0
    let previewVariant = -1
    let defaultPreviewMap
    let previewRings
    let previewClouds
    const variantMaps = []
    const builderVariants = appearance && previewCard ? [
      { ...appearance, terrain: 'rocky', palette: 'ember', rings: false, clouds: false, seed: 19, tilt: 12 },
      { ...appearance, terrain: 'gas', palette: 'violet', rings: true, clouds: false, seed: 31, tilt: 32 },
      { ...appearance, terrain: 'ocean', palette: 'dune', rings: false, clouds: true, seed: 47, oceanLevel: 70, tilt: 18 },
    ] : []
    const hasRings = appearance ? appearance.rings : planet.id === 'saturn'
    const hasClouds = appearance ? appearance.clouds : planet.id === 'earth'
    const textures = []
    const materials = []
    const geometries = []
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    renderer.shadowMap.enabled = hasRings && !decorative
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
    group.rotation.z = THREE.MathUtils.degToRad(appearance?.tilt ?? planet.tilt)
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
    const initialSphereRotation = sphere.rotation.y
    if (hasRings) sphere.scale.y = 0.9
    if (planet.id === 'jupiter') sphere.scale.y = 0.935
    group.add(sphere)

    function changePreviewDesign(index) {
      if (!builderVariants.length || !loaded || previewVariant === index) return
      const variant = index < 0 ? appearance : builderVariants[index]
      if (index >= 0 && !variantMaps[index]) {
        const texture = new THREE.CanvasTexture(makeWorldTexture(variant))
        texture.colorSpace = THREE.SRGBColorSpace
        textures.push(texture)
        variantMaps[index] = texture
      }
      surface.map = index < 0 ? defaultPreviewMap : variantMaps[index]
      surface.needsUpdate = true
      if (previewRings) previewRings.visible = variant.rings
      if (previewClouds) previewClouds.visible = variant.clouds
      group.rotation.z = THREE.MathUtils.degToRad(variant.tilt)
      previewVariant = index
    }

    function render(time = performance.now()) {
      if (disposed || !visible || document.hidden || !loaded) return
      let previewSettling = false
      if (previewCard) {
        const blend = previewHover ? .15 : .12
        group.rotation.x += (previewTarget.x - group.rotation.x) * blend
        group.rotation.y += (previewTarget.y - group.rotation.y) * blend
        if (previewHover) sphere.rotation.y += .005
        else {
          const difference = THREE.MathUtils.euclideanModulo(initialSphereRotation - sphere.rotation.y + Math.PI, Math.PI * 2) - Math.PI
          sphere.rotation.y += difference * .12
          previewSettling = Math.abs(difference) > .001
        }
        if (previewHover && builderVariants.length) {
          previewElapsed += previewLast ? Math.min((time - previewLast) / 1000, .05) : 0
          previewLast = time
          if (previewElapsed >= 1.5) changePreviewDesign(Math.floor((previewElapsed - 1.5) / 2.2) % builderVariants.length)
        }
      }
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
      if (previewCard && (previewHover || previewSettling || Math.abs(group.rotation.x - previewTarget.x) > .001 || Math.abs(group.rotation.y - previewTarget.y) > .001)) invalidate()
    }
    function invalidate() {
      if (!frame && !disposed) frame = requestAnimationFrame((time) => { frame = 0; render(time) })
    }
    function previewEnter() {
      if (!previewMotion.matches) return
      previewBounds = previewCard.getBoundingClientRect()
      previewHover = true
      previewElapsed = 0
      previewLast = 0
      invalidate()
    }
    function previewMove(event) {
      if (!previewHover || !previewBounds || event.pointerType !== 'mouse') return
      previewTarget.y = THREE.MathUtils.clamp((event.clientX - previewBounds.left) / previewBounds.width * 2 - 1, -1, 1) * .45
      previewTarget.x = THREE.MathUtils.clamp((event.clientY - previewBounds.top) / previewBounds.height * 2 - 1, -1, 1) * .2
      invalidate()
    }
    function previewLeave() {
      previewHover = false
      previewTarget.x = 0
      previewTarget.y = 0
      previewElapsed = 0
      previewLast = 0
      changePreviewDesign(-1)
      if (!previewMotion.matches) { group.rotation.x = 0; group.rotation.y = 0; sphere.rotation.y = initialSphereRotation }
      invalidate()
    }
    previewCard?.addEventListener('pointerenter', previewEnter)
    previewCard?.addEventListener('pointermove', previewMove)
    previewCard?.addEventListener('pointerleave', previewLeave)
    previewMotion.addEventListener('change', previewLeave)
    function resize() {
      if (disposed) return
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return
      const oldAspect = camera.aspect
      camera.aspect = width / height
      renderer.setSize(width, height)
      // Fit the complete subject at every rotation, including the ring edges.
      const radius = hasRings ? 2.36 : 1.12
      const verticalAngle = THREE.MathUtils.degToRad(18)
      const fitAngle = Math.min(verticalAngle, Math.atan(Math.tan(verticalAngle) * camera.aspect))
      const defaultDistance = radius / Math.sin(fitAngle) * (decorative ? 1.05 : 1.25)
      // Two gentle enlargement steps, shared by all zoom inputs.
      const globeRadius = hasRings ? 2.32 : hasClouds ? 1.008 : 1
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
        const surfaceMap = appearance ? new THREE.CanvasTexture(makeWorldTexture(appearance)) : null
        if (surfaceMap) { surfaceMap.colorSpace = THREE.SRGBColorSpace; textures.push(surfaceMap) }
        const [map, ringMap, clouds] = await Promise.all([
          surfaceMap || loadTexture(planetTexture(planet.id)),
          hasRings ? loadTexture('/textures/planets/saturn-ring.png') : null,
          hasClouds ? loadTexture('/textures/planets/earth-clouds.jpg') : null,
        ])
        if (disposed) return
        surface.map = map
        defaultPreviewMap = map
        surface.needsUpdate = true
        if (hasRings) {
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
          previewRings = rings
          group.add(rings)
        }
        if (hasClouds) {
          const cloudMaterial = new THREE.MeshStandardMaterial({ alphaMap: clouds, transparent: true, opacity: (appearance?.cloudOpacity ?? 65) / 100, depthWrite: false, roughness: 1 })
          materials.push(cloudMaterial)
          const cloudSphere = new THREE.Mesh(geometry, cloudMaterial)
          cloudSphere.scale.setScalar(1.008)
          cloudSphere.rotation.y = sphere.rotation.y
          previewClouds = cloudSphere
          group.add(cloudSphere)
        }
        resize()
        loaded = true
        if (captureRef) captureRef.current = {
          planetId: planet.id,
          appearance,
          capture() {
            if (disposed || !loaded || renderer.getContext().isContextLost()) throw new Error('The planet view is not ready.')
            // Copy immediately after a fresh render; WebGL clears its buffer after presentation.
            // This also supports downloading when the planet has scrolled out of view.
            renderer.render(scene, camera)
            const image = document.createElement('canvas')
            image.width = canvas.width
            image.height = canvas.height
            const context = image.getContext('2d')
            if (!context) throw new Error('Image export is unavailable.')
            context.drawImage(canvas, 0, 0)
            return cropPlanetImage(image)
          },
        }
        onCaptureReady?.(planet.id)
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
      const radius = hasRings ? 2.32 : hasClouds ? 1.008 : 1
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
    function contextLost(event) {
      event.preventDefault()
      if (!disposed) {
        if (captureRef) captureRef.current = null
        onCaptureReady?.('')
        setStatus('lost')
      }
    }
    container.addEventListener('keydown', keydown)
    canvas.addEventListener('webglcontextlost', contextLost)
    actions.current = { reset: () => controls.reset(), zoomStep }
    resize()
    prepare()

    return () => {
      disposed = true
      if (captureRef) captureRef.current = null
      onCaptureReady?.('')
      cancelAnimationFrame(frame)
      observer.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', invalidate)
      window.removeEventListener('resize', resize)
      previewCard?.removeEventListener('pointerenter', previewEnter)
      previewCard?.removeEventListener('pointermove', previewMove)
      previewCard?.removeEventListener('pointerleave', previewLeave)
      previewMotion.removeEventListener('change', previewLeave)
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
  }, [planet, decorative, hoverPreview, captureRef, onCaptureReady, appearance])

  return (
    <div className="planet-viewer">
      {!decorative && <p className="planet-rotation-hint"><Hand size={18} aria-hidden="true" />Drag or swipe the planet to rotate</p>}
      <div ref={host} className={`planet-stage${decorative ? ' planet-stage-decorative' : ''}`} aria-busy={status === 'loading'} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : `Interactive 3D ${planet.name}. Arrow keys rotate; plus and minus zoom; R resets.`} aria-hidden={decorative || undefined} tabIndex={decorative ? undefined : 0} />
      {(!decorative || showFeedback) && status !== 'ready' && <div className="planet-stage-feedback" role="status">
        {status === 'loading' ? <><span className="planet-loading-orbit" aria-hidden="true" /><p>Preparing {planet.name}…</p></> : <>
          <p>{status === 'unsupported' ? 'The 3D view needs a browser with WebGL support.' : 'The planet view could not load.'}</p>
          <p className="planet-error-help">You can still explore the story and facts.</p>
          {status !== 'unsupported' && <button className="planet-text-button" onClick={onRetry}>Try again <RotateCcw size={15} aria-hidden="true" /></button>}
        </>}
      </div>}
      {!decorative && <div className="planet-view-controls">
        <p className="planet-drag-hint">Scroll or pinch to zoom</p>
        <div className="planet-control-buttons">
          <button disabled={status !== 'ready' || zoomBounds.far} onClick={() => actions.current?.zoomStep(-1)} aria-label="Zoom out"><Minus size={17} /></button>
          <button disabled={status !== 'ready' || zoomBounds.near} onClick={() => actions.current?.zoomStep(1)} aria-label="Zoom in"><Plus size={17} /></button>
          <button disabled={status !== 'ready'} onClick={() => actions.current?.reset()} aria-label="Reset planet view"><RotateCcw size={17} /></button>
        </div>
      </div>}
    </div>
  )
}
