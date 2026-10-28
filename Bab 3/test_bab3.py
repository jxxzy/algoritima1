import unittest
from contextlib import redirect_stdout
from io import StringIO
from unittest.mock import patch

from konversi_durasi import konversi_durasi
from konversi_durasi import main as main_durasi
from konversi_jarak import konversi_jarak
from konversi_kilometer_ke_meter import kilometer_ke_meter
from konversi_kilometer_ke_meter import main as main_kilometer_ke_meter
from konversi_suhu import CELSIUS_MINIMUM
from konversi_suhu import konversi_suhu
from konversi_suhu import main as main_suhu
from konverter_kegiatan import buat_laporan_kegiatan
from kecepatan_perjalanan import hitung_kecepatan
from kecepatan_perjalanan import main as main_kecepatan


class UjiKonversiSuhu(unittest.TestCase):
    def test_titik_uji_suhu(self):
        kasus = (
            (0, (32, 273.15)),
            (100, (212, 373.15)),
            (-40, (-40, 233.15)),
            (25, (77, 298.15)),
        )
        for celsius, harapan in kasus:
            with self.subTest(celsius=celsius):
                aktual = konversi_suhu(celsius)
                self.assertAlmostEqual(aktual[0], harapan[0])
                self.assertAlmostEqual(aktual[1], harapan[1])

    def test_nol_mutlak_diterima(self):
        fahrenheit, kelvin = konversi_suhu(CELSIUS_MINIMUM)
        self.assertAlmostEqual(fahrenheit, -459.67)
        self.assertAlmostEqual(kelvin, 0)

    def test_suhu_di_bawah_nol_mutlak_ditolak(self):
        with self.assertRaisesRegex(ValueError, "nol mutlak"):
            konversi_suhu(CELSIUS_MINIMUM - 0.01)

    def test_menolak_nilai_nonangka_boolean_dan_nonhingga(self):
        for nilai in ("25", True, float("nan"), float("inf")):
            with self.subTest(nilai=nilai):
                with self.assertRaises((TypeError, ValueError)):
                    konversi_suhu(nilai)

    def test_cli_melaporkan_input_nonangka(self):
        keluaran = StringIO()
        with patch("builtins.input", return_value="hangat"):
            with redirect_stdout(keluaran):
                main_suhu()
        self.assertIn("harus berupa angka", keluaran.getvalue())


class UjiKonversiDurasi(unittest.TestCase):
    def test_kasus_normal_dan_batas(self):
        kasus = (
            (135, (2, 15, 8_100, 135)),
            (60, (1, 0, 3_600, 60)),
            (59, (0, 59, 3_540, 59)),
            (0, (0, 0, 0, 0)),
        )
        for menit, harapan in kasus:
            with self.subTest(menit=menit):
                self.assertEqual(konversi_durasi(menit), harapan)

    def test_invariant_rekonstruksi(self):
        for menit in (0, 1, 59, 60, 61, 135, 10_000):
            with self.subTest(menit=menit):
                jam, sisa, detik, rekonstruksi = konversi_durasi(menit)
                self.assertEqual(jam * 60 + sisa, menit)
                self.assertEqual(rekonstruksi, menit)
                self.assertEqual(detik, menit * 60)
                self.assertGreaterEqual(sisa, 0)
                self.assertLess(sisa, 60)

    def test_menolak_durasi_negatif_tipe_salah_dan_boolean(self):
        with self.assertRaises(ValueError):
            konversi_durasi(-1)
        for nilai in (1.5, "60", True):
            with self.subTest(nilai=nilai):
                with self.assertRaises(TypeError):
                    konversi_durasi(nilai)

    def test_cli_menolak_format_noninteger(self):
        keluaran = StringIO()
        with patch("builtins.input", return_value="2.5"):
            with redirect_stdout(keluaran):
                main_durasi()
        self.assertIn("bilangan bulat", keluaran.getvalue())


