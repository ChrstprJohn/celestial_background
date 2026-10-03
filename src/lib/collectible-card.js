export function drawCollectibleBorder(context, width = 1080, height = 1350) {
  context.save()
  context.strokeStyle = '#c9c1f0'
  context.lineWidth = 3
  context.beginPath()
  context.roundRect(30, 30, width - 60, height - 60, 30)
  context.stroke()
  context.strokeStyle = '#716894'
  context.lineWidth = 1
  context.beginPath()
  context.roundRect(48, 48, width - 96, height - 96, 20)
  context.stroke()
  for (const [x, y] of [[68, 68], [width - 68, 68], [68, height - 68], [width - 68, height - 68]]) {
    context.fillStyle = '#070b17'
    context.fillRect(x - 17, y - 17, 34, 34)
    context.strokeStyle = '#c9c1f0'
    context.beginPath()
    context.moveTo(x, y - 13)
    context.lineTo(x + 4, y - 4)
    context.lineTo(x + 13, y)
    context.lineTo(x + 4, y + 4)
    context.lineTo(x, y + 13)
    context.lineTo(x - 4, y + 4)
    context.lineTo(x - 13, y)
    context.lineTo(x - 4, y - 4)
    context.closePath()
    context.stroke()
  }
  context.restore()
}
