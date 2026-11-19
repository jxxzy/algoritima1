"""Check generated pages, local links and asset targets."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit,unquote
root=Path(__file__).resolve().parents[1]/'dist'
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.links=[]; self.duplicates=set(); self.base='./'
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='base': self.base=a.get('href','./')
        if 'id' in a:
            if a['id'] in self.ids: self.duplicates.add(a['id'])
            self.ids.add(a['id'])
        if tag in ('a','script','link') and (a.get('href') or a.get('src')):
            self.links.append(a.get('href') or a.get('src'))
pages={}
for p in root.rglob('index.html'):
    parser=Page(); parser.feed(p.read_text(encoding='utf8')); pages[p]=parser
assert len(pages)==10, f'Expected 10 pages, found {len(pages)}'
for name in ('search-index.json','curriculum.json','sw.js','python-worker.js','manifest.webmanifest','sitemap.xml','robots.txt'):
    assert (root/name).is_file(),name
for n in range(1,8): assert (root/'downloads'/f'bab-{n}.zip').is_file()
# All new high-priority routes and unique studio controls must exist.
for p,ids in [(root/'index.html',('study-tools','ac-note','ac-backup')),(root/'lab/index.html',('python-studio','ac-run','dynamic-lab','ac-sort-start'))]:
    for id in ids: assert id in pages[p].ids,id
assert 'Lanjut Bab 5' in (root/'bab-4/index.html').read_text(encoding='utf8')
# Report legacy link issues separately, retaining the original learning content.
warnings=[]
for p,parser in pages.items():
    base=urljoin('https://local.invalid/'+p.relative_to(root).as_posix(),parser.base)
    for link in parser.links:
        u=urlsplit(urljoin(base,link))
        if u.netloc!='local.invalid' or u.scheme!='https': continue
        target=root/unquote(u.path.lstrip('/'))
        if target.is_dir(): target=target/'index.html'
        if not target.exists(): warnings.append((str(p.relative_to(root)),link))
        elif u.fragment and target in pages and u.fragment not in pages[target].ids: warnings.append((str(p.relative_to(root)),link))
    if parser.duplicates: warnings.append((str(p.relative_to(root)),str(parser.duplicates)))
print('10 pages, runtime assets, practical ZIPs and key navigation verified.')
for warning in warnings: print('Legacy link/id warning:',warning)
