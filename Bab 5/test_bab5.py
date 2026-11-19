import unittest
from bab05 import predikat_nilai, skor_kuis
from bab05_perpustakaan import status_peminjaman
from bab05_petualangan import jalur_petualangan


class UjiBab5(unittest.TestCase):
    def test_predikat_dan_batas(self):
        self.assertEqual(predikat_nilai(80), "A")
        self.assertEqual(predikat_nilai(79.99), "B")
        self.assertEqual(predikat_nilai(70), "B")
        self.assertEqual(predikat_nilai(60), "C")
        self.assertEqual(predikat_nilai(59), "D")
        with self.assertRaises(ValueError):
            predikat_nilai(101)

    def test_kuis_normalisasi_dan_penolakan(self):
        self.assertEqual(skor_kuis("a", "b"), 20)
        self.assertEqual(skor_kuis(" A ", "B"), 20)
        self.assertEqual(skor_kuis("b", "a"), 0)
        self.assertEqual(skor_kuis("x", "b"), 10)

    def test_peminjaman_batas_dan_alasan(self):
        self.assertEqual(status_peminjaman("ya", "tidak", 2)[0], "Peminjaman diizinkan")
        self.assertIn("Batas pinjaman tercapai", status_peminjaman("ya", "tidak", 3)[1])
        self.assertEqual(len(status_peminjaman("tidak", "ya", 3)[1]), 3)
        self.assertIn("tidak valid", status_peminjaman("mungkin", "tidak", 0)[0])

    def test_petualangan_empat_akhir_dan_penolakan(self):
        self.assertIn("referensi", jalur_petualangan("perpustakaan", "baca"))
        self.assertIn("rencana", jalur_petualangan("PERPUSTAKAAN", "diskusi"))
        self.assertIn("prototipe", jalur_petualangan("laboratorium", "kode"))
        self.assertIn("bug", jalur_petualangan("laboratorium", "uji"))
        self.assertIn("tidak valid", jalur_petualangan("kantin", "baca"))


if __name__ == "__main__":
    unittest.main()