class UjiKonversiJarak(unittest.TestCase):
    def test_kasus_normal_dan_batas(self):
        kasus = ((0, (0, 0)), (999, (0, 999)), (1_000, (1, 0)), (2_345, (2, 345)))
        for meter, harapan in kasus:
            with self.subTest(meter=meter):
                self.assertEqual(konversi_jarak(meter), harapan)

    def test_menolak_jarak_negatif_tipe_salah_dan_boolean(self):
        with self.assertRaises(ValueError):
            konversi_jarak(-1)
        for nilai in (1.5, "1000", False):
            with self.subTest(nilai=nilai):
                with self.assertRaises(TypeError):
                    konversi_jarak(nilai)


class UjiKonversiKilometerKeMeter(unittest.TestCase):
    def test_konversi_bilangan_bulat_dan_pecahan(self):
        self.assertEqual(kilometer_ke_meter(2), 2_000)
        self.assertEqual(kilometer_ke_meter(1.25), 1_250)
        self.assertEqual(kilometer_ke_meter(0), 0)

    def test_menolak_nilai_negatif_nonangka_dan_nonhingga(self):
        with self.assertRaises(ValueError):
            kilometer_ke_meter(-0.1)
        for nilai in ("1.5", True, float("nan"), float("inf")):
            with self.subTest(nilai=nilai):
                with self.assertRaises((TypeError, ValueError)):
                    kilometer_ke_meter(nilai)

    def test_cli_menampilkan_hasil_dan_menolak_format_salah(self):
        keluaran = StringIO()
        with patch("builtins.input", return_value="1.25"):
            with redirect_stdout(keluaran):
                main_kilometer_ke_meter()
        self.assertIn("1250 meter", keluaran.getvalue())

        keluaran = StringIO()
        with patch("builtins.input", return_value="jarak"):
            with redirect_stdout(keluaran):
                main_kilometer_ke_meter()
        self.assertIn("harus berupa angka kilometer", keluaran.getvalue())
        self.assertNotIn("meter\n", keluaran.getvalue())


class UjiKecepatan(unittest.TestCase):
    def test_kasus_contoh_dan_jarak_nol(self):
        jam, kecepatan = hitung_kecepatan(15, 30)
        self.assertAlmostEqual(jam, 0.5)
        self.assertAlmostEqual(kecepatan, 30)
        self.assertEqual(hitung_kecepatan(0, 20), (20 / 60, 0))

    def test_menolak_waktu_nol_negatif_dan_jarak_negatif(self):
        for jarak, menit in ((10, 0), (10, -1), (-1, 30)):
            with self.subTest(jarak=jarak, menit=menit):
                with self.assertRaises(ValueError):
                    hitung_kecepatan(jarak, menit)

    def test_menolak_input_nonhingga_dan_boolean(self):
        for jarak, menit in ((float("inf"), 30), (10, float("nan")), (True, 30)):
            with self.subTest(jarak=jarak, menit=menit):
                with self.assertRaises((TypeError, ValueError)):
                    hitung_kecepatan(jarak, menit)

    def test_cli_waktu_nol_ditolak_tanpa_kecepatan(self):
        keluaran = StringIO()
        with patch("builtins.input", side_effect=["10", "0"]):
            with redirect_stdout(keluaran):
                main_kecepatan()
        self.assertIn("Waktu harus lebih besar dari nol", keluaran.getvalue())
        self.assertNotIn("Kecepatan rata-rata", keluaran.getvalue())


class UjiLaporanKegiatan(unittest.TestCase):
    def test_identitas_dan_ukuran_ditampilkan_terpisah(self):
        laporan = buat_laporan_kegiatan("  Rani Sari ", 135, 2_345)
        self.assertEqual(
            laporan,
            "Peserta: Rani Sari\n"
            "Durasi: 2 jam 15 menit\n"
            "Total detik: 8100\n"
            "Rekonstruksi durasi: 135 menit\n"
            "Jarak: 2 km 345 m",
        )

    def test_menolak_nama_kosong_dan_pengukuran_invalid(self):
        with self.assertRaises(ValueError):
            buat_laporan_kegiatan("  ", 135, 2_345)
        with self.assertRaises(ValueError):
            buat_laporan_kegiatan("Rani", -1, 2_345)
        with self.assertRaises(ValueError):
            buat_laporan_kegiatan("Rani", 135, -1)


if __name__ == "__main__":
    unittest.main()
