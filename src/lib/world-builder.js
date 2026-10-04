export const WORLD_PALETTES = [
  { id: 'lagoon', name: 'Lagoon', sea: '#174866', land: '#75bba3', high: '#dfebc8' },
  { id: 'violet', name: 'Violet', sea: '#30255c', land: '#a699d2', high: '#e6d9ee' },
  { id: 'ember', name: 'Ember', sea: '#532d34', land: '#cb7753', high: '#efd7ac' },
  { id: 'dune', name: 'Dune', sea: '#354953', land: '#b7a581', high: '#e8debc' },
]
export const DEFAULT_WORLD = { terrain: 'ocean', palette: 'lagoon', rings: true, clouds: true, seed: 7, oceanLevel: 54, detail: 3, iceCaps: 0, cloudOpacity: 65, tilt: 22 }
const rgb = (hex) => [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16))

// Continuous spherical fields produce fictional terrain with no longitude seam.
export function worldPixels(appearance, width = 768, height = 384) {
  const palette = WORLD_PALETTES.find((item) => item.id === appearance.palette) || WORLD_PALETTES[0]
  const color = (key) => /^#[0-9a-f]{6}$/i.test(appearance.colors?.[key] || '') ? appearance.colors[key] : palette[key]
  const sea = rgb(color('sea')), land = rgb(color('land')), high = rgb(color('high'))
  const data = new Uint8ClampedArray(width * height * 4)
  const phase = appearance.seed * .73
  for (let row = 0; row < height; row++) {
    const latitude = Math.PI * (row / (height - 1) - .5)
    for (let col = 0; col < width; col++) {
      const longitude = col / (width - 1) * Math.PI * 2
      const x = Math.cos(latitude) * Math.cos(longitude), y = Math.sin(latitude), z = Math.cos(latitude) * Math.sin(longitude)
      let elevation = 0
      for (let octave = 0; octave < 4; octave++) {
        const frequency = (appearance.detail ?? 3) * 2 ** octave
        elevation += Math.sin(x * frequency + Math.sin(z * frequency) + phase) * Math.cos(y * frequency + z * frequency * .7 - phase) / 2 ** octave
      }
      elevation = (elevation / 1.875 + 1) / 2
      if (appearance.terrain === 'gas') elevation = (Math.sin(latitude * (appearance.detail ?? 3) * 8 + 1.3 * Math.sin(longitude * 3) * Math.cos(latitude) + phase) + 1) / 2
      const ocean = appearance.terrain === 'ocean' && elevation < (appearance.oceanLevel ?? 54) / 100
      const first = ocean ? sea : land
      const second = ocean ? land : high
      const blend = ocean ? elevation * .4 : Math.max(0, (elevation - .4) * 1.3)
      const offset = (row * width + col) * 4
      for (let channel = 0; channel < 3; channel++) data[offset + channel] = first[channel] + (second[channel] - first[channel]) * Math.min(1, blend)
      const iceSize = (appearance.iceCaps ?? 0) / 100
      if (appearance.terrain !== 'gas' && iceSize > 0) {
        const ice = Math.max(0, Math.min(1, (Math.abs(latitude) / (Math.PI / 2) - (1 - iceSize)) / .08))
        for (let channel = 0; channel < 3; channel++) data[offset + channel] += (235 - data[offset + channel]) * ice
      }
      data[offset + 3] = 255
    }
  }
  return { data, width, height }
}

export function makeWorldTexture(appearance) {
  const pixels = worldPixels(appearance)
  const canvas = document.createElement('canvas')
  canvas.width = pixels.width
  canvas.height = pixels.height
  canvas.getContext('2d').putImageData(new ImageData(pixels.data, pixels.width, pixels.height), 0, 0)
  return canvas
}
