import json, sys
from pathlib import Path
root = Path(__file__).resolve().parents[1]
for n in (2,3,4):
    sys.path.insert(0,str(root/f'Bab {n}'))
from tarif_parkir import hitung_tarif
from konversi_durasi import konversi_durasi
from luas_dan_keliling import hitung_geometri
from kasir_belanja import hitung_belanja
from konversi_suhu import konversi_suhu
def shopping(a,b):
    r=hitung_belanja(a,b)
    return r.subtotal,r.diskon,r.kemasan,r.total
funcs={'duration':konversi_durasi,'parking':hitung_tarif,'shopping':shopping,'geometry':hitung_geometri,'temperature':konversi_suhu}
print(json.dumps({k:[[str(v) if isinstance(v,int) else v for v in funcs[k](*args)] for args in rows] for k,rows in json.loads(sys.argv[1]).items()}))
