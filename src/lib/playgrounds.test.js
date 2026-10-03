import test from 'node:test'
import assert from 'node:assert/strict'
import { crc32 } from 'node:zlib'
import { gravityJump, jumpHeightAt } from './gravity.js'
import { DEFAULT_WORLD, worldPixels } from './world-builder.js'
import { addPngMetadata } from './png-metadata.js'

test('equal launch speed gives a higher and longer Moon jump, independent of mass', () => {
  const earth = gravityJump(70, .4, 9.8)
  const moon = gravityJump(70, .4, 1.6)
  assert.equal(earth.speed, moon.speed)
  assert.ok(Math.abs(earth.height - .4) < 1e-10)
  assert.ok(Math.abs(moon.height - 2.45) < 1e-10)
  assert.equal(moon.force, 112)
  assert.equal(gravityJump(140, .4, 1.6).height, moon.height)
  assert.ok(Math.abs(jumpHeightAt(moon.duration / 2, moon.speed, 1.6) - moon.height) < 1e-10)
  assert.equal(jumpHeightAt(moon.duration + 1, moon.speed, 1.6), 0)
  assert.throws(() => gravityJump(NaN, .4, 1.6))
  assert.throws(() => gravityJump(70, 0, 1.6))
})

test('generated worlds are repeatable, change with terrain/seed, and join at the longitude seam', () => {
  const first = worldPixels(DEFAULT_WORLD, 64, 32)
  assert.deepEqual(first, worldPixels(DEFAULT_WORLD, 64, 32))
  assert.notDeepEqual(first.data, worldPixels({ ...DEFAULT_WORLD, seed: 89 }, 64, 32).data)
  assert.notDeepEqual(first.data, worldPixels({ ...DEFAULT_WORLD, terrain: 'gas' }, 64, 32).data)
  for (let row = 0; row < 32; row++) assert.deepEqual(first.data.slice(row * 64 * 4, row * 64 * 4 + 4), first.data.slice((row * 64 + 63) * 4, (row * 64 + 64) * 4))
})

test('PNG metadata retains image bytes and valid source/license chunk checksums', () => {
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a8KcAAAAASUVORK5CYII=', 'base64')
  const result = addPngMetadata(png, { Source: 'Solar System Scope', License: 'CC BY 4.0' })
  assert.deepEqual(Buffer.from(result.subarray(0, png.length - 12)), png.subarray(0, png.length - 12))
  let offset = png.length - 12
  for (const content of ['Source\0Solar System Scope', 'License\0CC BY 4.0']) {
    const view = new DataView(result.buffer)
    const size = view.getUint32(offset)
    assert.equal(Buffer.from(result.subarray(offset + 4, offset + 8)).toString(), 'tEXt')
    assert.equal(Buffer.from(result.subarray(offset + 8, offset + 8 + size)).toString(), content)
    assert.equal(view.getUint32(offset + 8 + size), crc32(result.subarray(offset + 4, offset + 8 + size)))
    offset += size + 12
  }
  assert.deepEqual(Buffer.from(result.subarray(offset)), png.subarray(png.length - 12))
})
