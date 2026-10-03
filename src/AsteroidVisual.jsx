import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function AsteroidVisual() {
  const host = useRef(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    const container = host.current
    let renderer
    try { renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true }) }
    catch { const timer = setTimeout(() => setError(true), 0); return () => clearTimeout(timer) }
    let disposed = false
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35,1,.1,20)
    camera.position.set(0,0,4.6)
    const geometry = new THREE.IcosahedronGeometry(1,4)
    const positions = geometry.attributes.position
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i)
      const scale = 1 + .12 * Math.sin(x * 7 + y * 4) * Math.cos(z * 6)
      positions.setXYZ(i,x * scale * 1.1,y * scale * .88,z * scale)
    }
    geometry.computeVertexNormals()
    const material = new THREE.MeshStandardMaterial({ color:'#a39b92', roughness:1 })
    const rock = new THREE.Mesh(geometry,material)
    rock.rotation.set(.3,.6,-.2)
    scene.add(rock)
    scene.add(new THREE.AmbientLight('#a5abc9',.6))
    const light = new THREE.DirectionalLight('#f3f0e9',3)
    light.position.set(-3,4,4)
    scene.add(light)
    const texture = new THREE.TextureLoader().load('/textures/moon-surface.jpg',(loaded)=> {
      if(disposed) { loaded.dispose(); return }
      material.map = loaded; material.needsUpdate = true; render()
    })
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1,2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.setAttribute('aria-hidden','true')
    container.appendChild(renderer.domElement)
    function render() {
      if (disposed) return
      const width = container.clientWidth, height = container.clientHeight
      if(!width || !height) return
      camera.aspect = width / height; camera.updateProjectionMatrix()
      renderer.setSize(width,height); renderer.render(scene,camera)
    }
    const observer = new ResizeObserver(render)
    observer.observe(container)
    render()
    return () => { disposed = true; observer.disconnect(); texture.dispose(); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove() }
  },[])
  return <div ref={host} className="asteroid-visual" aria-hidden="true">{error && <p className="discovery-note">Size and distance are shown below.</p>}</div>
}
