import axios from 'axios'
import { apodDateCode, validateDate } from './dates.js'
import { safeUrl, selectApod, videoEmbedUrl } from './apod-data.js'

const baseURL = (import.meta.env.VITE_NASA_API_URL || 'https://science.nasa.gov/wp-json/wp/v2/apod-basic').replace(/\/+$/, '')
const apiKey = import.meta.env.VITE_NASA_API_KEY
const cache = new Map()

function plainText(html = '') {
  const document = new DOMParser().parseFromString(String(html), 'text/html')
  document.querySelectorAll('script, style').forEach((element) => element.remove())
  return (document.body.textContent || '').replace(/\s+/g, ' ').trim()
}

export async function fetchApod(date, signal) {
  const validation = validateDate(date)
  if (validation) throw new Error(validation)
  if (cache.has(date)) return cache.get(date)

  try {
    const { data } = await axios.get(`${baseURL}/${apodDateCode(date)}`, {
      params: apiKey ? { api_key: apiKey } : undefined,
      timeout: 20000,
      signal,
    })
    const item = selectApod(data, date)
    const result = {
      date: item.date,
      title: plainText(item.title),
      explanation: plainText(item.explanation).replace(/^Explanation:\s*/i, ''),
      credit: plainText(item.credit || item.copyright).replace(/^Image Credit(?:\s*&\s*Copyright)?:\s*/i, ''),
      alt: plainText(item.alt) || item.title,
      mediaType: item.media_type,
      // NASA Science's `url` can be an article. `hdurl` contains the image.
      image: safeUrl(item.hdurl) || (item.media_type === 'image' && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(item.url || '') ? safeUrl(item.url) : ''),
      source: safeUrl(item.permalink) || `https://science.nasa.gov/apod/`,
      video: videoEmbedUrl(item.url),
    }
    cache.set(date, result)
    return result
  } catch (error) {
    if (axios.isCancel(error)) throw error
    if (error.response?.status === 429) throw new Error('NASA is receiving too many requests. Wait a minute, then try again.')
    if ([401, 403].includes(error.response?.status)) throw new Error('NASA could not authorize this request. Check your API key configuration.')
    if (error.response?.status === 404) throw Object.assign(new Error('NASA has no entry available for that date. Try another day.'), { code: 'APOD_NOT_FOUND' })
    if (error.code === 'ECONNABORTED') throw new Error('NASA took a little too long to respond. Please try again.')
    if (error.code === 'ERR_NETWORK') throw new Error('We could not reach NASA. Check your connection and try again.')
    if (error.response) throw new Error('NASA’s archive is temporarily unavailable. Please try again shortly.')
    throw error
  }
}
