(() => {
'use strict';
const KEY='academy-data-v2';
const legacy=['belajar-algoritma-progress-v1','belajar-algoritma-theme-v1','belajar-algoritma-bookmarks-v1','belajar-algoritma-quizzes-v1','belajar-algoritma-reading-size-v1','academy-timer-v2','academy-exams-v1','academy-projects-v1','academy-flow-v1','academy-modules-v1','academy-pseudocode-v1','academy-activity-v1'];
const record=v=>v&&typeof v==='object'&&!Array.isArray(v);
const str=(v,n)=>typeof v==='string'&&v.length<=n;
const limit=(v,n)=>Array.isArray(v)&&v.length<=n;
const finite=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;
const topic=/^b[1-7]-[a-z0-9-]+$/;
const defaults=()=>({note:'',code:'print("Halo, Python!")',goal:30,days:{},history:[],motion:false,session:0,sessions:[]});
function clean(s,strict=false){
 if(strict&&(!record(s)||!str(s.note,20000)||!str(s.code,60000)||!Number.isInteger(s.goal)||s.goal<5||s.goal>480))throw Error('Format data utama tidak valid.');
 if(!record(s))return defaults();
 const days=record(s.days)?Object.fromEntries(Object.entries(s.days).filter(([k,n])=>/^\d{4}-\d{2}-\d{2}$/.test(k)&&finite(n,0,86400)).slice(-730)):{};
 return {...defaults(),note:str(s.note,20000)?s.note:'',code:str(s.code,60000)?s.code:defaults().code,goal:Number.isInteger(s.goal)&&finite(s.goal,5,480)?s.goal:30,days,history:Array.isArray(s.history)?s.history.filter(x=>str(x,500)).slice(0,10):[],motion:s.motion===true,session:finite(s.session,0,Date.now())?s.session:0,sessions:Array.isArray(s.sessions)?s.sessions.filter(x=>record(x)&&finite(x.start,0,Date.now())&&finite(x.end,x.start,Date.now())&&finite(x.seconds,0,28800)).slice(0,100):[]};
}
function validate(k,raw){
 if(raw===null)return null;
 if(!str(raw,1500000))throw Error('Data backup terlalu besar: '+k);
 if(k.endsWith('theme-v1')){if(!['light','dark'].includes(raw))throw Error('Tema invalid');return raw;}
 if(k.endsWith('reading-size-v1')){if(!['normal','large','larger'].includes(raw))throw Error('Ukuran baca invalid');return raw;}
 let x;try{x=JSON.parse(raw);}catch{throw Error('JSON invalid: '+k);}
 let ok=false;
 if(k.endsWith('progress-v1'))ok=record(x)&&Object.entries(x).every(([id,v])=>topic.test(id)&&typeof v==='boolean');
 else if(k.endsWith('quizzes-v1'))ok=record(x)&&Object.entries(x).every(([id,v])=>/^[1-7]$/.test(id)&&typeof v==='boolean');
 else if(k.endsWith('bookmarks-v1'))ok=limit(x,100)&&x.every(v=>typeof v==='string'&&topic.test(v));
 else if(k==='academy-timer-v2')ok=record(x)&&['focus','break'].includes(x.timerPhaseValue)&&[x.focusDuration,x.breakDuration,x.timerRemaining,x.completedFocusSessions].every(v=>finite(v,0,86400000))&&(x.timerDeadline===null||finite(x.timerDeadline,0,Date.now()+86400000));
 else if(k==='academy-exams-v1')ok=limit(x,20)&&x.every(v=>record(v)&&str(v.mode,150)&&str(v.date,100)&&finite(v.score,0,100)&&finite(v.total,1,100)&&v.score<=v.total);
 else if(k==='academy-projects-v1')ok=limit(x,20)&&x.every(v=>record(v)&&str(v.name,50)&&str(v.code,60000)&&str(v.stdin||'',10000));
 else if(k==='academy-flow-v1')ok=limit(x,20)&&x.every(v=>record(v)&&['start','input','process','decision','end'].includes(v.kind)&&str(v.label,80)&&str(v.yes||'',80)&&str(v.no||'',80));
 else if(k==='academy-modules-v1')ok=limit(x,10)&&x.every(v=>record(v)&&/^[a-zA-Z_][a-zA-Z0-9_]{0,39}\.py$/.test(v.name)&&v.name!=='main.py'&&str(v.code,20000))&&new Set(x.map(v=>v.name)).size===x.length;
 else if(k==='academy-pseudocode-v1')ok=str(x,20000);
 else if(k==='academy-activity-v1')ok=limit(x,100)&&x.every(v=>record(v)&&str(v.title,200)&&finite(v.time,0,Date.now()));
 if(!ok)throw Error('Skema data tidak valid: '+k);return JSON.stringify(x);
}
function prepare(v){
 if(!record(v)||v.version!==2||!record(v.legacy))throw Error('Versi backup tidak didukung.');
 const next=clean(v.academy,true);next.session=0;
 const updates=new Map([[KEY,JSON.stringify(next)]]);
 for(const k of legacy)if(Object.hasOwn(v.legacy,k))updates.set(k,validate(k,v.legacy[k]));
 return updates;
}
function restore(storage,updates){const before=new Map([...updates.keys()].map(k=>[k,storage.getItem(k)]));try{for(const [k,v] of updates)v===null?storage.removeItem(k):storage.setItem(k,v);}catch(e){for(const [k,v] of before){try{v===null?storage.removeItem(k):storage.setItem(k,v);}catch{}}throw Error('Pemulihan gagal. Data lama dipulihkan sejauh browser mengizinkan.');}}
globalThis.AcademyStorage=Object.freeze({KEY,legacy,defaults,clean,prepare,restore});
})();