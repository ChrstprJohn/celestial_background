import test from 'node:test'
import assert from 'node:assert/strict'
import { MOON_END, MOON_START, moonForDate, validateMoonDate } from './moon.js'
import { drawMoon } from './moon-render.js'

test('Moon dates accept historical birthdays and future dates, reject invalid dates and bounds', () => {
  for (const date of [MOON_START, MOON_END, '1969-07-20', '2024-02-29', '2099-12-31']) assert.equal(validateMoonDate(date), '')
  for (const date of ['', null, '2023-02-29', '2024-02-30', '1899-12-31', '2101-01-01']) {
    assert.notEqual(validateMoonDate(date), '')
    assert.throws(() => moonForDate(date))
  }
})

test('known 2024 eclipse dates are nearly unilluminated and fully illuminated at noon UTC', () => {
  // NASA: April 8 total solar eclipse; March 25 penumbral lunar eclipse.
  const newMoon = moonForDate('2024-04-08')
  const fullMoon = moonForDate('2024-03-25')
  // Noon is several hours away from the exact conjunction/opposition.
  assert.ok(newMoon.fraction < .002)
  assert.ok(fullMoon.fraction > .999)
})

test('Moon shading reverses between waxing and waning and keeps the background transparent', () => {
  const size = 64
  const texture = { width: 16, height: 8, data: new Uint8ClampedArray(16 * 8 * 4).fill(200) }
  let rendered
  const context = {
    createImageData: (width, height) => ({ data: new Uint8ClampedArray(width * height * 4) }),
    putImageData: (frame) => { rendered = frame.data },
  }
  const canvas = { width: size, getContext: () => context }
  const left = (32 * size + 16) * 4
  const right = (32 * size + 48) * 4
  drawMoon(canvas, texture, .5, true)
  assert.ok(rendered[right] > rendered[left] * 10)
  assert.equal(rendered[3], 0)
  assert.equal(rendered[right + 3], 255)
  drawMoon(canvas, texture, .5, false)
  assert.ok(rendered[left] > rendered[right] * 10)
  drawMoon(canvas, texture, 0, true)
  assert.ok(rendered[left] < 10 && rendered[right] < 10)
  drawMoon(canvas, texture, 1, true)
  assert.ok(rendered[left] > 100 && rendered[right] > 100)
})
