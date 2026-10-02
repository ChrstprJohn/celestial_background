import test from 'node:test'
import assert from 'node:assert/strict'
import { pupilOffset } from './pets.js'

test('pupils stay neutral at the eye center and for unmeasurable eyes', () => {
  assert.deepEqual(pupilOffset(0, 0, 40, 50), { x: 0, y: 0 })
  assert.deepEqual(pupilOffset(1, 1, 40, 50), { x: 0, y: 0 })
  assert.deepEqual(pupilOffset(100, 100, 0, 0), { x: 0, y: 0 })
})

test('pupils track all eight directions within the eye ellipse', () => {
  for (const [dx, dy] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) {
    const { x, y } = pupilOffset(dx * 1000, dy * 1000, 40, 60)
    assert.equal(Math.sign(x), dx)
    assert.equal(Math.sign(y), dy)
    assert.ok((x / (40 * .18)) ** 2 + (y / (60 * .18)) ** 2 <= 1.000001)
  }
})

test('nearby gaze changes smoothly and distant cursors do not escape the eyes', () => {
  const near = pupilOffset(20, 0, 40, 60)
  const far = pupilOffset(200, 0, 40, 60)
  const distant = pupilOffset(10000, 0, 40, 60)
  assert.ok(near.x > 0 && near.x < far.x)
  assert.deepEqual(far, distant)
})
