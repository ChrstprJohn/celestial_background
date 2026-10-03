import test from 'node:test'
import assert from 'node:assert/strict'
import { CITIES, skyTime, skyBodies } from './sky.js'
import { cosmicAge } from './cosmic-age.js'
import { cosmicAgeShareText } from './cosmic-age-share.js'
import { visiblePlanetBounds } from './planet-export.js'

test('planet export keeps faint ring edges, removes only transparent space, and rejects blank captures', () => {
  const data = new Uint8ClampedArray(7 * 5 * 4)
  assert.equal(visiblePlanetBounds({ data, width: 7, height: 5 }), null)
  for (const [x, y, alpha] of [[0, 1, 1], [6, 3, 1], [3, 2, 255]]) data[(y * 7 + x) * 4 + 3] = alpha
  assert.deepEqual(visiblePlanetBounds({ data, width: 7, height: 5 }), { x: 0, y: 1, width: 7, height: 3 })
})

test('share text preserves the chosen birthday, world, age and next orbital birthday', () => {
  const result = cosmicAge('2000-01-01', 'mercury', new Date('2000-03-29T00:00:00Z'))
  assert.deepEqual(cosmicAgeShareText({ birthday: '2000-01-01', planetName: 'Mercury', result, observedDate: '2000-03-29' }), {
    birth: 'Born January 1, 2000', observed: 'As of March 29, 2000', age: '1.00', world: 'Mercury years', next: 'June 25, 2000', countdown: 'Turning 2 in approximately 88 Earth days.',
  })
})

test('city presets have unique identities, valid coordinates and usable local timezones', () => {
  assert.equal(new Set(CITIES.map((city) => city.id)).size, CITIES.length)
  const philippines = CITIES.filter((city) => city.group === 'Philippines')
  assert.equal(philippines.length, 10)
  for (const city of CITIES) {
    assert.ok(city.latitude >= -90 && city.latitude <= 90)
    assert.ok(city.longitude >= -180 && city.longitude <= 180)
    assert.doesNotThrow(() => new Intl.DateTimeFormat('en-US', { timeZone: city.timeZone }).format(new Date()))
    const bodies = skyBodies(skyTime('2026-10-03', 720), city)
    assert.ok(bodies.every((body) => Number.isFinite(body.altitude) && Number.isFinite(body.azimuth)))
  }
  for (const city of philippines) {
    assert.equal(city.timeZone, 'Asia/Manila')
    assert.ok(city.latitude > 5 && city.latitude < 20 && city.longitude > 117 && city.longitude < 127)
  }
})
