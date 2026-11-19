"""Non-authoritative source inventory, not license or semantic verification."""
import hashlib,json,re,subprocess,unicodedata
from pathlib import Path
root=Path(__file__).resolve().parents[1]
signals={1:['algoritma','input','proses','output'],2:['flowchart','pseudocode','parkir'],3:['variabel','tipe data','suhu'],4:['operator','diskon','nilai'],5:['percabangan','if','else'],6:['perulangan','while','for'],7:['fungsi','parameter','return']}
def normalize(s):
    return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',s).lower())
records=[]
for p in sorted((root/'Materi').glob('*.pdf')):
    match=re.search(r'bab\s*([1-7])\.pdf$',p.name,re.I)
    if not match: continue
    n=int(match.group(1))
    info=subprocess.run(['pdfinfo',str(p)],capture_output=True,text=True,check=True).stdout
    pages=re.search(r'^Pages:\s+(\d+)',info,re.M)
    source=normalize(subprocess.run(['pdftotext','-layout',str(p),'-'],capture_output=True,text=True,check=True).stdout)
    lesson=normalize((root/'content'/'chapters'/f'chapter-{n}.html').read_text())
    programs=sorted(x.name for x in (root/f'Bab {n}').glob('*.py') if not x.name.startswith('test_'))
    matched=[s for s in signals[n] if s in source and s in lesson]
    missing=[s for s in signals[n] if s not in source or s not in lesson]
    records.append({'chapter':n,'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'pages':int(pages.group(1)) if pages else None,'extractable_text':len(source)>100,'common_signals':matched,'unmatched_signals':missing,'program_files':programs,'full_semantic_review':'PENDING','distribution_permission':'UNVERIFIED'})
assert sorted(r['chapter'] for r in records)==list(range(1,8)), 'Expected 7 original chapter PDFs'
report={'method':'PDF text extraction and selected keyword cross-check only; no full equivalence or license claim','sources':records}
(root/'academic-inventory.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
print(json.dumps(report,indent=2,ensure_ascii=False))