import { addPngMetadata } from './png-metadata.js'

export async function saveCanvasPng(canvas, filename, metadata = {}) {
  let blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('Image export failed.')
  if (Object.keys(metadata).length) blob = new Blob([addPngMetadata(new Uint8Array(await blob.arrayBuffer()), metadata)], { type: 'image/png' })
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  try {
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    return downloadUrl
  } catch (error) {
    URL.revokeObjectURL(downloadUrl)
    throw error
  } finally {
    link.remove()
  }
}

export async function saveSvgPng(element, filename) {
  if (!element) throw new Error('The artwork is not ready.')
  const copy = element.cloneNode(true)
  copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const exportBox = element.dataset.exportViewBox
  if (exportBox) copy.setAttribute('viewBox', exportBox)
  const box = copy.viewBox.baseVal
  copy.setAttribute('width', box.width)
  copy.setAttribute('height', box.height)
  const source = new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml;charset=utf-8' })
  const sourceUrl = URL.createObjectURL(source)
  let downloadUrl
  try {
    const image = new Image()
    image.src = sourceUrl
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(box.width * 2)
    canvas.height = Math.round(box.height * 2)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Image export is unavailable.')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    downloadUrl = await saveCanvasPng(canvas, filename)
    return downloadUrl
  } catch (error) {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    throw error
  } finally {
    URL.revokeObjectURL(sourceUrl)
  }
}
