import {chromium,firefox,webkit} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
const engine=process.env.ENGINE||'chromium',driver={chromium,firefox,webkit}[engine];
const base='http://127.0.0.1:8766/',server=spawn('python',['-m','http.server','8766','--bind','127.0.0.1','--directory','dist'],{stdio:'ignore'});
const report={engine,checks:[],accessibility:[],visualDiff:[],errors:[]};let browser;
await mkdir('quality-output',{recursive:true});
try{
 for(let i=0;i<60;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await driver.launch({headless:true,...(engine==='chromium'&&process.env.PLAYWRIGHT_CHROME?{executablePath:process.env.PLAYWRIGHT_CHROME}:{})});
 for(const [width,height] of [[390,844],[1440,900]]){
  const ctx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  const page=await ctx.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  for(const [name,route] of [['home',''],['chapter','bab-4/'],['studio','lab/'],['reference','referensi/']]){
   await page.goto(base+route,{waitUntil:'load'});await page.locator('main').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,engine+' '+width+' '+route+' overflow');
   await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
   const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
   report.accessibility.push({width,name,violations:result.violations.map(v=>({id:v.id,impact:v.impact,count:v.nodes.length,targets:v.nodes.slice(0,8).map(n=>n.target)}))});
   const file=name+'-'+width+'.png';const current=await page.screenshot({path:'quality-output/'+file,animations:'disabled',caret:'hide'});
   if(existsSync('visual-baseline/'+file)){const a=PNG.sync.read(await readFile('visual-baseline/'+file)),b=PNG.sync.read(current);if(a.width===b.width&&a.height===b.height){const diff=new PNG({width:a.width,height:a.height});const n=pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:.15});const pct=100*n/(a.width*a.height);report.visualDiff.push({file,pct});if(pct>0.5)await writeFile('quality-output/diff-'+file,PNG.sync.write(diff));}else report.visualDiff.push({file,error:'Dimensions changed'});}else report.visualDiff.push({file,baseline:'created; compare next run'});
   report.checks.push({width,name,overflow:false});
  }
  await page.goto(base);await page.keyboard.press('Control+k');assert.equal(await page.locator('.academy-command').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('.academy-command').isVisible(),false);
  await page.goto(base+'lab/');await page.locator('#cx-search').click();assert.match(await page.locator('#cx-search-out').innerText(),/indeks 4/);await ctx.close();
 }
 assert.deepEqual(report.errors,[]);
}finally{await browser?.close();server.kill();await writeFile('quality-output/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}
const severe=report.accessibility.flatMap(v=>v.violations.filter(x=>['critical','serious'].includes(x.impact)));
const significant=report.visualDiff.filter(v=>v.error||v.pct>3);
if(severe.length||significant.length)throw Error('Extended gate: '+severe.length+' serious/critical accessibility groups; '+significant.length+' visual changes > 3%. Review evidence before Stable.');
console.log('Extended quality checks completed; physical devices remain separate.');