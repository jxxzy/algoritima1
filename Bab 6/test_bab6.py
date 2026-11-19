import unittest
from bab06 import game_tebak
from bab06_skor import akumulasi_skor
from bab06_segiti import segitiga


class UjiBab6(unittest.TestCase):
    def test_tebak_angka(self):
        self.assertEqual(game_tebak([7]), (1, True))
        self.assertEqual(game_tebak([4, 9, 7]), (3, True))
        self.assertEqual(game_tebak([1, 2, 3]), (3, False))
        self.assertEqual(game_tebak([10, 10, 10]), (3, False))

    def test_skor_sentinel_dan_data_invalid(self):
        self.assertEqual(akumulasi_skor([80, 120, 60, -1]), (2, 140, 70, 1))
        self.assertEqual(akumulasi_skor([-1]), (0, 0, None, 0))
        self.assertEqual(akumulasi_skor([0, -1]), (1, 0, 0, 0))
        self.assertEqual(akumulasi_skor([-2, 100, -1]), (1, 100, 100, 1))

    def test_segiti_batas_dan_banyak_cetakan(self):
        self.assertEqual(segitiga(1), (["1"], 1))
        self.assertEqual(segitiga(4), (["1", "1 2", "1 2 3", "1 2 3 4"], 10))
        self.assertEqual(segitiga(6)[1], 21)
        with self.assertRaises(ValueError):
            segitiga(0)
        with self.assertRaises(ValueError):
            segitiga(7)


if __name__ == "__main__":
    unittest.main()
