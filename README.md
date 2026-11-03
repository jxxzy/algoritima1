# Belajar Algoritma — Algoritma dan Struktur Data I

Situs pembelajaran statis berbahasa Indonesia untuk materi Bab 1–3. Dibuat dengan HTML, CSS, dan JavaScript
## Isi situs

- **Bab 1:** algoritma dan input–proses–output, kontrak masalah, validasi kartu peserta, tipe NIM, biaya kegiatan, praktikum dan studi kasus.
- **Bab 2:** narasi, pseudocode, simbol flowchart, luas/keliling, tarif parkir, pertukaran nilai, tantangan dan studi kasus.
- **Bab 3:** variabel, tipe data, input/konversi, suhu, durasi, jarak, kecepatan, pemeriksaan balik, praktikum dan studi kasus.
- Pencarian materi, progres topik lokal, tombol salin kode, kuis dengan umpan balik, mode gelap, dan tata letak responsif.
- Navigasi horizontal desktop, menu samping untuk tablet/ponsel, animasi masuk saat menggulir, mode fokus, dan materi tersimpan yang tetap ada di browser.
- Timer fokus bergaya Pomodoro dengan pilihan sesi 25/5, 50/10, dan 90/15 menit, jeda/lanjut, atur ulang, dan progres animasi.
- Peta web menghubungkan 24 praktikum, tantangan, dan studi kasus buku ke semua 14 program Python; setiap tugas membuka kode beserta panduan variabel. Jawaban latihan konsep tersedia di pembahasan masing-masing bab.
- Laboratorium mini untuk mencoba konversi durasi, tarif parkir, dan geometri dengan penelusuran langkah hasil.
- Penampil kode lengkap untuk seluruh 14 program tugas Bab 1–3, dilengkapi panduan variabel/fungsi serta tautan unduh dan salin kode. Kode diambil langsung dari berkas Python yang diuji.
- Kredit penulis situs: **Mr.4Nony Alias Josua**.

## Struktur proyek

```text
.
├── Bab 1/       # Program, tes, jawaban, dan tutorial Bab 1
├── Bab 2/       # Program, tes, jawaban, dan tutorial Bab 2
├── Bab 3/       # Program, tes, jawaban, dan tutorial Bab 3
├── Materi/      # PDF materi sumber Bab 1–3
├── .github/     # Workflow GitHub Pages
├── index.html   # Situs pembelajaran (dipertahankan di root untuk Pages)
├── styles.css
└── app.js
```

PDF materi sumber berada di [Materi](./Materi/README.md).

## Menjalankan lokal

Tidak perlu memasang paket. Buka PowerShell di folder proyek, lalu jalankan:

```powershell
python -m http.server 8000
```

Buka `http://localhost:8000` di browser. Jalankan melalui server lokal (bukan membuka `index.html` sebagai `file://`) agar penampil kode dapat membaca berkas Python.

## Deploy ke GitHub Pages

Workflow `.github/workflows/pages.yml` mengunggah isi root repo sebagai situs Pages saat ada push ke branch `main`, atau saat workflow dijalankan manual.

1. Pastikan repository menggunakan branch `main`.
2. Pada GitHub buka **Settings → Pages** dan pilih **GitHub Actions** sebagai sumber deployment bila belum dipilih.
3. Push perubahan ke `main`.
4. Periksa **Actions → Deploy learning site to GitHub Pages** sampai berhasil. URL situs akan muncul di halaman deployment atau **Settings → Pages**.

Untuk repository proyek ini, URL GitHub Pages biasanya `https://jxxzy.github.io/algoritima1/` setelah Pages diaktifkan, kecuali jika repository memakai custom domain.

## Memverifikasi

Tes program latihan berada per bab:

```powershell
python -B -m unittest discover -s 'Bab 1' -v
python -B -m unittest discover -s 'Bab 2' -v
python -B -m unittest discover -s 'Bab 3' -v
```

`-B` mencegah Python membuat file cache bytecode saat pengujian.
