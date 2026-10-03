import { useEffect, useRef } from 'react'
import './scroll-reveal.css'

export default function useScrollReveal() {
  const root = useRef(null)

  useEffect(() => {
    const host = root.current
    const targets = [...host.querySelectorAll('[data-scroll-reveal]')]
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const video = host.querySelector('.showcase-video-wrap')
    let observer
    let videoObserver

    function setup() {
      observer?.disconnect()
      videoObserver?.disconnect()
      targets.forEach((target) => target.classList.remove('is-revealing'))
      video?.classList.remove('is-reveal-ready')
      if (motion.matches) return
      observer = new IntersectionObserver((entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting)
        const cards = entering.filter(({ target }) => target.classList.contains('service-card'))
        entering.forEach(({ target }) => {
          const cardIndex = cards.findIndex((entry) => entry.target === target)
          target.style.setProperty('--reveal-delay', `${cardIndex < 0 ? 0 : Math.min(cardIndex, 4) * 160}ms`)
          target.classList.add('is-revealing', 'has-revealed')
          observer.unobserve(target)
        })
      }, { rootMargin: '0px 0px 32px 0px', threshold: .08 })
      targets.filter((target) => target !== video && !target.classList.contains('has-revealed')).forEach((target) => observer.observe(target))
      if (video) {
        video.classList.add('is-reveal-ready')
        videoObserver = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) {
            video.classList.remove('is-revealing', 'has-revealed')
          } else if (entry.intersectionRatio >= .25 && !video.classList.contains('has-revealed')) {
            video.classList.add('is-revealing', 'has-revealed')
          }
        }, { rootMargin: '0px 0px -48px 0px', threshold: [0, .25] })
        videoObserver.observe(video)
      }
    }

    // Keyboard navigation never waits for a decorative reveal.
    function revealFocused(event) {
      const target = event.target.closest('[data-scroll-reveal]')
      if (!target) return
      target.classList.remove('is-revealing')
      target.classList.add('has-revealed')
      observer?.unobserve(target)
      if (target === video) videoObserver?.unobserve(target)
    }

    setup()
    motion.addEventListener('change', setup)
    host.addEventListener('focusin', revealFocused)
    return () => {
      observer?.disconnect()
      videoObserver?.disconnect()
      motion.removeEventListener('change', setup)
      host.removeEventListener('focusin', revealFocused)
      targets.forEach((target) => {
        target.classList.remove('is-revealing', 'has-revealed', 'is-reveal-ready')
        target.style.removeProperty('--reveal-delay')
      })
    }
  }, [])

  return root
}
