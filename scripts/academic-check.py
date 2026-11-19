"""Non-authoritative PDF source inventory, not license or semantic verification."""
import hashlib,json,re,unicodedata
from pathlib import Path
from pypdf import PdfReader
root=Path(__file__).resolve().parents[1]
signals={1:['algoritma','input','proses','output'],2:['flowchart','pseudocode','parkir'],3:['variabel','tipe data','suhu'],4:['operator','diskon','nilai'],5:['percabangan','if','else'],6:['perulangan','while','for'],7:['fungsi','parameter','return']}
def normalize(s):
    return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',s).lower())
records=[]
for p in sorted((root/'Materi').glob('*.pdf')):
    match=re.search(r'bab\s*([1-7])\.pdf$',p.name,re.I)
    if not match: continue
    n=int(match.group(1))
    reader=PdfReader(p)
    texts=[normalize(page.extract_text() or '') for page in reader.pages]
    source=' '.join(texts)
    lesson=normalize((root/'content'/'chapters'/f'chapter-{n}.html').read_text())
    programs=sorted(x.name for x in (root/f'Bab {n}').glob('*.py') if not x.name.startswith('test_'))
    matched=[s for s in signals[n] if s in source and s in lesson]
    missing=[s for s in signals[n] if s not in source or s not in lesson]
    records.append({'chapter':n,'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'pages':len(reader.pages),'extractable_text':len(source)>100,'extractable_pages':sum(len(t)>30 for t in texts),'common_signals':matched,'unmatched_signals':missing,'page_signals':{s:[i+1 for i,t in enumerate(texts) if s in t] for s in signals[n]},'program_files':programs,'full_semantic_review':'PENDING','distribution_permission':'UNVERIFIED'})
assert sorted(r['chapter'] for r in records)==list(range(1,8)), 'Expected 7 original chapter PDFs'
report={'method':'PDF text extraction and selected keyword cross-check only; no full equivalence or license claim','sources':records}
(root/'academic-inventory.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
print(json.dumps(report,indent=2,ensure_ascii=False))
