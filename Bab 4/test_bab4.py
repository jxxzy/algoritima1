import unittest
from contextlib import redirect_stdout
from io import StringIO
from unittest.mock import patch

from biaya_pengiriman import hitung_biaya_pengiriman
from biaya_pengiriman import main as main_pengiriman
from kasir_belanja import bandingkan_kebijakan_diskon
from kasir_belanja import hitung_belanja
from kasir_belanja import hitung_belanja_contoh
from kasir_belanja import hitung_belanja_anggota
from kasir_belanja import hitung_belanja_dengan_ongkir
from kasir_belanja import hitung_diskon_bertingkat
from kasir_belanja import main as main_belanja
from nilai_berbobot import hitung_nilai_akhir
from nilai_berbobot import hitung_nilai_akhir_pengembangan
from nilai_berbobot import main as main_nilai


class UjiKasirBelanja(unittest.TestCase):
    def test_kasus_normal_dan_tiga_titik_ambang(self):
        self.assertEqual(hitung_belanja(25_000, 2).total, 49_500)
        self.assertEqual(hitung_belanja(49_999, 1).diskon, 0)
        tepat_ambang = hitung_belanja(50_000, 1)
        self.assertEqual((tepat_ambang.diskon, tepat_ambang.total), (2_500, 49_500))
        di_atas = hitung_belanja(50_001, 1)
        self.assertEqual((di_atas.diskon, di_atas.total), (2_500, 49_501))

    def test_contoh_inti_diskon_sepuluh_persen_dan_ambang(self):
        contoh = hitung_belanja_contoh(25_000, 4)
        self.assertEqual((contoh.subtotal, contoh.diskon, contoh.total), (100_000, 10_000, 90_000))
        self.assertEqual(hitung_belanja_contoh(99_999, 1).diskon, 0)
        self.assertEqual(hitung_belanja_contoh(100_001, 1).diskon, 10_000)

    def test_diskon_anggota_hanya_jika_memenuhi_kedua_syarat(self):
        self.assertEqual(hitung_belanja_anggota(100_000, 1, True).diskon, 10_000)
        self.assertEqual(hitung_belanja_anggota(100_000, 1, False).diskon, 0)
        self.assertEqual(hitung_belanja_anggota(99_999, 1, True).diskon, 0)

    def test_diskon_bertingkat_tidak_menumpuk(self):
        self.assertEqual(hitung_diskon_bertingkat(49_999), 0)
        self.assertEqual(hitung_diskon_bertingkat(50_000), 2_500)
        self.assertEqual(hitung_diskon_bertingkat(99_999), 4_999)
        self.assertEqual(hitung_diskon_bertingkat(100_000), 10_000)

    def test_perbandingan_dasar_diskon_dan_regresi(self):
        self.assertEqual(bandingkan_kebijakan_diskon(50_000), (49_500, 49_400))
        self.assertEqual(hitung_belanja(50_000, 1).total, 49_500)

    def test_ongkir_tetap_dan_ambang_gratis_dari_subtotal(self):
        berbayar = hitung_belanja_dengan_ongkir(25_000, 1, 5_000, 50_000)
        gratis = hitung_belanja_dengan_ongkir(25_000, 2, 5_000, 50_000)
        self.assertEqual((berbayar.ongkir, berbayar.total), (5_000, 32_000))
        self.assertEqual((gratis.ongkir, gratis.total), (0, 49_500))

    def test_menolak_harga_jumlah_dan_parameter_invalid(self):
        for harga, jumlah in ((0, 1), (-1, 1), (1, 0), (1, -1)):
            with self.subTest(harga=harga, jumlah=jumlah):
                with self.assertRaises(ValueError):
                    hitung_belanja(harga, jumlah)
        for harga, jumlah in ((1.5, 1), (1, True)):
            with self.subTest(harga=harga, jumlah=jumlah):
                with self.assertRaises(TypeError):
                    hitung_belanja(harga, jumlah)

    def test_cli_menolak_input_invalid_tanpa_menampilkan_tagihan(self):
        keluaran = StringIO()
        with patch("builtins.input", side_effect=["0", "2"]):
            with redirect_stdout(keluaran):
                main_belanja()
        self.assertIn("minimal 1", keluaran.getvalue())
        self.assertNotIn("Total bayar", keluaran.getvalue())


class UjiNilaiBerbobot(unittest.TestCase):
    def test_contoh_dan_batas(self):
        hasil = hitung_nilai_akhir(80, 70, 90)
        self.assertEqual(hasil, (24, 21, 36, 81))
        pembanding = hitung_nilai_akhir_pengembangan(80, 70, 90)
        self.assertEqual(pembanding, (20, 17.5, 45, 82.5))
        self.assertEqual(hitung_nilai_akhir(100, 100, 100).nilai_akhir, 100)
        self.assertEqual(hitung_nilai_akhir(0, 0, 0).nilai_akhir, 0)

    def test_menolak_nilai_di_luar_rentang_tipe_salah_dan_nonhingga(self):
        for nilai in (
            (-1, 50, 50),
            (50, 101, 50),
            (50, 50, float("inf")),
            (10**1_000, 50, 50),
        ):
            with self.subTest(nilai=nilai):
                with self.assertRaises(ValueError):
                    hitung_nilai_akhir(*nilai)
        with self.assertRaises(TypeError):
            hitung_nilai_akhir(True, 50, 50)

    def test_cli_menolak_nilai_di_luar_rentang(self):
        keluaran = StringIO()
        with patch("builtins.input", side_effect=["101", "80", "90"]):
            with redirect_stdout(keluaran):
                main_nilai()
        self.assertIn("0 sampai 100", keluaran.getvalue())
        self.assertNotIn("Nilai akhir", keluaran.getvalue())


class UjiBiayaPengiriman(unittest.TestCase):
    def test_pembulatan_berat_dan_batas(self):
        kasus = (
            (1, (1, 8_000, 10_000)),
            (999, (1, 8_000, 10_000)),
            (1_000, (1, 8_000, 10_000)),
            (1_001, (2, 16_000, 18_000)),
        )
        for berat, harapan in kasus:
            with self.subTest(berat=berat):
                self.assertEqual(hitung_biaya_pengiriman(berat), harapan)

    def test_menolak_berat_nol_negatif_dan_bukan_integer(self):
        for berat in (0, -1):
            with self.subTest(berat=berat):
                with self.assertRaises(ValueError):
                    hitung_biaya_pengiriman(berat)
        for berat in (1.5, "1000", True):
            with self.subTest(berat=berat):
                with self.assertRaises(TypeError):
                    hitung_biaya_pengiriman(berat)

    def test_cli_menolak_berat_nol(self):
        keluaran = StringIO()
        with patch("builtins.input", return_value="0"):
            with redirect_stdout(keluaran):
                main_pengiriman()
        self.assertIn("lebih besar dari nol", keluaran.getvalue())
        self.assertNotIn("Total bayar", keluaran.getvalue())


if __name__ == "__main__":
    unittest.main()
