const {chromium}=require('C:/Users/picar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Users/picar/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:960},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:5173/birthday',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('input[type=date]');
  await page.locator('input[type=date]').fill('2024-01-01');
  if(await page.locator('.lookup-button').count()) await page.locator('.lookup-button').click();
  await page.waitForFunction(()=>document.querySelector('.result-date')?.textContent==='January 1, 2024',null,{timeout:60000});
  await page.locator('.original-image').evaluate(img=>img.decode());
  await page.waitForTimeout(800);
  console.log(await page.locator('.original-image').evaluate(img=>({url:img.src,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,width:img.width,height:img.height})));
  await page.evaluate(()=>document.activeElement.blur());
  await page.screenshot({path:__dirname+'/composition/assets/screens/desktop-birthday.png'});
  await page.setViewportSize({width:1024,height:1366});
  await page.goto('http://127.0.0.1:5173/moon',{waitUntil:'networkidle'});
  for(const [date,file] of [['2024-01-18','tablet-moon-before'],['2024-01-25','tablet-moon']]){
   await page.locator('#moondate').fill(date);
   if(await page.locator('.lookup-button').count()) await page.locator('.lookup-button').click();
   await page.waitForTimeout(600);
   await page.evaluate(()=>{document.activeElement.blur();window.scrollTo(0,0)});
   await page.screenshot({path:__dirname+'/composition/assets/screens/'+file+'.png'});
   console.log('Updated',file);
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
