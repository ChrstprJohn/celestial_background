import { saveCanvasPng } from './art-export.js'
import { drawCollectibleBorder } from './collectible-card.js'

export async function saveWorldPng({ image, name, appearance }, filename) {
  await document.fonts.ready
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const context = canvas.getContext('2d')
  context.fillStyle = '#070b17'
  context.fillRect(0, 0, 1080, 1350)
  for (let index = 0; index < 100; index++) {
    context.fillStyle = '#8e93b0'
    context.beginPath()
    context.arc(80 + index * 293 % 920, 80 + index * 197 % 1190, index % 4 ? 1 : 2, 0, Math.PI * 2)
    context.fill()
  }
  context.textAlign = 'center'
  context.fillStyle = '#f3f0e9'
  let size = 96
  do { context.font = `${size--}px "Instrument Serif"` } while (context.measureText(name).width > 850 && size > 25)
  context.fillText(name, 540, 225)
  context.fillStyle = '#c9c1f0'
  context.font = 'italic 46px "Instrument Serif"'
  context.fillText('A world of your own.', 540, 295)
  const scale = Math.min(860 / image.width, 640 / image.height)
  context.drawImage(image, (1080 - image.width * scale) / 2, 390 + (640 - image.height * scale) / 2, image.width * scale, image.height * scale)
  context.fillStyle = '#b5bbd0'
  context.font = '26px "DM Sans"'
  const terrain = { ocean: 'Ocean world', rocky: 'Rocky world', gas: 'Gas world' }[appearance.terrain]
  context.fillText(`${terrain}${appearance.rings ? ' · Ringed' : ''}${appearance.clouds ? ' · Clouded' : ''}`, 540, 1120)
  context.fillStyle = '#a4abc2'
  context.font = '22px "DM Sans"'
  context.fillText('An imaginary planet, created by you.', 540, 1170)
  drawCollectibleBorder(context)
  return saveCanvasPng(canvas, filename, { Source: 'Cloud and ring textures: Solar System Scope, https://www.solarsystemscope.com/textures/', License: 'Texture assets: CC BY 4.0, https://creativecommons.org/licenses/by/4.0/', Description: 'Fictional procedurally generated world; not a catalogued planet.' })
}
