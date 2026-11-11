# Belajar Algoritma — Algoritma dan Struktur Data I

Situs pembelajaran statis berbahasa Indonesia untuk materi Bab 1–4. Sumber materi, halaman, gaya, dan logika situs dipisahkan; `scripts/build.mjs` menghasilkan situs multi-page siap deploy ke GitHub Pages.

## Halaman dan fitur

- Beranda dengan peta belajar, progres, timer fokus, dan materi tersimpan.
- Materi Bab 1–4 pada halaman masing-masing, termasuk operator, ekspresi Boolean, diskon, nilai berbobot, dan pembulatan ongkir.
- Kode Python lengkap untuk tugas-tugas buku, disertai panduan variabel, parameter, dan fungsi.
- Laboratorium interaktif, visualizer algoritma, evaluasi tiap bab, dan referensi cepat.
- Pencarian lintas bab (`Ctrl+K` atau `/`), mode fokus, panduan pintasan (`?`), mode gelap, dan bookmark persisten.
- Kontrol ukuran teks tersimpan, tombol kembali ke atas, layout responsif, navigasi keyboard, dan indikator fokus.
- Lebih dari lima animasi gerak berulang pada logo, navigasi, indikator, visual belajar, progres, dan kuis; semuanya menghormati preferensi reduced motion.
- PWA untuk akses offline setelah halaman pertama dimuat, termasuk kode Python.
- Penulis situs: **Mr.4Nony Alias Josua**.

## Struktur sumber

```text
content/
  chapters/       Materi terpisah Bab 1–4
  home/           Fragmen dashboard
  lab/            Konten laboratorium
  reference/      Konten referensi
  shared/         Navigasi, footer, dan materi kode tugas
scripts/
  build.mjs       Membuat halaman multi-page, aset minifikasi/hash, indeks cari, dan PWA
app.js            Interaksi lintas halaman
styles.css        Gaya situs
Bab 1/, Bab 2/, Bab 3/, Bab 4/
                  Program Python dan tes tugas
dist/             Hasil build (dibuat otomatis, tidak disimpan di Git)
```

`index.html` di root hanya menjadi pintu masuk dokumentasi sumber. Situs yang dihasilkan mempunyai halaman terpisah di `dist/index.html`, `dist/bab-1/` hingga `dist/bab-4/`, `dist/lab/`, dan `dist/referensi/`.

## Build dan uji lokal

Persyaratan: Node.js 22+ dan Python 3 untuk menjalankan tes program.

```powershell
npm ci
npm run build
python -m http.server 8000 --directory dist
```

Buka `http://localhost:8000`. Jalankan tes program per bab:

```powershell
python -B -m unittest discover -s 'Bab 1' -v
python -B -m unittest discover -s 'Bab 2' -v
python -B -m unittest discover -s 'Bab 3' -v
python -B -m unittest discover -s 'Bab 4' -v
```

## Deploy ke GitHub Pages

Workflow [`.github/workflows/pages.yml`](./.github/workflows/pages.yml) memasang dependensi, membangun `dist/`, lalu mengirim hasilnya ke GitHub Pages setiap ada push ke `main`.

1. Pada repository GitHub, buka **Settings → Pages** dan pilih **GitHub Actions** sebagai sumber deployment.
2. Push perubahan ke branch `main`.
3. Periksa **Actions → Deploy learning site to GitHub Pages** dan tunggu sampai langkah deploy berhasil.
4. URL aktif ditampilkan pada hasil workflow atau **Settings → Pages**. Untuk repository ini biasanya `https://jxxzy.github.io/algoritima1/`.

GitHub Pages mengelola header cache server. Build memberi nama hash pada CSS/JavaScript dan menggunakan service worker untuk cache versi aset serta materi offline; konfigurasi ini tidak mengubah TTL header yang ditetapkan GitHub Pages.
