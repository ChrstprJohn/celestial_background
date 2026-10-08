// Export the fixed default face, regardless of the current cursor direction.
// The generated character PNG remains untouched; pupils match the site's CSS.
export async function defaultPetImage(image, pet) {
  // Display previews are smaller; download the untouched source at full resolution.
  const original = new Image()
  original.src = pet.image
  await original.decode()
  image = original
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Image export is unavailable.')
  context.drawImage(image, 0, 0)
  for (const eye of pet.eyes) {
    const width = eye.width / 100 * canvas.width
    const height = eye.height / 100 * canvas.height
    const x = eye.x / 100 * canvas.width
    const y = eye.y / 100 * canvas.height
    const rx = width * .55 / 2
    const ry = height * .55 / 2
    context.save()
    context.translate(x, y)
    context.scale(rx, ry)
    const gradient = context.createRadialGradient(-.3, -.5, 0, -.3, -.5, 1.5)
    gradient.addColorStop(0, '#3d2d72')
    gradient.addColorStop(.7, '#151338')
    context.fillStyle = gradient
    context.beginPath()
    context.arc(0, 0, 1, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = 'rgba(255, 248, 238, .92)'
    context.beginPath()
    context.ellipse(-.34, -.49, .2, .17, 0, 0, Math.PI * 2)
    context.fill()
    context.restore()
  }
  return new Promise((resolve, reject) => canvas.toBlob(blob => {
    if (blob) resolve(blob)
    else reject(new Error('Could not create the image.'))
  }, 'image/png'))
}
