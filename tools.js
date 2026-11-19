(() => {
'use strict';
const $=id=>document.getElementById(id), el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
const guarded=(name,fn)=>{try{fn();}catch(e){console.error(name,e);notify(name+' tidak dapat diinisialisasi.');}};
const toast=el('div');toast.className='academy-toast';toast.setAttribute('role','status');toast.hidden=true;document.body.append(toast);let hide;
function notify(message){clearTimeout(hide);toast.textContent=message;toast.hidden=false;hide=setTimeout(()=>toast.hidden=true,4000);}
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{notify('Data tidak dapat disimpan.');return false;}};
const download=(name,data,type)=>{const u=URL.createObjectURL(new Blob([data],{type}));const a=el('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);};
guarded('Pusat perintah',()=>{
 const d=el('dialog');d.className='academy-command';d.setAttribute('aria-label','Pusat perintah');const title=el('h2','Cari menu atau materi'),input=el('input'),list=el('ul'),close=el('button','Tutup');input.type='search';input.placeholder='Ketik nama menu…';input.setAttribute('aria-label','Cari menu atau materi');close.className='button button-quiet';close.onclick=()=>d.close();d.append(title,input,list,close);document.body.append(d);
 const routes=[['Beranda','index.html'],['Python Studio','lab/index.html#python-studio'],['Algorithm Lab','lab/index.html#dynamic-lab'],['Flowchart builder','lab/index.html#flowchart-builder'],['Assessment Center','index.html#assessment-center'],['Study Tools','index.html#study-tools'],['Referensi','referensi/index.html'],['Pomodoro','index.html#timer'],['Bookmark','index.html#tersimpan']];
 try{for(const c of JSON.parse($('curriculum-registry').textContent))for(const t of c.topics)routes.push(['Bab '+c.number+' · '+t.title,t.href]);}catch{}
 let prev=null;
 function render(){const term=input.value.trim().toLowerCase();list.replaceChildren(...routes.filter(([label])=>label.toLowerCase().includes(term)).map(([label,url])=>{const li=el('li'),a=el('a',label);a.href=url;a.onclick=()=>d.close();li.append(a);return li;}));if(!list.children.length)list.append(el('li','Tidak ada hasil.'));}
 function open(){if(d.open)return;prev=document.activeElement;input.value='';render();d.showModal();input.focus();}
 d.addEventListener('close',()=>prev?.focus());input.oninput=render;input.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();list.querySelector('a')?.focus();}if(e.key==='Enter'){e.preventDefault();list.querySelector('a')?.click();}};
 const btn=el('button','Cari / Ctrl K');btn.type='button';btn.className='button button-quiet command-launch';btn.onclick=open;document.querySelector('.topbar')?.append(btn);
 addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();e.stopImmediatePropagation();open();}},true);
});
guarded('Flowchart builder',()=>{
 if(!$('flow-add'))return;const key='academy-flow-v1';const types=['start','input','process','decision','end'];let nodes=[];try{const r=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(r))nodes=r.filter(n=>n&&types.includes(n.kind)&&typeof n.label==='string').slice(0,20).map(n=>({kind:n.kind,label:n.label.slice(0,80),yes:String(n.yes||'').slice(0,80),no:String(n.no||'').slice(0,80)}));}catch{}
 if(!nodes.length)nodes=[{kind:'start',label:'Mulai'},{kind:'process',label:'Tentukan langkah'},{kind:'end',label:'Selesai'}];
 const ns='http://www.w3.org/2000/svg', svgEl=(tag,attrs)=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n;};
 let rendered;
 function render(){const list=$('flow-list');list.replaceChildren();nodes.forEach((n,i)=>{const li=el('li'),label=el('span',n.kind+' · '+n.label);li.append(label);for(const [text,action,disabled] of [['↑',()=>{[nodes[i-1],nodes[i]]=[nodes[i],nodes[i-1]];render();},i===0],['↓',()=>{[nodes[i+1],nodes[i]]=[nodes[i],nodes[i+1]];render();},i===nodes.length-1],['Hapus',()=>{nodes.splice(i,1);render();},false]]){const b=el('button',text);b.type='button';b.disabled=disabled;b.setAttribute('aria-label',text+' node '+(i+1));b.onclick=action;li.append(b);}list.append(li);});
 const height=Math.max(100,nodes.length*118+25),svg=svgEl('svg',{xmlns:ns,viewBox:'0 0 480 '+height,role:'img','aria-label':'Diagram alir',width:480,height});
 const defs=svgEl('defs',{}),marker=svgEl('marker',{id:'flow-arrow',markerWidth:8,markerHeight:8,refX:7,refY:4,orient:'auto'});marker.append(svgEl('path',{d:'M0 0L8 4L0 8Z',fill:'#64748b'}));defs.append(marker);svg.append(defs);
 nodes.forEach((n,i)=>{const y=25+i*118,x=240,attrs={fill:'#eef2ff',stroke:'#6554c0','stroke-width':2};if(i)svg.append(svgEl('path',{d:'M240 '+(y-42)+' V'+y,stroke:'#64748b','stroke-width':2,'marker-end':'url(#flow-arrow)'}));
 let shape=n.kind==='decision'?svgEl('polygon',{points:'240,'+y+' 360,'+(y+38)+' 240,'+(y+76)+' 120,'+(y+38),...attrs}):n.kind==='input'?svgEl('polygon',{points:'135,'+y+' 365,'+y+' 345,'+(y+76)+' 115,'+(y+76),...attrs}):svgEl('rect',{x:120,y,width:240,height:76,rx:['start','end'].includes(n.kind)?38:8,...attrs});svg.append(shape);const text=svgEl('text',{x,y:y+31,'font-size':12,'text-anchor':'middle',fill:'#17213a'});const label=n.label.match(/.{1,28}/g)||[''];label.slice(0,3).forEach((line,j)=>{const t=svgEl('tspan',{x,dy:j===0?0:14});t.textContent=line;text.append(t);});svg.append(text);if(n.kind==='decision'){for(const [which,value,xx] of [['Ya',n.yes,75],['Tidak',n.no,405]]){const t=svgEl('text',{x:xx,y:y+38,'text-anchor':'middle','font-size':10,fill:'#64748b'});t.textContent=which+': '+String(value||'—').slice(0,12);svg.append(t);}}});
 rendered=svg;$('flow-preview').replaceChildren(svg);$('flow-pseudo').textContent=nodes.map(n=>n.kind==='decision'?'IF '+n.label+' THEN\n  '+(n.yes||'...')+'\nELSE\n  '+(n.no||'...')+'\nEND IF':n.kind.toUpperCase()+' '+n.label).join('\n');save(key,nodes);$('flow-status').textContent=nodes.length+' / 20 node';}
 $('flow-add').onclick=()=>{const label=$('flow-label').value.trim();if(!label||nodes.length>=20){notify('Isi langkah dan batasi diagram hingga 20 node.');return;}nodes.push({kind:$('flow-kind').value,label,yes:$('flow-yes').value.trim(),no:$('flow-no').value.trim()});$('flow-label').value='';render();};
 $('flow-clear').onclick=()=>{if(confirm('Hapus semua node?')){nodes=[];render();}};
 $('flow-export').onclick=()=>download('flowchart.svg',new XMLSerializer().serializeToString(rendered),'image/svg+xml');
 $('flow-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('flow-pseudo').textContent);notify('Pseudocode tersalin.');}catch{notify('Gagal menyalin. Pilih teks secara manual.');}};render();
});
guarded('Achievement center',()=>{
 if(!$('ac-achievements'))return;let curriculum=[];try{curriculum=JSON.parse($('curriculum-registry').textContent);}catch{}
 const get=k=>{try{return JSON.parse(localStorage.getItem(k)||'{}');}catch{return {};}};
 const progress=get('belajar-algoritma-progress-v1'),quiz=get('belajar-algoritma-quizzes-v1'),list=$('ac-achievements');const earned=curriculum.filter(c=>c.topics.every(t=>progress?.[t.id]===true)&&quiz?.[c.number]===true);
 list.replaceChildren(...curriculum.map(c=>{const li=el('li',(earned.includes(c)?'✓ ':'○ ')+c.title);li.className=earned.includes(c)?'earned':'locked';return li;}));
 $('ac-certificate').disabled=earned.length!==7;$('ac-certificate').onclick=()=>download('rekap-belajar.txt','ALGORITHM ACADEMY\nRekap penyelesaian mandiri, bukan sertifikat resmi.\n'+new Date().toLocaleDateString('id-ID')+'\n'+earned.map(c=>c.title).join('\n'),'text/plain');
});
})();