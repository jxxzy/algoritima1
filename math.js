/* Shared pure arithmetic contract. Inputs are validated at the UI boundary. */
(() => {
 const integer=(v,min)=>{if(!Number.isSafeInteger(v)||v<min)throw new RangeError('Invalid safe integer');return BigInt(v);};
 const geometryRaw=(a,b)=>[a*b,2*(a+b)];
 const temperatureRaw=a=>[a*9/5+32,a+273.15];
 globalThis.AcademyMath=Object.freeze({
  duration(v){const m=integer(v,0);return [m/60n,m%60n,m*60n,m];},
  parking(v){const h=integer(v,1)-1n,b=3000n+h*2000n;return [h,b,b>15000n?15000n:b];},
  shopping(a,b){const subtotal=integer(a,1)*integer(b,1),discount=subtotal>=50000n?subtotal*5n/100n:0n,pack=2000n;return [subtotal,discount,pack,subtotal-discount+pack];},
  geometryRaw,temperatureRaw,
  geometry(a,b){if(![a,b].every(x=>Number.isFinite(x)&&x>0))throw new RangeError('Invalid sizes');const r=geometryRaw(a,b);if(!r.every(Number.isFinite)||r[0]===0)throw new RangeError('Invalid result');return r;},
  temperature(a){if(!Number.isFinite(a)||a< -273.15)throw new RangeError('Invalid temperature');const r=temperatureRaw(a);if(!r.every(Number.isFinite))throw new RangeError('Invalid result');return r;}
 });
})();