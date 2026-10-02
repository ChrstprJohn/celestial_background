import { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let seed = 137
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
    const stars = Array.from({ length: 440 }, () => ({ x: random() * 1.6 - .8, y: random() * 1.6 - .8, radius: .35 + random() * 1.2, depth: .3 + random() * .7, phase: random() * Math.PI * 2 }))
    let width = 0
    let height = 0
    let frame
    let time = 0
    let lastTime = 0

    function paint() {
      context.clearRect(0, 0, width, height)
      const progress = Math.min(window.scrollY / Math.max(height, 1), 1)
      for (const star of stars) {
        const scale = 1 - (motion.matches ? 0 : progress * .16 * star.depth)
        const drift = motion.matches ? 0 : time * .0015 * star.depth
        const x = width * (.5 + star.x * scale) + Math.sin(star.phase + drift) * 5
        const y = height * (.5 + star.y * scale) - (motion.matches ? 0 : progress * 65 * star.depth)
        const alpha = .25 + star.depth * .45 + (motion.matches ? 0 : Math.sin(star.phase + time * .00035) * .12)
        context.fillStyle = `rgba(219, 224, 255, ${alpha})`
        context.beginPath()
        context.arc(x, y, star.radius, 0, Math.PI * 2)
        context.fill()
      }
    }

    function tick(timestamp) {
      if (lastTime) time += Math.min(timestamp - lastTime, 50)
      lastTime = timestamp
      paint()
      frame = requestAnimationFrame(tick)
    }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      paint()
    }

    function updateMotion() {
      cancelAnimationFrame(frame)
      lastTime = 0
      paint()
      if (!motion.matches && !document.hidden) frame = requestAnimationFrame(tick)
    }

    resize()
    updateMotion()
    window.addEventListener('resize', resize)
    motion.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateMotion)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      motion.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateMotion)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}
