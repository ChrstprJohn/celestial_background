export function visiblePlanetBounds({ data, width, height }) {
  let left = width, top = height, right = -1, bottom = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!data[(y * width + x) * 4 + 3]) continue
      left = Math.min(left, x)
      top = Math.min(top, y)
      right = Math.max(right, x)
      bottom = Math.max(bottom, y)
    }
  }
  return right < 0 ? null : { x: left, y: top, width: right - left + 1, height: bottom - top + 1 }
}

export function cropPlanetImage(canvas) {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Image export is unavailable.')
  const bounds = visiblePlanetBounds(context.getImageData(0, 0, canvas.width, canvas.height))
  if (!bounds) throw new Error('The planet image could not be captured.')
  const image = document.createElement('canvas')
  image.width = bounds.width
  image.height = bounds.height
  const output = image.getContext('2d')
  if (!output) throw new Error('Image export is unavailable.')
  output.drawImage(canvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height)
  return image
}
