import test from 'node:test'
import assert from 'node:assert/strict'
import { imagePreviewUrl } from './image-preview.js'

test('NASA preview bounds preserve the full composition and original URL', () => {
  const original = 'https://assets.science.nasa.gov/image.jpg?w=4000&crop=faces&other=kept'
  const preview = new URL(imagePreviewUrl(original))
  assert.equal(preview.searchParams.get('w'), '1280')
  assert.equal(preview.searchParams.get('h'), '1280')
  assert.equal(preview.searchParams.get('fit'), 'clip')
  assert.equal(preview.searchParams.get('other'), 'kept')
  assert.equal(preview.searchParams.has('crop'), false)
  assert.equal(original, 'https://assets.science.nasa.gov/image.jpg?w=4000&crop=faces&other=kept')
})

test('non-NASA, animated, and invalid image URLs remain unchanged', () => {
  for (const url of ['https://example.com/image.jpg', 'https://assets.science.nasa.gov/image.gif', '/image.png']) assert.equal(imagePreviewUrl(url), url)
})
