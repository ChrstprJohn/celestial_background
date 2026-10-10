import { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    const compact = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    let seed = 137
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
    const stars = Array.from({ length: 300 }, () => ({ x: random() * 1.6 - .8, y: random() * 1.6 - .8, radius: .35 + random() * 1.2, depth: .3 + random() * .7 }))
    let width = 0
    let height = 0

    function paint() {
      context.clearRect(0, 0, width, height)
      for (const star of stars.slice(0, compact.matches ? 180 : 300)) {
        const x = width * (.5 + star.x)
        const y = height * (.5 + star.y)
        const alpha = .25 + star.depth * .45
        context.fillStyle = `rgba(219, 224, 255, ${alpha})`
        context.beginPath()
        context.arc(x, y, star.radius, 0, Math.PI * 2)
        context.fill()
      }
    }

    function resize() {
      const nextWidth = window.innerWidth
      // Mobile browser chrome changes innerHeight during a swipe. Keep the
      // background stable instead of reallocating its bitmap on every change.
      const nextHeight = compact.matches ? window.screen.height : window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, compact.matches ? 1 : 1.5)
      if (width === nextWidth && height === nextHeight && canvas.width === Math.round(width * ratio)) return
      width = nextWidth
      height = nextHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      paint()
    }

    resize()
    window.addEventListener('resize', resize)
    compact.addEventListener('change', resize)
    return () => {
      window.removeEventListener('resize', resize)
      compact.removeEventListener('change', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}
