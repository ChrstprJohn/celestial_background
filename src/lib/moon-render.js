let texturePromise
const projections = new Map()

export function loadMoonTexture() {
  if (!texturePromise) {
    texturePromise = new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = image.naturalWidth
          canvas.height = image.naturalHeight
          const context = canvas.getContext('2d', { willReadFrequently: true })
          if (!context) throw new Error('Canvas is unavailable.')
          context.drawImage(image, 0, 0)
          resolve(context.getImageData(0, 0, canvas.width, canvas.height))
        } catch (error) { reject(error) }
      }
      image.onerror = () => reject(new Error('The Moon surface could not load.'))
      image.src = '/textures/moon-surface.jpg'
    }).catch((error) => {
      texturePromise = undefined
      throw error
    })
  }
  return texturePromise
}

// Reuse the sphere's geometry: only sunlight changes when a date changes.
function projection(size, texture) {
  const key = `${size}:${texture.width}:${texture.height}`
  if (projections.has(key)) return projections.get(key)
  const radius = size * .46
  const samples = new Float32Array(size * size * 5)
  let count = 0
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x + .5 - size / 2) / radius
      const ny = (size / 2 - y - .5) / radius
      const r2 = nx * nx + ny * ny
      if (r2 >= 1) continue
      const nz = Math.sqrt(1 - r2)
      const u = .5 + Math.atan2(nx, nz) / (2 * Math.PI)
      const v = .5 - Math.asin(ny) / Math.PI
      const tx = Math.min(texture.width - 1, Math.floor(u * texture.width))
      const ty = Math.min(texture.height - 1, Math.floor(v * texture.height))
      samples[count++] = (y * size + x) * 4
      samples[count++] = (ty * texture.width + tx) * 4
      samples[count++] = nx
      samples[count++] = nz
      samples[count++] = Math.min(255, (1 - Math.sqrt(r2)) * radius * 255)
    }
  }
  const geometry = samples.subarray(0, count)
  if (projections.size >= 3) projections.delete(projections.keys().next().value)
  projections.set(key, geometry)
  return geometry
}

export function drawMoon(canvas, texture, fraction, waxing) {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable.')
  const size = canvas.width
  const frame = context.createImageData(size, size)
  const geometry = projection(size, texture)
  // Match the illuminated disc area to the computed illumination fraction.
  const sz = 2 * Math.max(0, Math.min(1, fraction)) - 1
  const sx = (waxing ? 1 : -1) * Math.sqrt(1 - sz * sz)
  for (let i = 0; i < geometry.length; i += 5) {
    const pixel = geometry[i]
    const source = geometry[i + 1]
    const sunlight = Math.max(0, geometry[i + 2] * sx + geometry[i + 3] * sz)
    const brightness = .025 + .975 * Math.pow(sunlight, .42)
    for (let channel = 0; channel < 3; channel++) frame.data[pixel + channel] = Math.min(255, texture.data[source + channel] * brightness * 1.1)
    frame.data[pixel + 3] = geometry[i + 4]
  }
  context.putImageData(frame, 0, 0)
}
