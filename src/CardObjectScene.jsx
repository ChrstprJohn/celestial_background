import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { PLANETS, planetTexture } from './lib/planets.js'

// Preview objects are illustrative; the discovery pages retain their real data.
export default function CardObjectScene({ type, onReady }) {
  const host = useRef(null)
  useEffect(() => {
    const container = host.current
    const card = container.closest('.service-card')
    onReady(false)
    let renderer
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }) } catch { return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 50)
    const object = new THREE.Group()
    scene.add(object)
    const ambient = new THREE.AmbientLight(0xc9c1f0, type.startsWith('moon') ? .08 : 1.3)
    scene.add(ambient)
    const light = new THREE.DirectionalLight(0xfff1dd, 3)
    light.position.set(-3, 4, 5)
    scene.add(light)
    const resources = []
    let disposed = false
    let loaded = false
    let visible = true
    let hovering = card.matches(':hover')
    let frame = 0
    let last = 0
    let spin = 0
    let bounds = hovering ? card.getBoundingClientRect() : null
    let fallTime = 0
    const fallingBodies = []
    let orbitTime = 0
    const orbitingPlanets = []
    const target = { x: 0, y: 0 }
    const baseTilt = type === 'galaxy' ? 1.02 : type === 'planets' ? .9 : type === 'age' ? .48 : 0
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const canHover = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)')

    function sphere(radius, color, x = 0, y = 0, z = 0, map) {
      const geometry = new THREE.SphereGeometry(radius, 48, 32)
      const material = new THREE.MeshStandardMaterial({ color, map, roughness: .72, metalness: .05 })
      resources.push(geometry, material)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, z)
      object.add(mesh)
      return mesh
    }
    function orbit(radius) {
      const points = Array.from({ length: 100 }, (_, i) => {
        const angle = i / 100 * Math.PI * 2
        return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      })
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({ color: 0x8d84bd, transparent: true, opacity: .65 })
      resources.push(geometry, material)
      object.add(new THREE.LineLoop(geometry, material))
    }
    function render(time = 0) {
      frame = 0
      if (disposed || !loaded || !visible || document.hidden) { last = 0; return }
      const dt = last ? Math.min((time - last) / 1000, .05) : 0
      last = time
      if (hovering && !motion.matches) {
        if (type === 'gravity') {
          fallTime += dt * 1.25
          const cycle = fallTime % 4.2
          for (const { mesh, acceleration } of fallingBodies) {
            const ground = -.86
            // Equal release height; lunar acceleration is one-sixth Earth's.
            if (cycle < 2.8) mesh.position.y = Math.max(ground, .95 - .5 * acceleration * cycle ** 2)
            else if (cycle < 3.4) mesh.position.y = ground
            else mesh.position.y = ground + (.95 - ground) * (1 - (1 - (cycle - 3.4) / .8) ** 3)
          }
        } else if (type === 'planets') {
          orbitTime += dt
          for (const { body, radius, angle, speed } of orbitingPlanets) {
            const phase = angle + orbitTime * speed
            body.position.set(Math.cos(phase) * radius, 0, Math.sin(phase) * radius)
            body.rotation.y += dt * .35
          }
        } else spin += dt * .28
      }
      const blend = motion.matches ? 1 : 1 - Math.exp(-dt * (hovering ? 13 : 10))
      if (!hovering) {
        for (const { mesh } of fallingBodies) mesh.position.y += (.95 - mesh.position.y) * blend
      }
      object.rotation.y += (target.x + spin - object.rotation.y) * blend
      object.rotation.x += (target.y + baseTilt - object.rotation.x) * blend
      renderer.render(scene, camera)
      if (!motion.matches && (hovering || fallingBodies.some(({ mesh }) => Math.abs(mesh.position.y - .95) > .001) || Math.abs(target.x + spin - object.rotation.y) > .001 || Math.abs(target.y + baseTilt - object.rotation.x) > .001)) invalidate()
      else last = 0
    }
    function invalidate() { if (!frame && !disposed) frame = requestAnimationFrame(render) }
    function resize() {
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height)
      camera.aspect = width / height
      const angle = Math.min(Math.PI / 10, Math.atan(Math.tan(Math.PI / 10) * camera.aspect))
      camera.position.set(0, 0, 1).setLength((type === 'planets' ? 2.95 : type === 'galaxy' || type === 'age' ? 2.15 : 1.65) / Math.sin(angle))
      camera.updateProjectionMatrix()
      invalidate()
    }
    function enter(event) {
      if (motion.matches || !canHover.matches || event.pointerType !== 'mouse') return
      bounds = card.getBoundingClientRect()
      hovering = true
      fallTime = 0
      fallingBodies.forEach(({ mesh }) => { mesh.position.y = .95 })
      invalidate()
    }
    function move(event) {
      if (!hovering || !bounds || event.pointerType !== 'mouse') return
      if (type === 'gravity' || type === 'planets') return
      target.x = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1) * .32
      target.y = THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1) * .16
      invalidate()
    }
    function leave() {
      hovering = false
      target.x = 0
      target.y = 0
      spin = 0
      fallTime = 0
      orbitTime = 0
      for (const { body, radius, angle } of orbitingPlanets) {
        body.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
        body.rotation.y = 0
      }
      // Choose the nearest equivalent angle so a long hover doesn't unwind.
      object.rotation.y = THREE.MathUtils.euclideanModulo(object.rotation.y + Math.PI, Math.PI * 2) - Math.PI
      bounds = null
      invalidate()
    }
    function preference() { leave(); if (motion.matches) { spin = 0; object.rotation.set(baseTilt, 0, 0) }; invalidate() }

    async function prepare() {
      try {
        if (type.startsWith('moon')) {
          const texture = await new THREE.TextureLoader().loadAsync(`${import.meta.env.BASE_URL}textures/moon-surface.jpg`)
          if (disposed) { texture.dispose(); return }
          texture.colorSpace = THREE.SRGBColorSpace
          resources.push(texture)
          sphere(1.3, 0xffffff, 0, 0, 0, texture).rotation.y = Math.PI
          light.position.set(5, 1, -2)
        } else if (type === 'galaxy') {
          // A volume of stars, with real depth and spiral arms rather than a plane.
          const positions = [], colors = []
          let seed = 42
          const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
          for (let i = 0; i < 6500; i++) {
            const radius = Math.pow(random(), i < 1200 ? 2.2 : .65) * (i < 1200 ? .5 : 1.9)
            const angle = i % 3 * Math.PI * 2 / 3 + radius * 2.6 + (random() - .5) * .65
            positions.push(Math.cos(angle) * radius, (random() - .5) * (.12 + .15 * (1 - radius / 1.9)), Math.sin(angle) * radius)
            const color = new THREE.Color().lerpColors(new THREE.Color(0xffddaa), new THREE.Color(0x8baaff), radius / 1.9)
            colors.push(color.r, color.g, color.b)
          }
          const geometry = new THREE.BufferGeometry()
          geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
          const material = new THREE.PointsMaterial({ size: .024, vertexColors: true, transparent: true, opacity: .9, sizeAttenuation: true })
          resources.push(geometry, material)
          object.add(new THREE.Points(geometry, material))
        } else if (type === 'planets') {
          const sun = sphere(.27, 0xffd78c)
          sun.material.emissive.setHex(0xf5a83b)
          sun.material.emissiveIntensity = .55
          const radii = [.48, .74, 1, 1.25, 1.58, 1.92, 2.27, 2.6]
          const sizes = [.065, .095, .105, .08, .2, .17, .13, .125]
          const maps = await Promise.all(PLANETS.map((planet) => new THREE.TextureLoader().loadAsync(planetTexture(planet.id, true)).catch(() => null)))
          if (disposed) { maps.forEach((map) => map?.dispose()); return }
          PLANETS.forEach((planet, index) => {
            const map = maps[index]
            if (map) { map.colorSpace = THREE.SRGBColorSpace; resources.push(map) }
            const body = new THREE.Group()
            const mesh = sphere(sizes[index], map ? 0xffffff : planet.color, 0, 0, 0, map)
            body.add(mesh)
            object.add(body)
            const angle = index * 2.4
            body.position.set(Math.cos(angle) * radii[index], 0, Math.sin(angle) * radii[index])
            orbit(radii[index])
            orbitingPlanets.push({ body, radius: radii[index], angle, speed: .65 / (1 + index * .3) })
            if (planet.id === 'saturn') {
              const geometry = new THREE.RingGeometry(.23, .34, 48)
              const material = new THREE.MeshStandardMaterial({ color: 0xc5b58c, side: THREE.DoubleSide, transparent: true, opacity: .75 })
              resources.push(geometry, material)
              const rings = new THREE.Mesh(geometry, material)
              rings.rotation.x = -Math.PI / 2.6
              body.add(rings)
            }
          })
        } else if (type === 'age') {
          sphere(.5, 0xe2c493)
          orbit(1.1); orbit(1.85)
          sphere(.17, 0x99bacc, 1.1)
          sphere(.28, 0xd2b49a, -1.2, 0, 1.4)
        } else if (type === 'gravity') {
          fallingBodies.push(
            { mesh: sphere(.27, 0x99bacc, -.7, .95), acceleration: 5 },
            { mesh: sphere(.27, 0xc9c1f0, .7, .95), acceleration: 5 / 6 },
          )
          const geometry = new THREE.CylinderGeometry(1.45, 1.45, .1, 64)
          const material = new THREE.MeshStandardMaterial({ color: 0x3f4664, roughness: .85 })
          resources.push(geometry, material)
          const platform = new THREE.Mesh(geometry, material)
          platform.position.y = -1.18
          object.add(platform)
        }
        loaded = true
        object.rotation.x = baseTilt
        resize()
        renderer.render(scene, camera)
        onReady(true)
        invalidate()
      } catch { if (!disposed) onReady(false) }
    }
    const size = new ResizeObserver(resize)
    size.observe(container)
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; last = 0; invalidate() })
    intersection.observe(container)
    card.addEventListener('pointerenter', enter)
    card.addEventListener('pointermove', move)
    card.addEventListener('pointerleave', leave)
    motion.addEventListener('change', preference)
    document.addEventListener('visibilitychange', invalidate)
    resize()
    prepare()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      size.disconnect(); intersection.disconnect()
      card.removeEventListener('pointerenter', enter)
      card.removeEventListener('pointermove', move)
      card.removeEventListener('pointerleave', leave)
      motion.removeEventListener('change', preference)
      document.removeEventListener('visibilitychange', invalidate)
      resources.forEach((resource) => resource.dispose())
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove()
    }
  }, [type, onReady])
  return <div ref={host} className="card-object-scene" aria-hidden="true" />
}
