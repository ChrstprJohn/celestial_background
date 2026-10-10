import { worldPixels } from './world-builder.js'

self.onmessage = ({ data: { appearance, width } }) => {
  const pixels = worldPixels(appearance, width, width / 2)
  self.postMessage(pixels, [pixels.data.buffer])
}
