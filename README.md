# Belajar Algoritma — Algoritma dan Struktur Data I

Situs pembelajaran statis berbahasa Indonesia untuk materi Bab 1–3. Dibuat dengan HTML, CSS, dan JavaScript
## Isi situs

- **Bab 1:** algoritma dan input–proses–output, kontrak masalah, validasi kartu peserta, tipe NIM, biaya kegiatan, praktikum dan studi kasus.
- **Bab 2:** narasi, pseudocode, simbol flowchart, luas/keliling, tarif parkir, pertukaran nilai, tantangan dan studi kasus.
- **Bab 3:** variabel, tipe data, input/konversi, suhu, durasi, jarak, kecepatan, pemeriksaan balik, praktikum dan studi kasus.
- Pencarian materi, progres topik lokal, tombol salin kode, kuis dengan umpan balik, mode gelap, dan tata letak responsif.
- Laboratorium mini untuk mencoba konversi durasi, tarif parkir, dan geometri dengan penelusuran langkah hasil.

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

Tidak perlu memasang paket. Dari PowerShell:

```powershell
Set-Location 'D:\MR.4NONY\TUGTIKUM'
python -m http.server 8000
```

Buka `http://localhost:8000` di browser.

## Deploy ke GitHub Pages

Workflow `.github/workflows/pages.yml` mengunggah isi root repo sebagai situs Pages saat ada push ke branch `main`, atau saat workflow dijalankan manual.

1. Pastikan repository menggunakan branch `main`.
2. Pada GitHub buka **Settings → Pages** dan pilih **GitHub Actions** sebagai sumber deployment bila belum dipilih.
3. Push perubahan ke `main`.
4. Periksa **Actions → Deploy learning site to GitHub Pages** sampai berhasil. URL situs akan muncul di halaman deployment atau **Settings → Pages**.

Repo ini bernama `jxxzy.github.io`, sehingga URL akun GitHub Pages biasanya `https://jxxzy.github.io/` setelah Pages diaktifkan.

## Memverifikasi

Tes program latihan berada per bab:

```powershell
Set-Location 'D:\MR.4NONY\TUGTIKUM\Bab 1'; python -B -m unittest -v
Set-Location 'D:\MR.4NONY\TUGTIKUM\Bab 2'; python -B -m unittest -v
Set-Location 'D:\MR.4NONY\TUGTIKUM\Bab 3'; python -B -m unittest -v
```

`-B` mencegah Python membuat file cache bytecode saat pengujian.
