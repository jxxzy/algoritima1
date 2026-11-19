"""Verify production byte content against this deployment's artifact."""
import hashlib,sys,time,urllib.request
from pathlib import Path
from urllib.parse import quote
root=Path(__file__).resolve().parents[1]/'dist'
base=sys.argv[1].rstrip('/')+'/'
paths=['index.html',*(f'bab-{n}/index.html' for n in range(1,8)),'lab/index.html','referensi/index.html','curriculum.json','search-index.json','sw.js']
paths.extend(str(p.relative_to(root)) for p in (root/'assets').iterdir() if p.is_file())
failures=[]
for name in paths:
    expected=hashlib.sha256((root/name).read_bytes()).hexdigest()
    url=base+quote(name,safe='/')+'?verify='+expected[:16]
    error=''
    for i in range(3):
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'AlgorithmAcademy-CI/1.0','Cache-Control':'no-cache'})
            with urllib.request.urlopen(req,timeout=15) as r:
                actual=hashlib.sha256(r.read()).hexdigest()
                if r.status!=200 or actual!=expected: raise ValueError(f'HTTP {r.status}, hash mismatch')
            print('LIVE VERIFIED',name,expected[:16],flush=True); error=''; break
        except Exception as exc:
            error=str(exc)
            if i<2:time.sleep(5)
    if error:failures.append({'file':name,'error':error})
if failures: raise SystemExit('Live verification failed: '+str(failures))
print(f'Live verification passed: {len(paths)} assets/pages.')
