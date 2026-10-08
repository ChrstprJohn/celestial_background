const { chromium } = require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs = require('node:fs')
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')

;(async () => {
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', '4175', '--strictPort'], { stdio: 'ignore', windowsHide: true })
  let browser
  try {
  for (let attempt = 0; attempt < 30; attempt++) {
    try { if ((await fetch('http://127.0.0.1:4175/')).ok) break } catch { /* Wait for Vite. */ }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  browser = await chromium.launch({ headless: true, channel: 'chrome' })
  const report = []
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: name === 'mobile' ? 2 : 1, acceptDownloads: true })
    await page.addInitScript(() => localStorage.setItem('celestial-location-prompt-seen', 'true'))
    const errors = []
    const requests = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('request', request => requests.push(request.url()))
    await page.goto('http://127.0.0.1:4175/pets')
    await page.locator('.pet-portrait[data-status="ready"]').first().waitFor()
    assert.equal(await page.locator('.cosmic-pet').count(), 12)
    const preview = await page.locator('.pet-portrait img').first().evaluate(img => ({ src: img.currentSrc, width: img.naturalWidth }))
    assert.match(preview.src, /\.webp$/)
    assert.ok(!requests.some(url => /LandingPage.*\.js|three\.module.*\.js|\/pets\/.*\.png/.test(url)))
    await page.screenshot({ path: `output/performance/pets-${name}.png` })
    await page.mouse.move(100, 500)
    await page.getByRole('button', { name: 'Pause eyes' }).click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download Nebula image' }).click()
    const download = await downloadPromise
    await download.saveAs(`output/performance/nebula-download-${name}.png`)
    for (const portrait of await page.locator('.pet-portrait').all()) {
      await portrait.scrollIntoViewIfNeeded()
      const id = await portrait.getAttribute('data-pet')
      await page.locator(`.pet-portrait[data-pet="${id}"][data-status="ready"]`).waitFor()
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
    assert.equal(overflow, false)
    assert.deepEqual(errors, [])
    const wisp = page.locator('.pet-portrait[data-pet="wisp"]')
    await wisp.scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Resume eyes' }).click()
    await wisp.scrollIntoViewIfNeeded()
    await page.mouse.move(10, 10)
    await page.waitForFunction(() => [...document.querySelectorAll('[data-pet="wisp"] .pet-pupil')].every(p => p.style.transform && p.style.transform !== 'translate(0px, 0px)'))
    await page.getByRole('button', { name: 'Pause eyes' }).click()
    await page.waitForFunction(() => [...document.querySelectorAll('[data-pet="wisp"] .pet-pupil')].every(p => p.style.transform === 'translate(0px, 0px)'))
    await wisp.locator('..').screenshot({ path: `output/performance/wisp-${name}.png` })
    const wispDownloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download Wisp image' }).click()
    const wispDownload = await wispDownloadPromise
    await wispDownload.saveAs(`output/performance/wisp-download-${name}.png`)
    report.push({ name, preview, pets: 12, download: download.suggestedFilename(), overflow, errors })
    await page.goto('http://127.0.0.1:4175/')
    await page.locator('.hero-copy').waitFor()
    await page.screenshot({ path: `output/performance/home-${name}.png` })
    assert.equal(await page.locator('.service-card').count(), 8)
    assert.deepEqual(errors, [])
    await page.close()
  }
  fs.writeFileSync('output/performance/browser-checks.json', JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
  } finally {
    await browser?.close()
    server.kill()
  }
})().catch(error => { console.error(error); process.exitCode = 1 })
