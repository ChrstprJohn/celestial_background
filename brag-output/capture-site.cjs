const { chromium } = require('C:/Users/picar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const out = path.join(__dirname, 'composition/assets/screens');
fs.mkdirSync(out, {recursive:true});
(async () => {
  const browser = await chromium.launch({executablePath:'C:/Users/picar/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe', headless:true, args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:960},deviceScaleFactor:1,timezoneId:'Asia/Manila',reducedMotion:'reduce'});
    page.on('pageerror', e => console.log('PAGE ERROR:',e.message));
    async function open(route) {
      await page.goto('http://127.0.0.1:5173'+route,{waitUntil:'networkidle',timeout:60000});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(1500);
    }
    async function shot(name) {await page.screenshot({path:path.join(out,name+'.png')});console.log('Captured',name);}
    await open('/');
    await page.locator('.galaxy-scene img').evaluate(img => img.decode());
    await shot('desktop-home');
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    await shot('desktop-discoveries');
    await open('/solar-system');
    await page.waitForSelector('.planet-stage canvas');
    await page.waitForTimeout(1200);
    await shot('desktop-saturn');
    await page.getByRole('button',{name:'Earth',exact:true}).click();
    await page.waitForTimeout(1600);
    await page.evaluate(()=>document.activeElement.blur());
    await shot('desktop-earth');
    await open('/pets');
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('.pet-portrait')).every(x=>x.dataset.status==='ready'));
    await shot('desktop-pets');
    await page.setViewportSize({width:1024,height:1366});
    await open('/moon');
    await page.locator('#moondate').fill('2024-01-18');
    if(await page.locator('.lookup-button').count()) await page.locator('.lookup-button').click();
    await page.waitForTimeout(500);
    await page.evaluate(()=>{document.activeElement.blur();window.scrollTo(0,0)});
    await shot('tablet-moon-before');
    await page.locator('#moondate').fill('2024-01-25');
    if(await page.locator('.lookup-button').count()) await page.locator('.lookup-button').click();
    await page.waitForTimeout(500);
    await page.evaluate(()=>{document.activeElement.blur();window.scrollTo(0,0)});
    await shot('tablet-moon');
    await page.setViewportSize({width:390,height:844});
    await open('/'); await shot('phone-home');
    await open('/solar-system');
    await page.waitForTimeout(1600);
    await shot('phone-saturn');
    await open('/pets');await page.waitForTimeout(1600);
    await page.evaluate(()=>window.scrollTo({top:340,behavior:'instant'}));
    await shot('phone-pets');
    await page.setViewportSize({width:1440,height:960});
    await open('/shuffle');
    await page.locator('.shuffle-image').evaluate(img=>img.decode());
    await shot('desktop-shuffle');
    await open('/birthday');
    await page.locator('#birthday-date, #date, input[type=date]').first().fill('2024-01-01');
    if(await page.locator('.lookup-button').count()) await page.locator('.lookup-button').click();
    await page.waitForFunction(()=>document.querySelector('.result-date')?.textContent==='January 1, 2024',null,{timeout:60000});
    await page.locator('.original-image').evaluate(img=>img.decode());
    await page.waitForTimeout(500);
    await page.evaluate(()=>{document.activeElement.blur();window.scrollTo(0,0)});
    await shot('desktop-birthday');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
