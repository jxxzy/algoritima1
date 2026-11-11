# Bab 4 — Operator, Ekspresi, dan Aplikasi Mini

Bab ini menerapkan operator aritmetika, perbandingan, dan logika pada aplikasi kasir. Materi web memuat penjelasan dan kunci analisis; berkas Python di folder ini merupakan implementasi yang dapat dijalankan dan diuji.

## Program tugas

- `kasir_belanja.py`: fungsi untuk contoh awal (diskon 10% mulai Rp100.000), kalkulator belanja (diskon 5% mulai Rp50.000 dan kemasan Rp2.000), ongkir tetap, diskon anggota, diskon bertingkat, serta perbandingan dasar diskon.
- `nilai_berbobot.py`: validasi nilai tugas/UTS/UAS 0–100; memuat bobot awal 30%/30%/40% dan contoh perubahan 25%/25%/50%.
- `biaya_pengiriman.py`: ongkir Rp8.000 per kilogram yang ditagihkan, pecahan kilogram dibulatkan ke atas, serta kemasan Rp2.000 per paket.
- `test_bab4.py`: tes normal, nilai batas, penolakan input, hasil CLI, dan kebijakan diskon.

## Hasil uji acuan

| Program / kasus | Input | Hasil |
|---|---|---|
| Kasir, sebelum batas | Rp49.999 × 1 | Diskon Rp0; total Rp51.999 |
| Kasir, tepat ambang | Rp50.000 × 1 | Diskon Rp2.500; total Rp49.500 |
| Kasir, di atas ambang | Rp50.001 × 1 | Diskon Rp2.500; total Rp49.501 |
| Nilai berbobot | Tugas 80, UTS 70, UAS 90 | 24 + 21 + 36 = 81 |
| Bobot pengembangan | Input yang sama, bobot 25/25/50 | 20 + 17,5 + 45 = 82,5 |
| Nilai batas | Semua nilai 100 | Nilai akhir 100 |
| Pengiriman | 1.000 gram | 1 kg; total Rp10.000 |
| Pengiriman | 1.001 gram | 2 kg; total Rp18.000 |
| Penolakan | Harga/jumlah nol, nilai di luar 0–100, atau berat nol | Pesan validasi; tidak ada hasil sukses |

Kasir menghitung diskon atas subtotal sebelum menambahkan kemasan. Untuk subtotal Rp50.000, kebijakan itu menghasilkan Rp49.500. Menghitung diskon atas subtotal plus kemasan berarti dasar Rp52.000 dan tagihan Rp49.400. Keduanya adalah kebijakan berbeda; implementasi utama memilih subtotal sebagai dasar.

## Menjalankan dan menguji

```powershell
python kasir_belanja.py
python nilai_berbobot.py
python biaya_pengiriman.py
python -B -m unittest discover -s 'Bab 4' -v
```
