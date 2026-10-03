import { useEffect, useRef } from 'react'
import './preview-cursor.css'

const dustSizes = [1, 1.7, 1, 2.6, 1.7, 1]

export default function PreviewCursor() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    const available = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const root = document.documentElement
    let width = 0
    let height = 0
    let frame = 0
    let lastTime = 0
    let visible = false
    let interactive = false
    let pointer = { x: 0, y: 0 }
    let tail = []
    let dust = []
    let dustIndex = 0

    function reset() {
      cancelAnimationFrame(frame)
      frame = 0
      lastTime = 0
      visible = false
      tail = []
      dust = []
      root.classList.remove('shooting-cursor-active')
      context.clearRect(0, 0, width, height)
    }

    function resize() {
      reset()
      width = window.innerWidth
      height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    function paint(time) {
      frame = 0
      const delta = lastTime ? Math.min(time - lastTime, 32) : 16
      lastTime = time
      context.clearRect(0, 0, width, height)
      tail = tail.filter((point) => time - point.time < 220)
      dust = dust.filter((particle) => time - particle.time < particle.life)

      if (tail.length > 1) {
        const first = tail[0]
        const gradient = context.createLinearGradient(first.x, first.y, pointer.x, pointer.y)
        gradient.addColorStop(0, 'rgba(201, 193, 240, 0)')
        gradient.addColorStop(1, 'rgba(243, 240, 233, .95)')
        context.strokeStyle = gradient
        context.lineWidth = 2
        context.lineCap = 'round'
        context.beginPath()
        tail.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y))
        context.lineTo(pointer.x, pointer.y)
        context.stroke()
      }

      for (const particle of dust) {
        particle.x += particle.vx * delta / 16
        particle.y += particle.vy * delta / 16
        const age = Math.min((time - particle.time) / particle.life, 1)
        const alpha = 1 - age * age * (3 - 2 * age)
        context.fillStyle = `rgba(${particle.color}, ${alpha * .95})`
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      }

      if (visible) {
        const size = interactive ? 9 : 7
        context.save()
        context.translate(pointer.x, pointer.y)
        context.fillStyle = '#f3f0e9'
        context.beginPath()
        context.moveTo(0, -size)
        context.lineTo(2, -2)
        context.lineTo(size, 0)
        context.lineTo(2, 2)
        context.lineTo(0, size)
        context.lineTo(-2, 2)
        context.lineTo(-size, 0)
        context.lineTo(-2, -2)
        context.closePath()
        context.fill()
        context.restore()
      }
      if (tail.length || dust.length) frame = requestAnimationFrame(paint)
      else lastTime = 0
    }

    function move(event) {
      if (!available.matches || event.pointerType !== 'mouse' || document.hidden || event.target.closest('input, textarea, select, [contenteditable], iframe')) {
        reset()
        return
      }
      const now = performance.now()
      const next = { x: event.clientX, y: event.clientY }
      const dx = next.x - pointer.x
      const dy = next.y - pointer.y
      const distance = visible ? Math.hypot(dx, dy) : 0
      interactive = Boolean(event.target.closest('a, button'))
      if (distance > 3) {
        const count = Math.min(Math.ceil(distance / 5), 10)
        for (let index = 0; index < count; index++) {
          const progress = index / count
          const radius = dustSizes[dustIndex++ % dustSizes.length]
          dust.push({ x: pointer.x + dx * progress + (Math.random() - .5) * 7, y: pointer.y + dy * progress + (Math.random() - .5) * 7, vx: (Math.random() - .5) * .85, vy: .1 + Math.random() * .45, radius, color: Math.random() < .4 ? '243, 240, 233' : '201, 193, 240', time: now, life: 900 })
        }
        dust = dust.slice(-160)
      }
      pointer = next
      visible = true
      tail.push({ ...next, time: now })
      tail = tail.slice(-32)
      root.classList.add('shooting-cursor-active')
      if (!frame) frame = requestAnimationFrame(paint)
    }

    function leave(event) { if (!event.relatedTarget) reset() }
    resize()
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerout', leave)
    window.addEventListener('blur', reset)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', reset)
    available.addEventListener('change', reset)
    return () => {
      reset()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerout', leave)
      window.removeEventListener('blur', reset)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', reset)
      available.removeEventListener('change', reset)
    }
  }, [])

  return <canvas ref={canvasRef} className="preview-cursor" aria-hidden="true" />
}
