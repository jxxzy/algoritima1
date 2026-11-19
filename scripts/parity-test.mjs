import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import '../math.js';
const cases={duration:[[0],[59],[60],[135],[9007199254740991]],parking:[[1],[6],[7],[8],[100]],shopping:[[1,1],[49999,1],[50000,1],[50001,1],[25000,3]],geometry:[[5,3],[0.5,1.2],[1e-100,1e-100]],temperature:[[-273.15],[0],[25],[100]]};
const expected=JSON.parse(execFileSync('python',['scripts/parity-reference.py',JSON.stringify(cases)],{encoding:'utf8'}));
for(const [kind,rows] of Object.entries(cases))rows.forEach((args,i)=>{const output=globalThis.AcademyMath[kind](...args);output.forEach((v,j)=>{if(typeof v==='bigint')assert.equal(v.toString(),expected[kind][i][j]);else assert.ok(Math.abs(v-expected[kind][i][j])<=1e-10*Math.max(Math.abs(v),Math.abs(expected[kind][i][j]),1e-300));});});
for(const args of [[0,1],[1e-200,1e-200],[1e308,1e308]])assert.throws(()=>AcademyMath.geometry(...args));
assert.throws(()=>AcademyMath.temperature(-274));assert.throws(()=>AcademyMath.parking(0));assert.throws(()=>AcademyMath.duration(-1));console.log('22 parity cases and 6 JS invalid input checks passed');
