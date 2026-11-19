"""Generate self-contained practice archives after the site build."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]
dest=root/'dist'/'downloads'
dest.mkdir(parents=True, exist_ok=True)
for n in range(1,8):
    directory=root/f'Bab {n}'
    with ZipFile(dest/f'bab-{n}.zip','w',ZIP_DEFLATED) as z:
        for f in sorted(directory.iterdir()):
            if f.suffix in ('.py','.md'):
                z.write(f,f.name)
