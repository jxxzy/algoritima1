import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
const server=spawn('python',['-m','http.server','8765','--bind','127.0.0.1','--directory','dist'],{stdio:'ignore'});
const base='http://127.0.0.1:8765/';
let browser;
try{
 for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROME?{executablePath:process.env.PLAYWRIGHT_CHROME}:{})});
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of ['',...Array.from({length:7},(_,i)=>'bab-'+(i+1)+'/'),'lab/','referensi/']){
   await page.goto(base+route);await page.locator('main').waitFor();assert.equal(await page.locator('main').count(),1);
 }
 await page.goto(base+'bab-4/');assert.equal(await page.getByRole('link',{name:'Lanjut Bab 5 →'}).count(),1);
 await page.goto(base+'bab-7/');await page.waitForFunction(()=>document.querySelector('#solution-status')?.textContent.includes('berhasil dimuat'));
 assert.match(await page.locator('#solution-filename').innerText(),/Bab 7/);
 await page.goto(base+'lab/');await page.locator('#ac-grade').fill('79');await page.locator('#ac-grade-run').click();assert.match(await page.locator('#ac-grade-output').innerText(),/Predikat: B/);
 await page.locator('#ac-trace-n').fill('4');await page.locator('#ac-trace').click();assert.equal(await page.locator('#ac-trace-body tr').count(),4);
 await page.locator('#ac-sort-next').click();assert.match(await page.locator('#ac-sort-status').innerText(),/2 \//);
 await page.locator('#flow-label').fill('Hitung nilai');await page.locator('#flow-add').click();assert.match(await page.locator('#flow-pseudo').innerText(),/Hitung nilai/);
 await page.locator('#cx-search-target').fill('9');await page.locator('#cx-search').click();assert.match(await page.locator('#cx-search-out').innerText(),/indeks 4/);
 await page.locator('#ac-project-name').fill('Browser smoke');await page.locator('#ac-project-save').click();assert.equal(await page.locator('#ac-projects option').count(),2);
 await page.goto(base);await page.keyboard.press('Control+k');assert.equal(await page.locator('.academy-command').isVisible(),true);await page.keyboard.press('Escape');await page.locator('#ac-note').fill('Smoke test note');await page.reload();assert.equal(await page.locator('#ac-note').inputValue(),'Smoke test note');
 await page.locator('#exam-start').click();assert.match(await page.locator('#exam-status').innerText(),/Soal 1 \/ 10/);
 await page.locator('#exam-answer').fill('0');await page.locator('#exam-form button[type=submit]').click();assert.ok((await page.locator('#exam-feedback').innerText()).length>0);
 await page.locator('#exam-next').click();assert.match(await page.locator('#exam-status').innerText(),/Soal 2 \/ 10/);
 // Wait for service worker installation and verify canonical chapter route and index offline.
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));});await context.setOffline(true);await page.goto(base+'bab-3/');assert.match(await page.title(),/Bab 3/);const cached=await page.evaluate(async()=>Array.isArray(await (await fetch('search-index.json',{cache:'no-store'})).json()));assert.equal(cached,true);await context.setOffline(false);
 for(const width of [320,360,390,430,768,1024,1280,1440,1920]){
  const screen=await browser.newPage({viewport:{width,height:900},hasTouch:width<1100});
  for(const route of ['', 'bab-1/','lab/','referensi/']){
   await screen.goto(base+route);await screen.locator('main').waitFor();
   await screen.evaluate(()=>document.fonts.ready);
   const overflow=await screen.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
   assert.equal(overflow,false,'Horizontal overflow: '+width+' '+route);
   if(width<768)assert.equal(await screen.locator('.academy-bottom').isVisible(),true);
   else assert.equal(await screen.locator('.academy-bottom').isVisible(),false);
   if(width>=1100){assert.equal(await screen.locator('.sidebar').isVisible(),true);assert.ok(await screen.locator('.sidebar').evaluate(el=>el.getBoundingClientRect().left>=0));}
  }
  if(width===390){await screen.goto(base);await screen.locator('#mobile-menu').click();assert.equal(await screen.locator('#sidebar').evaluate(el=>el.inert),false);await screen.keyboard.press('Escape');assert.equal(await screen.locator('#sidebar').evaluate(el=>el.inert),true);}
  await screen.close();
 }
 assert.deepEqual(errors,[]);console.log('Browser smoke: 10 routes, code mapping, visualizers, persistence, assessment, offline and mobile passed.');
}finally{await browser?.close();server.kill();}