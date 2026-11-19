import unittest
from bab07 import hitung_bayar, hitung_diskon
from bab07_kuis import skor_jawaban
from bab07_parkir import biaya_parkir


class UjiBab7(unittest.TestCase):
    def test_fungsi_diskon_dan_bayar(self):
        self.assertEqual(hitung_diskon(99999), 0)
        self.assertEqual(hitung_diskon(100000), 10000)
        self.assertEqual(hitung_bayar(99999), 99999)
        self.assertEqual(hitung_bayar(100000), 90000)
        with self.assertRaises(ValueError):
            hitung_diskon(-1)
        with self.assertRaises(TypeError):
            hitung_diskon(True)

    def test_fungsi_kuis_murni_dan_normalisasi(self):
        self.assertEqual(skor_jawaban("5", "5"), 10)
        self.assertEqual(skor_jawaban(" DEF ", "def"), 10)
        self.assertEqual(skor_jawaban("4", "5"), 0)
        self.assertEqual(skor_jawaban("", ""), 10)

    def test_fungsi_parkir_murni_dan_batas(self):
        self.assertEqual(biaya_parkir(1), 3000)
        self.assertEqual(biaya_parkir(2), 5000)
        self.assertEqual(biaya_parkir(3), 7000)
        with self.assertRaises(ValueError):
            biaya_parkir(0)
        with self.assertRaises(TypeError):
            biaya_parkir(True)


if __name__ == "__main__":
    unittest.main()
