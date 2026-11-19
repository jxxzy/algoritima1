(() => {
'use strict';
const $=id=>document.getElementById(id),read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d;}catch{return d;}},save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{return false;}};
const text=(id,v)=>{$(id).textContent=v;};
const el=(tag,v)=>{const e=document.createElement(tag);e.textContent=v;return e;};
const download=(name,value)=>{const u=URL.createObjectURL(new Blob([value],{type:'text/plain'}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);};
const moduleKey='academy-modules-v1';
function getModules(){const v=read(moduleKey,[]);return Array.isArray(v)?v.filter(x=>x&&/^[a-zA-Z_][a-zA-Z0-9_]{0,39}\.py$/.test(x.name)&&x.name!=='main.py'&&typeof x.code==='string'&&x.code.length<=20000).slice(0,10):[];}
globalThis.AcademyModules={get:getModules};
if($('mx-files')){
 let items=getModules();
 const refresh=()=>{$('mx-files').replaceChildren(new Option('Pilih modul',''),...items.map(p=>new Option(p.name,p.name)));};
 $('mx-files').onchange=()=>{const p=items.find(x=>x.name===$('mx-files').value);if(p){$('mx-name').value=p.name;$('mx-code').value=p.code;}};
 $('mx-new').onclick=()=>{$('mx-name').value='';$('mx-code').value='';$('mx-files').value='';$('mx-name').focus();};
 $('mx-save').onclick=()=>{const name=$('mx-name').value.trim(),code=$('mx-code').value;if(!/^[a-zA-Z_][a-zA-Z0-9_]{0,39}\.py$/.test(name)||name==='main.py'){text('mx-status','Nama modul tidak valid. Gunakan nama_identifier.py selain main.py.');return;}const i=items.findIndex(x=>x.name===name);if(i<0&&items.length>=10){text('mx-status','Batas 10 modul.');return;}const next=items.slice();if(i<0)next.push({name,code});else next[i]={name,code};if(!save(moduleKey,next)){text('mx-status','Penyimpanan gagal.');return;}items=next;refresh();$('mx-files').value=name;text('mx-status','Modul tersimpan dan tersedia saat Python dijalankan.');};
 $('mx-delete').onclick=()=>{const name=$('mx-files').value;if(!name||!confirm('Hapus '+name+'?'))return;const next=items.filter(x=>x.name!==name);if(save(moduleKey,next)){items=next;refresh();$('mx-new').click();text('mx-status','Modul dihapus.');}};refresh();
 document.addEventListener('academy-runtime-error',e=>{const detail=String(e.detail),match=detail.match(/(?:^|\n)([A-Za-z_]\w*(?:Error|Exception)):\s*([^\n]*)/g);text('mx-error-type',match?match.at(-1).trim().slice(0,300):'Runtime error');text('mx-error-detail',detail.slice(0,12000));});
 const pseudoKey='academy-pseudocode-v1';$('mx-pseudo').value=read(pseudoKey,'');$('mx-pseudo').oninput=()=>save(pseudoKey,$('mx-pseudo').value);
 $('mx-from-flow').onclick=()=>{$('mx-pseudo').value=$('flow-pseudo').textContent;save(pseudoKey,$('mx-pseudo').value);};
 $('mx-export').onclick=()=>download('pseudocode.txt',$('mx-pseudo').value);
}
const activityKey='academy-activity-v1';
const addActivity=(title)=>{const current=read(activityKey,[]);save(activityKey,[{title:String(title).slice(0,200),time:Date.now()},...(Array.isArray(current)?current:[])].slice(0,100));};
const page=document.body.dataset.page;
try{let prev=sessionStorage.getItem('academy-last-route');const route=location.pathname+location.hash;if(prev!==route){addActivity(document.title);sessionStorage.setItem('academy-last-route',route);}}catch{}
if($('mx-activity')){
 function update(){const a=read(activityKey,[]),s=AcademyStorage.clean(read(AcademyStorage.KEY,{})).sessions;$('mx-activity').replaceChildren(...(a.length?a.slice(0,10).map(v=>el('li',new Date(v.time).toLocaleString('id-ID')+' · '+v.title)):[el('li','Belum ada aktivitas.')]));$('mx-sessions').replaceChildren(...(s.length?s.slice(0,10).map(v=>el('li',new Date(v.start).toLocaleString('id-ID')+' · '+Math.floor(v.seconds/60)+' menit')):[el('li','Belum ada sesi selesai.')]));}
 update();document.addEventListener('academy-activity-updated',()=>{addActivity('Sesi belajar diperbarui');update();});
 const faq=[['Bagaimana menjalankan Python?','Buka Python Studio, isi kode dan STDIN, kemudian Jalankan. Runtime dimuat dari CDN; koneksi diperlukan.'],['Bagaimana berhenti dari infinite loop?','Tekan Stop. Worker akan dihentikan; ada juga batas waktu eksekusi.'],['Bisakah belajar offline?','Setelah service worker menyimpan halaman dan indeks, materi dan simulasi JS dapat diakses offline. Python CDN membutuhkan koneksi.'],['Bagaimana menyimpan progres?','Tandai topik, kerjakan kuis, dan gunakan backup JSON di Study Tools. Data tersimpan di browser yang sama.'],['Mengapa program import gagal?','Unduh ZIP bab yang memuat seluruh dependensi atau tambahkan modul di File Manager.'],['Apakah sertifikat resmi?','Tidak. Lencana dan rekap hanya untuk pembelajaran mandiri.'],['Bagaimana memperbesar tulisan?','Buka sidebar, gunakan A+; pengaturan animasi ada di Study Tools.'],['Bagaimana menemukan materi?','Gunakan Ctrl/Cmd+K atau pencarian di sidebar.']];
 const renderHelp=()=>{const q=$('mx-help-search').value.toLowerCase();$('mx-help').replaceChildren(...faq.filter(v=>v.join(' ').toLowerCase().includes(q)).map(([a,b])=>{const d=document.createElement('details');d.append(el('summary',a),el('p',b));return d;}));};$('mx-help-search').oninput=renderHelp;renderHelp();
}
})();