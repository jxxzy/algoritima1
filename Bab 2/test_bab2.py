import unittest
from contextlib import redirect_stdout
from io import StringIO
from unittest.mock import patch

from luas_dan_keliling import hitung_geometri
from luas_dan_keliling import hitung_geometri_dengan_panjang_cm
from luas_dan_keliling import main as main_geometri
from tarif_parkir import hitung_tarif
from tukar_nilai import tukar


class UjiGeometri(unittest.TestCase):
    def test_luas_dan_keliling_normal(self):
        self.assertEqual(hitung_geometri(5, 3), (15, 16))

    def test_input_pecahan(self):
        self.assertEqual(hitung_geometri(2.5, 4), (10, 13))

    def test_konversi_panjang_cm_ke_meter(self):
        self.assertEqual(hitung_geometri_dengan_panjang_cm(250, 4), (10, 13))

    def test_konversi_menolak_panjang_cm_nol(self):
        with self.assertRaises(ValueError):
            hitung_geometri_dengan_panjang_cm(0, 4)

    def test_konversi_menolak_panjang_cm_nonangka(self):
        with self.assertRaises(TypeError):
            hitung_geometri_dengan_panjang_cm("250", 4)

    def test_sisi_nol_dan_negatif_ditolak(self):
        for panjang, lebar in ((0, 3), (-2, 4), (2, 0)):
            with self.subTest(panjang=panjang, lebar=lebar):
                with self.assertRaises(ValueError):
                    hitung_geometri(panjang, lebar)

    def test_nilai_bukan_angka_terbatas_ditolak(self):
        for panjang in (float("nan"), float("inf")):
            with self.subTest(panjang=panjang):
                with self.assertRaises(ValueError):
                    hitung_geometri(panjang, 3)

    def test_menolak_nilai_nonangka_dan_boolean(self):
        for panjang, lebar in (("5", 3), (True, 3)):
            with self.subTest(panjang=panjang, lebar=lebar):
                with self.assertRaises(TypeError):
                    hitung_geometri(panjang, lebar)

    def test_menolak_overflow_luas(self):
        with self.assertRaisesRegex(ValueError, "rentang float"):
            hitung_geometri(1e308, 1e308)

    def test_menolak_overflow_keliling(self):
        with self.assertRaisesRegex(ValueError, "rentang float"):
            hitung_geometri(1e308, 1)

    def test_menolak_integer_terlalu_besar_untuk_float(self):
        with self.assertRaisesRegex(ValueError, "angka terbatas"):
            hitung_geometri(10**1000, 3)

    def test_menolak_underflow_luas(self):
        with self.assertRaisesRegex(ValueError, "rentang float"):
            hitung_geometri(1e-200, 1e-200)

    def test_angka_terlalu_besar_ditolak_dengan_pesan(self):
        keluaran = StringIO()
        with patch("builtins.input", side_effect=["1e308", "1e308"]):
            with redirect_stdout(keluaran):
                main_geometri()
        self.assertIn("rentang float", keluaran.getvalue())
        self.assertNotIn("Luas =", keluaran.getvalue())

    def test_input_tak_hingga_ditolak_tanpa_hasil(self):
        keluaran = StringIO()
        with patch("builtins.input", side_effect=["inf", "3"]):
            with redirect_stdout(keluaran):
                main_geometri()
        self.assertIn("angka terbatas", keluaran.getvalue())
        self.assertNotIn("Luas =", keluaran.getvalue())


class UjiTarifParkir(unittest.TestCase):
    def test_satu_jam_tidak_mengenakan_tarif_tambahan(self):
        self.assertEqual(hitung_tarif(1), (0, 3_000, 3_000))

    def test_tiga_jam_regresi(self):
        self.assertEqual(hitung_tarif(3), (2, 7_000, 7_000))

    def test_batas_harian_persis(self):
        self.assertEqual(hitung_tarif(7), (6, 15_000, 15_000))

    def test_batas_harian_mengurangi_biaya_di_atas_batas(self):
        self.assertEqual(hitung_tarif(8), (7, 17_000, 15_000))

    def test_durasi_nol_dan_negatif_ditolak(self):
        for jam in (0, -1):
            with self.subTest(jam=jam):
                with self.assertRaises(ValueError):
                    hitung_tarif(jam)

    def test_durasi_noninteger_ditolak(self):
        with self.assertRaises(TypeError):
            hitung_tarif(2.5)


class UjiPertukaran(unittest.TestCase):
    def test_menukar_dua_nilai_berbeda(self):
        self.assertEqual(tukar("merah", "biru"), ("biru", "merah", "merah"))

    def test_nilai_sama_tetap_sama(self):
        self.assertEqual(tukar("teh", "teh"), ("teh", "teh", "teh"))

    def test_nilai_kosong_tetap_dipertukarkan(self):
        self.assertEqual(tukar("", "isi"), ("isi", "", ""))

    def test_menolak_nilai_nonteks(self):
        with self.assertRaises(TypeError):
            tukar(None, "biru")


if __name__ == "__main__":
    unittest.main()
