import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { cosmicAge, ORBIT_DAYS } from './cosmic-age.js'
import { addConnection, freshStars } from './studio.js'
import { projectSky, skyBodies, skyProjection, skyTime, CITIES, placeSkyLabels } from './sky.js'
import { normalizeAsteroids, normalizeStation } from './space-data.js'
import { DETECTIVE_QUESTIONS, shuffledQuestions } from './detective.js'

test('nearby sky bodies keep separate readable labels inside the chart', () => {
  const labels = placeSkyLabels([{name:'Saturn',x:290,y:290,visible:true},{name:'Neptune',x:292,y:290,visible:true},{name:'Moon',x:600,y:100,visible:true},{name:'Sun',x:100,y:100,visible:false}])
  assert.equal(labels.length,3)
  assert.ok(Math.abs(labels[0].label.y-labels[1].label.y)>=15)
  assert.ok(labels[2].label.x + 6.5 * labels[2].name.length <= 635)
})

test('cosmic birthdays use orbital periods, keep next birthday ahead, and validate dates', () => {
  const result = cosmicAge('2000-01-01', 'mercury', new Date('2000-03-29T00:00:00Z'))
  assert.equal(result.age, 1)
  assert.equal(result.remainingDays, 88)
  assert.equal(result.nextAge, 2)
  assert.equal(cosmicAge('2024-02-29', 'earth', new Date('2024-02-29T12:00:00Z')).age, .5 / ORBIT_DAYS.earth)
  for (const date of ['2023-02-29','garbage','2030-01-01']) assert.throws(() => cosmicAge(date, 'earth', new Date('2026-01-01T00:00:00Z')))
})

test('drawing connections allow closing a shape, reject repeated taps, and bound the work', () => {
  assert.deepEqual(addConnection([1,2], 1), [1,2,1])
  assert.deepEqual(addConnection([1,2], 2), [1,2])
  assert.equal(addConnection(Array(100).fill(1), 2).length, 100)
  const stars = freshStars(() => .5)
  assert.equal(stars.length, 12)
  assert.ok(stars.every(([x,y]) => x > 0 && x < 600 && y > 0 && y < 600))
})

test('overhead chart puts north at top, east at left, and hides objects below the horizon', () => {
  assert.deepEqual(projectSky(90,0), { x:350,y:350,visible:true })
  assert.equal(projectSky(0,90).x, 80)
  assert.equal(projectSky(0,0).y, 80)
  assert.equal(projectSky(-1,0).visible, false)
  const time = skyTime('2026-10-03', 720)
  const bodies = skyBodies(time, CITIES[0])
  assert.equal(time.toISOString(), '2026-10-03T12:00:00.000Z')
  assert.equal(bodies.length, 9)
  assert.ok(bodies.every((body) => Number.isFinite(body.altitude) && Number.isFinite(body.azimuth)))
  const projection = skyProjection(time, CITIES[0])([0,0])
  assert.ok(Number.isFinite(projection.x) && Number.isFinite(projection.y))
})

test('bundled catalog provides real star positions and valid constellation line geometry', () => {
  const stars = JSON.parse(readFileSync(new URL('../../public/data/stars.6.json', import.meta.url)))
  const lines = JSON.parse(readFileSync(new URL('../../public/data/constellations.lines.json', import.meta.url)))
  assert.ok(stars.features.length > 5000)
  assert.ok(stars.features.every((star) => star.geometry.coordinates.length === 2 && star.geometry.coordinates.every(Number.isFinite)))
  assert.ok(lines.features.every((line) => line.geometry.type === 'MultiLineString'))
})

test('station feed rejects impossible and incomplete positions', () => {
  const station = { latitude:12,longitude:-35,altitude:420,velocity:27000,timestamp:1791004508 }
  assert.deepEqual(normalizeStation(station), station)
  assert.throws(() => normalizeStation({ ...station,latitude:91 }))
  assert.throws(() => normalizeStation({ ...station,altitude:null }))
})

test('asteroid feed uses the requested approach and preserves estimated diameter ranges', () => {
  const asteroid = { id:'123',name:'Visitor',estimated_diameter:{meters:{estimated_diameter_min:20,estimated_diameter_max:40}},close_approach_data:[{close_approach_date:'2026-10-03',miss_distance:{kilometers:'384400'},relative_velocity:{kilometers_per_hour:'12000'}}] }
  const result = normalizeAsteroids({near_earth_objects:{'2026-10-03':[asteroid]}},'2026-10-03')
  assert.equal(result.length,1)
  assert.equal(result[0].lunarDistances,1)
  assert.equal(result[0].minSize,20)
  assert.equal(result[0].maxSize,40)
  assert.deepEqual(normalizeAsteroids({near_earth_objects:{'2026-10-03':[]}},'2026-10-03'),[])
  assert.throws(() => normalizeAsteroids({},'2026-10-03'))
})

test('quiz rounds contain all five unique, sourced questions with valid answers', () => {
  assert.equal(new Set(DETECTIVE_QUESTIONS.map((question) => question.id)).size,5)
  assert.ok(DETECTIVE_QUESTIONS.every((question) => question.options[question.answer] && question.source.startsWith('https://')))
  assert.deepEqual(shuffledQuestions(() => .3).map((question) => question.id).sort(), DETECTIVE_QUESTIONS.map((question) => question.id).sort())
})
