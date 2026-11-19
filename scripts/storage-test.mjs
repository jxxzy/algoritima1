import assert from 'node:assert/strict';import '../storage.js';
const s=AcademyStorage;
const v={version:2,academy:{...s.defaults(),note:'test'},legacy:{'belajar-algoritma-theme-v1':'dark','belajar-algoritma-progress-v1':'{"b1-ipo":true}','academy-modules-v1':'[{"name":"helper.py","code":"x=1"}]'}};
const m=s.prepare(v);assert.equal(JSON.parse(m.get(s.KEY)).note,'test');assert.equal(m.get('belajar-algoritma-theme-v1'),'dark');
assert.throws(()=>s.prepare({...v,legacy:{'belajar-algoritma-progress-v1':'{"evil":true}'}}));
assert.throws(()=>s.prepare({...v,legacy:{'academy-modules-v1':'[{"name":"../x.py","code":"x=1"}]'}}));
assert.throws(()=>s.prepare({...v,academy:{note:'x'}}));
const data=new Map([[s.KEY,'old']]);const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>{if(k==='belajar-algoritma-theme-v1')throw Error('quota');data.set(k,v);},removeItem:k=>data.delete(k)};
assert.throws(()=>s.restore(storage,m));assert.equal(data.get(s.KEY),'old');console.log('Storage migration, backup validation and rollback tests passed.');
