import { saveCanvasPng } from './art-export.js'
import { formatDate } from './dates.js'
import { drawCollectibleBorder } from './collectible-card.js'

export function cosmicAgeShareText({ birthday, planetName, result, observedDate }) {
  return {
    birth: `Born ${formatDate(birthday)}`,
    observed: `As of ${formatDate(observedDate)}`,
    age: result.age.toFixed(2),
    world: `${planetName} years`,
    next: formatDate(result.next.toISOString().slice(0, 10)),
    countdown: `Turning ${result.nextAge} in approximately ${result.remainingDays.toLocaleString('en-US')} Earth days.`,
  }
}

export async function saveCosmicAgePng(details, filename) {
  if (!details.planetImage?.width || !details.planetImage?.height) throw new Error('The planet image is not ready.')
  await document.fonts.ready
  const text = cosmicAgeShareText(details)
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Image export is unavailable.')
  context.fillStyle = '#070b17'
  context.fillRect(0, 0, 1080, 1350)
  for (let index = 0; index < 150; index++) {
    context.fillStyle = index % 5 ? '#8e93b0' : '#c9c1f0'
    context.globalAlpha = index % 3 ? .35 : .65
    context.beginPath()
    context.arc(25 + index * 293 % 1030, 25 + index * 197 % 1300, index % 7 ? 1 : 2, 0, Math.PI * 2)
    context.fill()
  }
  context.globalAlpha = 1
  const line = (value, x, y, font, color = '#f3f0e9', align = 'left') => {
    context.font = font
    context.fillStyle = color
    context.textAlign = align
    context.fillText(value, x, y)
  }
  line('Same you.', 100, 175, '94px "Instrument Serif"')
  line('Another birthday.', 100, 285, 'italic 94px "Instrument Serif"', '#c9c1f0')
  line(text.birth, 100, 350, '28px "DM Sans"', '#b5bbd0')
  line(text.observed, 100, 395, '24px "DM Sans"', '#a4abc2')
  const scale = Math.min(880 / details.planetImage.width, 380 / details.planetImage.height)
  const width = details.planetImage.width * scale
  const height = details.planetImage.height * scale
  context.drawImage(details.planetImage, (1080 - width) / 2, 420 + (380 - height) / 2, width, height)
  line(text.age, 540, 906, '124px "Instrument Serif"', '#f3f0e9', 'center')
  line(text.world, 540, 962, '42px "Instrument Serif"', '#c9c1f0', 'center')
  line(`Your next ${details.planetName} birthday`, 540, 1020, '24px "DM Sans"', '#b5bbd0', 'center')
  line(text.next, 540, 1076, '46px "Instrument Serif"', '#f3f0e9', 'center')
  line(text.countdown, 540, 1120, '22px "DM Sans"', '#b5bbd0', 'center')
  drawCollectibleBorder(context)
  return saveCanvasPng(canvas, filename, {
    Source: 'Planet textures: Solar System Scope / INOVE, https://www.solarsystemscope.com/textures/',
    License: 'Planet textures: CC BY 4.0, https://creativecommons.org/licenses/by/4.0/',
    Description: 'Illustrative planet rendering. Age estimates use NASA mean orbital periods and a midnight UTC birth date.',
  })
}
