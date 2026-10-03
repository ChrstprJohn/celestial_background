import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveLocation } from './location.js'

test('resolves city names using the consented coordinates', async () => {
  const place = await resolveLocation({ latitude: 12, longitude: 34 }, async (url) => {
    assert.equal(url.searchParams.get('latitude'), '12')
    assert.equal(url.searchParams.get('longitude'), '34')
    return { ok: true, json: async () => ({ city: 'Example City', locality: 'Example District', countryName: 'Example Country', countryCode: 'EX' }) }
  })
  assert.equal(place.city, 'Example City')
  assert.equal(place.country_code, 'EX')
  assert.equal(place.geocoding_status, 'resolved')
})

test('does not mislabel a locality as a city', async () => {
  const place = await resolveLocation({}, async () => ({ ok: true, json: async () => ({ locality: 'Rural district' }) }))
  assert.equal(place.city, undefined)
  assert.equal(place.locality, 'Rural district')
  assert.equal(place.geocoding_status, 'city_unavailable')
})

test('geocoding failures preserve the ability to send a GPS event', async () => {
  for (const request of [async () => ({ ok: false }), async () => { throw new Error('offline') }]) {
    assert.deepEqual(await resolveLocation({}, request), { geocoding_status: 'failed' })
  }
})
