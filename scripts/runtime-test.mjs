import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:8767/',server=spawn('python',['-m','http.server','8767','--bind','127.0.0.1','--directory','dist'],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROME?{executablePath:process.env.PLAYWRIGHT_CHROME}:{})});
 const p=await browser.newPage();p.setDefaultTimeout(120000);await p.goto(base+'lab/');
 const code=p.locator('#ac-code'),stdin=p.locator('#ac-stdin'),status=p.locator('#ac-runtime-status'),output=p.locator('#ac-output');
 const completed=async()=>{await p.waitForFunction(()=>!document.querySelector('#ac-run').disabled&&/selesai|gagal|habis|valid|dihentikan|tercapai/i.test(document.querySelector('#ac-runtime-status').textContent),null,{timeout:120000});console.log(await status.innerText(),(await output.innerText()).slice(0,300));};
 await code.fill('print(6 * 7)');await p.locator('#ac-run').click();await completed();assert.match(await output.innerText(),/^42\s*$/);assert.match(await status.innerText(),/selesai/);
 await code.fill('n = int(input())\nprint(n * 3)');await stdin.fill('14');await p.locator('#ac-run').click();await completed();assert.match(await output.innerText(),/^42\s*$/);
 await code.fill('def broken(');await p.locator('#ac-syntax').click();await completed();assert.match(await output.innerText(),/SyntaxError/);
 await code.fill('print(1)');await p.locator('#ac-syntax').click();await completed();assert.match(await status.innerText(),/Sintaks valid/);
 await p.locator('#ac-template').selectOption('double');await code.fill('print(int(input()) * 2)');await p.locator('#ac-run').click();await completed();assert.match(await status.innerText(),/3\/3 test case lulus/);
 await p.locator('#ac-template').selectOption('starter');await p.locator('#mx-name').fill('helper.py');await p.locator('#mx-code').fill('answer = 42');await p.locator('#mx-save').click();await code.fill('from helper import answer\nprint(answer)');await p.locator('#ac-run').click();await completed();assert.match(await output.innerText(),/^42\s*$/);
 await code.fill('while True:\n    pass');await p.locator('#ac-run').click();await p.waitForFunction(()=>document.querySelector('#ac-runtime-status').textContent.includes('Kode berjalan'));await p.locator('#ac-stop').click();assert.match(await status.innerText(),/dihentikan/);
 console.log('Real Python runtime checks passed: arithmetic, stdin, syntax, 3 test cases, stop.');
}finally{await browser?.close();server.kill();}