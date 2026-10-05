import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { performance } from 'node:perf_hooks'

const before = execFileSync('git', ['show', '598c659:src/lib/moon-render.js'], { encoding: 'utf8' })
const after = readFileSync('src/lib/moon-render.js', 'utf8')
const texture = { width: 64, height: 32, data: new Uint8ClampedArray(64 * 32 * 4).fill(200) }
const canvas = { width: 720, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) }
for (const [label, source] of [['before', before], ['after', after]]) {
  const times = []
  for (let i = 0; i < 5; i++) {
    const module = await import(`data:text/javascript;base64,${Buffer.from(source + `\n// run ${i}`).toString('base64')}`)
    const start = performance.now()
    module.drawMoon(canvas, texture, .5, true)
    times.push(performance.now() - start)
  }
  times.sort((a, b) => a - b)
  console.log(`${label}: median first 720px Moon render ${times[2].toFixed(1)} ms`)
}
