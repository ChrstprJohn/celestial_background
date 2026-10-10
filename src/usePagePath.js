import { useEffect, useState } from 'react'

const pagePath = () => window.location.pathname.replace(/\/$/, '') || '/'

// Keep the shared shell and already-loaded modules when following a local card.
// Downloads, external links, modifier clicks, and same-page anchors stay native.
export default function usePagePath(routes) {
  const [pathname, setPathname] = useState(pagePath)
  useEffect(() => {
    function changed() { setPathname(pagePath()) }
    function navigate(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target.closest?.('a[href]')
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
      const url = new URL(link.href, window.location.href)
      const path = url.pathname.replace(/\/$/, '') || '/'
      if (url.origin !== window.location.origin || path === pagePath() || !routes.has(path)) return
      event.preventDefault()
      window.history.pushState(null, '', url)
      setPathname(path)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
    window.addEventListener('popstate', changed)
    document.addEventListener('click', navigate)
    return () => {
      window.removeEventListener('popstate', changed)
      document.removeEventListener('click', navigate)
    }
  }, [routes])
  return pathname
}
