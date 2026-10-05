import test from 'node:test'
import assert from 'node:assert/strict'
import { moonMatch } from './moon-match.js'

test('opposite quarters complete a Moon without overlapping', () => {
  assert.deepEqual(moonMatch({ fraction: .5, waxing: true }, { fraction: .5, waxing: false }), { coverage: 1, overlap: 0, fit: 100 })
})
test('identical phases overlap instead of complementing each other', () => {
  assert.deepEqual(moonMatch({ fraction: .5, waxing: true }, { fraction: .5, waxing: true }), { coverage: .5, overlap: .5, fit: 0 })
})
test('a full and new Moon complement each other; two full Moons overlap', () => {
  assert.equal(moonMatch({ fraction: 1, waxing: true }, { fraction: 0, waxing: true }).fit, 100)
  assert.equal(moonMatch({ fraction: 1, waxing: true }, { fraction: 1, waxing: false }).fit, 0)
})
test('the comparison is symmetric and bounded', () => {
  const a = { fraction: .8, waxing: false }, b = { fraction: .3, waxing: true }
  assert.deepEqual(moonMatch(a, b), moonMatch(b, a))
  assert.equal(moonMatch(a, b).fit, 90)
})
