// PNG tEXt chunks keep source/license information in the file without printing a footer.
export function addPngMetadata(bytes, metadata) {
  if (!Object.keys(metadata).length) return bytes
  if (bytes[0] !== 137 || bytes[1] !== 80 || bytes[2] !== 78 || bytes[3] !== 71) throw new Error('Expected a PNG image.')
  const encoder = new TextEncoder()
  const chunks = Object.entries(metadata).map(([key, value]) => {
    const payload = encoder.encode(`${key}\0${value}`)
    const chunk = new Uint8Array(payload.length + 12)
    const view = new DataView(chunk.buffer)
    view.setUint32(0, payload.length)
    chunk.set(encoder.encode('tEXt'), 4)
    chunk.set(payload, 8)
    let crc = 0xffffffff
    for (const byte of chunk.subarray(4, chunk.length - 4)) {
      crc ^= byte
      for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? 0xedb88320 ^ crc >>> 1 : crc >>> 1
    }
    view.setUint32(chunk.length - 4, (crc ^ 0xffffffff) >>> 0)
    return chunk
  })
  const end = bytes.length - 12
  const output = new Uint8Array(bytes.length + chunks.reduce((total, chunk) => total + chunk.length, 0))
  output.set(bytes.subarray(0, end))
  let offset = end
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.length }
  output.set(bytes.subarray(end), offset)
  return output
}
