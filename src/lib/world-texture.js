import { makeWorldTexture } from './world-builder.js'

const surfaces = new Map()

// Terrain generation is CPU-heavy. Run it away from scrolling and input work.
export function makeWorldTextureAsync(appearance, width = 768) {
  const key = JSON.stringify([appearance.terrain, appearance.palette, appearance.seed, appearance.oceanLevel, appearance.detail, appearance.iceCaps, appearance.colors, width])
  if (surfaces.has(key)) return surfaces.get(key)
  const pending = new Promise((resolve) => {
    let worker
    function fallback() { worker?.terminate(); resolve(makeWorldTexture(appearance)) }
    try {
      worker = new Worker(new URL('./world-texture.worker.js', import.meta.url), { type: 'module' })
      worker.onmessage = ({ data: pixels }) => {
        worker.terminate()
        const canvas = document.createElement('canvas')
        canvas.width = pixels.width
        canvas.height = pixels.height
        canvas.getContext('2d').putImageData(new ImageData(pixels.data, pixels.width, pixels.height), 0, 0)
        resolve(canvas)
      }
      worker.onerror = fallback
      worker.postMessage({ appearance, width })
    } catch { fallback() }
  })
  if (surfaces.size >= 4) surfaces.delete(surfaces.keys().next().value)
  surfaces.set(key, pending)
  return pending
}
