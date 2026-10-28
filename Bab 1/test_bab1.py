import unittest
from contextlib import redirect_stdout
from io import StringIO
from unittest.mock import patch

from biaya_kegiatan import hitung_biaya
from kartu_peserta import buat_kartu
from kartu_praktikum import buat_kartu_praktikum
from pendaftaran_tiga_peserta import main as main_pendaftaran
from profil import buat_profil


class UjiProfil(unittest.TestCase):
    def test_spasi_tepi_dihilangkan_dan_spasi_tengah_dipertahankan(self):
        pesan, kesalahan = buat_profil(" Rani Sari ", " Teknologi Informasi ")
        self.assertIsNone(kesalahan)
        self.assertEqual(pesan, "Halo, Rani Sari!\nProfil: Rani Sari | Teknologi Informasi")

    def test_nama_spasi_saja_ditolak(self):
        pesan, kesalahan = buat_profil("   ", "TI")
        self.assertIsNone(pesan)
        self.assertEqual(kesalahan, "Nama dan program studi wajib diisi.")


class UjiKartuPraktikum(unittest.TestCase):
    def test_nim_teks_dan_kelas_dinormalisasi(self):
        kartu, kesalahan = buat_kartu_praktikum(" Siti Aminah ", "00125", "a")
        self.assertEqual(kesalahan, [])
        self.assertIn("NIM  : 00125", kartu)
        self.assertIn("Kelas: A", kartu)

    def test_melaporkan_kekurangan_lebih_dari_satu_kolom(self):
        kartu, kesalahan = buat_kartu_praktikum("", "", " ")
        self.assertIsNone(kartu)
        self.assertEqual(
            kesalahan,
            ["Nama belum diisi.", "NIM belum diisi.", "Kelas belum diisi."],
        )


class UjiKartuPeserta(unittest.TestCase):
    def test_normalisasi_dan_nim_mempertahankan_nol_depan(self):
        kartu, kesalahan = buat_kartu(
            {
                "nama": " Siti Aminah ",
                "NIM": "00125",
                "kelas": "a",
                "kota": "Kota Baru",
                "waktu": "pagi",
            }
        )
        self.assertEqual(kesalahan, [])
        self.assertIn("NIM  : 00125", kartu)
        self.assertIn("Kelas: A", kartu)
        self.assertIn("Siti Aminah", kartu)
        self.assertIn("Kota Baru", kartu)
        self.assertIn("Saya Siti Aminah berasal dari Kota Baru.", kartu)

    def test_melaporkan_semua_kolom_kosong(self):
        kartu, kesalahan = buat_kartu(
            {"nama": "  ", "NIM": "", "kelas": "A", "kota": " ", "waktu": "sore"}
        )
        self.assertIsNone(kartu)
        self.assertEqual(
            kesalahan,
            ["Nama belum diisi.", "NIM belum diisi.", "Kota belum diisi."],
        )

    def test_menolak_sapaan_di_luar_pilihan(self):
        kartu, kesalahan = buat_kartu(
            {
                "nama": "Rani",
                "NIM": "001",
                "kelas": "TI",
                "kota": "Bandung",
                "waktu": "malam",
            }
        )
        self.assertIsNone(kartu)
        self.assertEqual(kesalahan, ["Waktu sapaan harus 'pagi' atau 'sore'."])


class UjiPendaftaranTigaPeserta(unittest.TestCase):
    def test_perulangan_menyelesaikan_tiga_peserta_meski_satu_ditolak(self):
        masukan = [
            "", "001", "A", "Bandung", "pagi",
            "Rani Sari", "002", "B", "Kota Baru", "sore",
            "Dimas", "003", "C", "Surabaya", "pagi",
        ]
        keluaran = StringIO()

        with patch("builtins.input", side_effect=masukan):
            with redirect_stdout(keluaran):
                main_pendaftaran()

        hasil = keluaran.getvalue()
        self.assertEqual(hasil.count("Peserta "), 3)
        self.assertIn("Nama belum diisi.", hasil)
        self.assertIn("NIM  : 002", hasil)
        self.assertIn("NIM  : 003", hasil)


class UjiBiayaKegiatan(unittest.TestCase):
    def test_lima_peserta(self):
        self.assertEqual(hitung_biaya(5), (60_000, 110_000))

    def test_satu_peserta(self):
        self.assertEqual(hitung_biaya(1), (12_000, 62_000))

    def test_menolak_nol_dan_negatif(self):
        for peserta in (0, -2):
            with self.subTest(peserta=peserta):
                with self.assertRaises(ValueError):
                    hitung_biaya(peserta)

    def test_menolak_bukan_integer(self):
        with self.assertRaises(TypeError):
            hitung_biaya(2.5)


if __name__ == "__main__":
    unittest.main()
